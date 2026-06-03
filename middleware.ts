import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEMO_MODE = false

const PROTECTED_ROUTES = ["/advogado", "/cliente", "/dashboard", "/admin"]
const AUTH_ROUTES = ["/login", "/cadastro"]

export function middleware(request: NextRequest) {
  if (DEMO_MODE) return NextResponse.next()

  const token = request.cookies.get("juryscan_token")?.value
  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
