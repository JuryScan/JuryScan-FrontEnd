'use client'

import Link from 'next/link'
import { LayoutDashboard, Users, FileSearch, CreditCard, Settings, ShieldCheck } from 'lucide-react'
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
  SidebarInset,
} from '@/components/ui/sidebar'
import { DashboardProvider, useDashboard } from '@/components/DashboardContext'
import Topbar from '@/components/Topbar'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/analisar-cnis', label: 'Analisar CNIS', icon: FileSearch },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: CreditCard },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

function ShellContent({ children }) {
  const { selectedRoute, setSelectedRoute } = useDashboard()

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
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={selectedRoute === item.href}
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

        <main className="flex flex-1 flex-col md:ml-[var(--sidebar-width)]">
          <Topbar />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardShell({ children }) {
  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen>
        <ShellContent>{children}</ShellContent>
      </SidebarProvider>
    </DashboardProvider>
  )
}
