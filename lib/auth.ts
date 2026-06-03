/**
 * Gerenciamento seguro de tokens de autenticação.
 * Usa cookies com flags de segurança ao invés de localStorage puro.
 */

const TOKEN_COOKIE_NAME = "juryscan_token"
const USER_COOKIE_NAME = "juryscan_user"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 horas

/**
 * Define um cookie com flags de segurança.
 */
function setSecureCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE): void {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict; Secure=${window.location.protocol === "https:"}`
}

/**
 * Retorna o valor de um cookie pelo nome (apenas no browser).
 * Retorna null durante SSR.
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

/**
 * Remove um cookie definindo max-age=0.
 */
function removeCookie(name: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`
}

export interface UserData {
  id: string
  nomeCompleto: string
  email: string
  tipoUsuario?: "COMUM" | "ADVOGADO" | "ADMIN"
  telefone?: string
  numeroOab?: string
  experiencia?: string
  descricao?: string
  fotoUrl?: string
  enderecoUrl?: string
  [key: string]: unknown
}

/**
 * Armazena o token de autenticação em cookie seguro.
 */
export function setToken(token: string): void {
  setSecureCookie(TOKEN_COOKIE_NAME, token)
}

/**
 * Retorna o token de autenticação armazenado.
 */
export function getToken(): string | null {
  return getCookie(TOKEN_COOKIE_NAME)
}

/**
 * Remove o token de autenticação.
 */
export function removeToken(): void {
  removeCookie(TOKEN_COOKIE_NAME)
}

/**
 * Armazena dados do usuário em cookie.
 */
export function setUser(user: UserData): void {
  setSecureCookie(USER_COOKIE_NAME, JSON.stringify(user))
}

/**
 * Retorna os dados do usuário armazenados.
 */
export function getUser(): UserData | null {
  const raw = getCookie(USER_COOKIE_NAME)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserData
  } catch {
    return null
  }
}

/**
 * Remove os dados do usuário.
 */
export function removeUser(): void {
  removeCookie(USER_COOKIE_NAME)
}

/**
 * Verifica se o usuário está autenticado (token existe).
 */
export function isAuthenticated(): boolean {
  return getToken() !== null
}

/**
 * Verifica se o usuário tem o role de advogado.
 */
export function isAdvogado(): boolean {
  const user = getUser()
  if (!user) return false
  return user.tipoUsuario === "ADVOGADO"
}

/**
 * Limpa todos os dados de autenticação (logout completo).
 */
export function clearAuth(): void {
  removeToken()
  removeUser()
}

/**
 * Decodifica o payload JWT sem validar assinatura.
 * Retorna o payload ou null se inválido.
 */
interface JWTPayload {
  exp?: number
  [key: string]: unknown
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = Buffer.from(payload, "base64").toString("utf-8")
    return JSON.parse(decoded) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Verifica se o token JWT está expirado.
 * Retorna true se expirado, false se válido.
 */
export function isTokenExpired(token?: string | null): boolean {
  const tokenToCheck = token ?? getToken()
  if (!tokenToCheck) return true
  
  const payload = decodeJWT(tokenToCheck)
  if (!payload || !payload.exp) return true
  
  // exp está em segundos, Date.now() retorna millisegundos
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime >= payload.exp
}
