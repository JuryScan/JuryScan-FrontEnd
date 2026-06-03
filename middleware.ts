import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEMO_MODE = false

const PROTECTED_ROUTES = ["/advogado", "/cliente", "/dashboard", "/admin"]
const AUTH_ROUTES = ["/login", "/cadastro"]

interface UserCookie {
  tipoUsuario?: "COMUM" | "ADVOGADO" | "ADMIN"
  [key: string]: unknown
}

interface JWTPayload {
  exp?: number
  [key: string]: unknown
}

/**
 * Decodifica o payload JWT sem validar assinatura.
 */
function decodeJWT(token: string): JWTPayload | null {
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
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime >= payload.exp
}

/**
 * Valida se o usuário tem acesso à rota baseado em sua role
 */
function validateUserRoleForRoute(pathname: string, userRole?: string): boolean {
  if (!userRole) return false

  if (pathname.startsWith("/advogado")) {
    return userRole === "ADVOGADO"
  }

  if (pathname.startsWith("/cliente")) {
    return userRole === "COMUM"
  }

  if (pathname.startsWith("/admin")) {
    return userRole === "ADMIN"
  }

  // Dashboard pode ser acessado por qualquer um autenticado
  if (pathname.startsWith("/dashboard")) {
    return true
  }

  return true
}

export function middleware(request: NextRequest) {
  if (DEMO_MODE) return NextResponse.next()

  const token = request.cookies.get("juryscan_token")?.value
  const userCookie = request.cookies.get("juryscan_user")?.value
  const { pathname } = request.nextUrl

  let userRole: string | undefined
  if (userCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie)) as UserCookie
      userRole = userData.tipoUsuario
    } catch {
      // Se falhar ao decodificar, trata como não autenticado
    }
  }

  // Se existe token, verifica se está expirado
  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL("/auth/session-expired", request.url))
    // Limpa os cookies de autenticação
    response.cookies.set("juryscan_token", "", { maxAge: 0 })
    response.cookies.set("juryscan_user", "", { maxAge: 0 })
    return response
  }

  // Verificação de rotas protegidas
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Validação de role para rotas protegidas específicas
  if (isProtectedRoute && token && !validateUserRoleForRoute(pathname, userRole)) {
    // Redireciona para a rota apropriada baseado na role do usuário
    if (userRole === "ADVOGADO") {
      return NextResponse.redirect(new URL("/advogado/dashboard", request.url))
    }
    if (userRole === "COMUM") {
      return NextResponse.redirect(new URL("/cliente/dashboard", request.url))
    }
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    // Caso contrário, redireciona para login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se usuário autenticado tenta acessar rota de auth, redireciona para dashboard apropriado
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && token && userRole) {
    if (userRole === "ADVOGADO") {
      return NextResponse.redirect(new URL("/advogado/dashboard", request.url))
    }
    if (userRole === "COMUM") {
      return NextResponse.redirect(new URL("/cliente/dashboard", request.url))
    }
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
