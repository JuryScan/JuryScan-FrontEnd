/**
 * Middleware do Next.js para proteção de rotas.
 * Redireciona usuários não autenticados para /login.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  "/advogado",
  "/cliente",
]

// Rotas de autenticação (não devem ser acessíveis se já estiver logado)
const AUTH_ROUTES = ["/login", "/cadastro"]

export function middleware(request: NextRequest) {
  // MOCK: Permite acesso a todas as rotas sem verificação de token
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
