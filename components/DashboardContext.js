'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

const routeLabelMap = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  'analisar-cnis': 'Analisar CNIS',
  financeiro: 'Financeiro',
  configuracoes: 'Configurações',
}

const defaultUser = {
  name: 'Julia Martins',
  role: 'Analista Jurídica',
  credits: 12,
  balance: 4270.5,
  initials: 'JM',
}

const DashboardUserContext = React.createContext(null)
const NavigationContext = React.createContext(null)

export function DashboardProvider({ children }) {
  const pathname = usePathname()
  const [selectedRoute, setSelectedRoute] = React.useState('/dashboard')
  const [user, setUser] = React.useState(defaultUser)

  React.useEffect(() => {
    if (pathname?.startsWith('/dashboard')) {
      setSelectedRoute(pathname === '/dashboard' ? '/dashboard' : pathname)
    }
  }, [pathname])

  const logout = React.useCallback(() => {
    setUser(null)
  }, [])

  const breadcrumbs = React.useMemo(() => {
    const base = [{ label: 'Dashboard', href: '/dashboard' }]
    const parts = selectedRoute
      .replace(/^\/dashboard\/?/, '')
      .split('/')
      .filter(Boolean)

    return parts.reduce((crumbs, part) => {
      const previous = crumbs[crumbs.length - 1]?.href ?? '/dashboard'
      const href = `${previous}/${part}`
      return [...crumbs, { label: routeLabelMap[part] ?? part, href }]
    }, base)
  }, [selectedRoute])

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
