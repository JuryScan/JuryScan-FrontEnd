"use client"

import { type JSX, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, FileText, Inbox, Settings, LogOut } from "lucide-react"

interface ClienteLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: "/cliente/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cliente/meus-pedidos", label: "Meus Pedidos", icon: Inbox },
  { href: "/cliente/relatorio", label: "Relatórios", icon: FileText },
]

export default function ClienteLayout({ children }: ClienteLayoutProps): JSX.Element {
  const pathname = usePathname()
  const { logout: authLogout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const logout = () => { authLogout(); router.push('/login') }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A50064]"></div>
      </div>
    )
  }

  // if (!isAuthenticated) {
  //   return <div className="p-8 text-center">Redirecionando...</div>
  // }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header interno do cliente */}
      <nav className="bg-[#0A1F30] text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/cliente/dashboard" className="flex items-center gap-2">
                <img src="/logo.svg" alt="JuryScan" className="h-8 w-auto" />
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#FFB6E1] text-[#A50064]"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/cliente/configuracoes"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/cliente/configuracoes"
                    ? "bg-[#FFB6E1] text-[#A50064]"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}
