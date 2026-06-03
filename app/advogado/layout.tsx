"use client"

import { type JSX, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, FileSearch, FileText, Store, CreditCard, Settings, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface AdvogadoLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: "/advogado/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/advogado/analise", label: "Análise", icon: FileSearch },
  { href: "/advogado/historico", label: "Histórico", icon: FileText },
  { href: "/advogado/marketplace", label: "Marketplace", icon: Store },
  { href: "/advogado/financeiro", label: "Financeiro", icon: CreditCard },
  { href: "/advogado/configuracoes", label: "Configurações", icon: Settings },
]

export default function AdvogadoLayout({ children }: AdvogadoLayoutProps): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const { logout: authLogout, isLoading, isAuthenticated, isAdvogado, user } = useAuth()

  const logout = () => {
    authLogout()
    router.push("/login")
  }

  // Enquanto está validando a sessão, podemos mostrar um skeleton ou nada
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A50064]"></div>
      </div>
    )
  }

  // Segurança: valida se o usuário está autenticado e é advogado
  if (!isAuthenticated || !isAdvogado) {
    // Redireciona usuários não autorizados
    if (isAuthenticated && !isAdvogado) {
      router.push("/cliente/dashboard")
    } else {
      router.push("/login")
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A50064]"></div>
      </div>
    )
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer group">
                  {user?.fotoUrl ? (
                    <img
                      src={user.fotoUrl}
                      alt={user.nomeCompleto}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#A50064] flex items-center justify-center text-white font-bold text-sm">
                      {user?.nomeCompleto?.charAt(0) || "A"}
                    </div>
                  )}
                  <span className="hidden sm:inline truncate max-w-[150px]">{user?.nomeCompleto || "Usuário"}</span>
                  <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-gray-500">Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/advogado/configuracoes">
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}
