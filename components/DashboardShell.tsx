'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, FileSearch, CreditCard, Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DashboardProvider, useDashboard, useUser } from '@/components/DashboardContext'
import Topbar from '@/components/Topbar'

interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { selectedRoute, setSelectedRoute } = useDashboard()
  const { user } = useUser()

  const userBaseRoute = user?.tipoUsuario === 'ADVOGADO' ? '/advogado' : '/cliente'

  const menuItems: MenuItem[] = [
    { href: `${userBaseRoute}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${userBaseRoute}/auditoria`, label: 'Analisar CNIS', icon: FileSearch },
    { href: `${userBaseRoute}/historico`, label: 'Histórico', icon: FileText },
    { href: `${userBaseRoute}/clientes`, label: 'Clientes', icon: Users },
    { href: `${userBaseRoute}/financeiro`, label: 'Financeiro', icon: CreditCard },
    { href: `${userBaseRoute}/configuracoes`, label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground">JuryScan</p>
                <span className="text-xs text-sidebar-foreground/70">Painel de controle</span>
              </div>
              <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent" />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 pb-4 pt-1">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedRoute === item.href || (item.href.includes('dashboard') && selectedRoute === userBaseRoute)
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setSelectedRoute(item.href)}
                        className="flex w-full items-center gap-3"
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="mt-auto px-4 pb-6 pt-4">
            <div className="rounded-2xl border border-sidebar-border bg-card p-4 text-sm text-sidebar-foreground">
              <div className="font-semibold">Suporte</div>
              <p className="mt-2 text-xs text-sidebar-foreground/80">Dúvidas? Nosso time está disponível para ajudar.</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex flex-1 flex-col">
          <Topbar />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen>
        <ShellContent>{children}</ShellContent>
      </SidebarProvider>
    </DashboardProvider>
  )
}
