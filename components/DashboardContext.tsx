'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import type { UserData } from '@/lib/auth'

export interface DashboardUser extends UserData {
  name: string
  role: string
  credits: number
  balance: number
  initials: string
}

interface Breadcrumb {
  label: string
  href: string
}

interface NavigationContextType {
  selectedRoute: string
  setSelectedRoute: (route: string) => void
  breadcrumbs: Breadcrumb[]
}

interface DashboardUserContextType {
  user: DashboardUser | null
  logout: () => void
}

const routeLabelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  'analisar-cnis': 'Analisar CNIS',
  financeiro: 'Financeiro',
  configuracoes: 'Configurações',
  auditoria: 'Auditoria',
}

const DashboardUserContext = React.createContext<DashboardUserContextType | undefined>(undefined)
const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user: authUser, logout: authLogout } = useAuth()
  const [selectedRoute, setSelectedRoute] = React.useState('/dashboard')

  // Mapeia o usuário do AuthContext para o formato esperado pelo Dashboard
  const user = React.useMemo<DashboardUser | null>(() => {
    if (!authUser) return null
    return {
      name: authUser.nomeCompleto || 'Usuário',
      role: authUser.tipoUsuario === 'ADVOGADO' ? 'Advogado' : 'Cliente',
      credits: (authUser as any).credits || 0,
      balance: (authUser as any).balance || 0,
      initials: (authUser.nomeCompleto || 'U')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2),
      ...authUser,
      id: authUser.id,
      nomeCompleto: authUser.nomeCompleto,
      email: authUser.email,
    }
  }, [authUser])

  React.useEffect(() => {
    if (pathname) {
      setSelectedRoute(pathname)
    }
  }, [pathname])

  const logout = React.useCallback(() => {
    authLogout()
  }, [authLogout])

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    if (!pathname) return []
    const parts = pathname.split('/').filter(Boolean)

    return parts.reduce<Breadcrumb[]>((crumbs, part, index) => {
      const href = '/' + parts.slice(0, index + 1).join('/')
      const label = routeLabelMap[part] || (part.charAt(0).toUpperCase() + part.slice(1))
      return [...crumbs, { label, href }]
    }, [])
  }, [pathname])

  return (
    <DashboardUserContext.Provider value={{ user, logout }}>
      <NavigationContext.Provider
        value={{ selectedRoute, setSelectedRoute, breadcrumbs }}
      >
        {children}
      </NavigationContext.Provider>
    </DashboardUserContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(NavigationContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider.')
  }
  return context
}

export function useUser() {
  const context = React.useContext(DashboardUserContext)
  if (!context) {
    throw new Error('useUser must be used within a DashboardProvider.')
  }
  return context
}
