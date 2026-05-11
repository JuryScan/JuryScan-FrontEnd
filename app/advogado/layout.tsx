"use client"

import { type JSX, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, FileText, LogOut } from "lucide-react"

interface AdvogadoLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: "/advogado/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/advogado/auditoria", label: "Auditoria CNIS", icon: FileText },
]

export default function AdvogadoLayout({ children }: AdvogadoLayoutProps): JSX.Element {
  const pathname = usePathname()
  const { logout, isLoading, isAuthenticated, isAdvogado } = useAuth()

  // Enquanto está validando a sessão, podemos mostrar um skeleton ou nada
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A50064]"></div>
      </div>
    )
  }

  // Redundância de segurança caso o middleware falhe ou o usuário não seja advogado
  if (!isAuthenticated || !isAdvogado) {
    return <div className="p-8 text-center">Redirecionando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header interno do advogado */}
      <nav className="bg-[#0A1F30] text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/advogado/dashboard" className="flex items-center gap-2">
                <img src="/logo.svg" alt="JuryScan" className="h-8 w-auto" />
              </Link>

              <div className="flex items-center gap-1">
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
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}
