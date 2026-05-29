/**
 * Middleware do Next.js para proteção de rotas.
 * Redireciona usuários não autenticados para /login.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/advogado", "/cliente", "/dashboard"]
const AUTH_ROUTES = ["/login", "/cadastro"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("juryscan_token")?.value
  const { pathname } = request.nextUrl

  // 1. Se estiver tentando acessar rota protegida SEM token
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    // Opcional: salva a URL original para redirecionar após o login
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Se estiver logado e tentar acessar login/cadastro
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isAuthRoute && token) {
    // Redireciona para o dashboard (ou página inicial do perfil)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configura o middleware para rodar apenas nas rotas especificadas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
