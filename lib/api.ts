/**
 * Utilitário centralizado para chamadas à API.
 * Inclui token de autenticação automaticamente e trata erros comuns.
 */

import { getToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL && typeof window !== "undefined") {
  console.warn(
    "NEXT_PUBLIC_API_URL não configurada. Verifique o arquivo .env.local"
  )
}

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
}

// Timeout padrão aumentado para 180s para suportar análise de documentos CNIS
// Análises de CNIS podem demorar até 3 minutos dependendo do tamanho do documento
// Operações mais rápidas geralmente completam em <5s
const TIMEOUT_MS = 180000 // 180 segundos (3 minutos)

export interface ApiRequestOptions extends RequestInit {
  timeout?: number
  skipAuth?: boolean
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

/**
 * Retorna os headers com o token de autorização se disponível.
 */
function getHeaders(
  body?: unknown,
  options?: ApiRequestOptions
): Record<string, string> {
  const headers: Record<string, string> = { ...DEFAULT_HEADERS }

  if (body instanceof FormData) {
    delete headers["Content-Type"]
  }

  if (options?.headers) {
    const optionsHeaders = options.headers as Record<string, string>
    Object.assign(headers, optionsHeaders)
  }

  if (!options?.skipAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Cria um AbortController com timeout configurável.
 */
function createTimeoutController(timeoutMs: number): {
  controller: AbortController
  timer: ReturnType<typeof setTimeout>
} {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return { controller, timer }
}

/**
 * Função genérica para requisições HTTP à API.
 */
async function apiFetch<T = unknown>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const timeout = options?.timeout ?? TIMEOUT_MS
  const { controller, timer } = createTimeoutController(timeout)

  try {
    const response = await fetch(url, {
      ...options,
      headers: getHeaders(options?.body, options),
      signal: controller.signal,
      credentials: "same-origin",
    })

    clearTimeout(timer)

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: unknown
      try {
        errorData = await response.json()
      } catch {
        errorData = null
      }

      const message =
        typeof errorData === "object" && errorData !== null && "message" in errorData
          ? (errorData as Record<string, string>).message
          : `Erro ${response.status}: ${response.statusText}`

      // Interceptar erro 401 apenas para sessões que estavam autenticadas
      // Se havia um token válido antes, significa que expirou
      // Se não havia token, é apenas um erro de credenciais (não redireciona)
      if (response.status === 401 && typeof window !== "undefined" && getToken()) {
        // Limpar autenticação
        import("./auth").then(({ clearAuth }) => {
          clearAuth()
        })
        // Redirecionar para página de sessão expirada apenas se havia sessão ativa
        window.location.href = "/auth/session-expired"
        // Retornar erro mas será tratado pelo redirect
        throw new ApiError(response.status, message, errorData)
      }

      throw new ApiError(response.status, message, errorData)
    }

    // Handle empty responses (204 No Content)
    const contentType = response.headers.get("content-type")
    if (!contentType || response.status === 204) {
      return {} as T
    }

    return (await response.json()) as T
  } catch (error: unknown) {
    clearTimeout(timer)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "A requisição excedeu o tempo limite.")
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        0,
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      )
    }

    throw error
  }
}

/**
 * GET request.
 */
export async function get<T = unknown>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: "GET" })
}

/**
 * POST request.
 */
export async function post<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, "method" | "body">
): Promise<T> {
  const isFormData = body instanceof FormData

  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  })
}

/**
 * PUT request.
 */
export async function put<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, "method" | "body">
): Promise<T> {
  const isFormData = body instanceof FormData

  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  })
}

/**
 * PATCH request.
 */
export async function patch<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, "method" | "body">
): Promise<T> {
  const isFormData = body instanceof FormData

  return apiFetch<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  })
}

/**
 * DELETE request.
 */
export async function del<T = unknown>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method">
): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: "DELETE" })
}

export { API_URL }
