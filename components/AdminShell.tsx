"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, FileSearch, CreditCard, Settings, ShieldAlert, LogOut, History } from 'lucide-react'
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
import { DashboardProvider, useDashboard } from '@/components/DashboardContext'
import { useAuth } from '@/contexts/AuthContext'
import Topbar from '@/components/Topbar'

interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
}

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const { selectedRoute, setSelectedRoute } = useDashboard()
  const { logout } = useAuth()

  const menuItems: MenuItem[] = [
    { href: `/admin/dashboard`, label: 'Dashboard Master', icon: LayoutDashboard },
    { href: `/admin/usuarios`, label: 'Usuários', icon: Users },
    { href: `/admin/logs`, label: 'Logs de Atividade', icon: History },
    { href: `/admin/transacoes`, label: 'Transações', icon: CreditCard },
    { href: `/admin/configuracoes`, label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-[#633B48] rounded-lg flex items-center justify-center text-white font-bold">J</div>
                <div>
                  <p className="text-sm font-bold text-sidebar-foreground">Admin Master</p>
                  <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Modo Segurança</span>
                </div>
              </div>
              <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent" />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 pb-4 pt-1">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedRoute === item.href
                
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
                        className={`flex w-full items-center gap-3 ${isActive ? 'text-[#633B48]' : ''}`}
                      >
                        <Icon className="size-4" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="mt-auto px-4 pb-6 pt-4">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="size-4 mr-2" />
                        <span>Sair do Admin</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-xs text-orange-700">
              <div className="font-bold flex items-center gap-1 mb-1">
                <ShieldAlert className="size-3" /> Atenção
              </div>
              <p>Você está no modo administrativo. Todas as ações são auditadas e registradas.</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex flex-1 flex-col">
          <Topbar />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-gray-50/50">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen>
        <AdminShellContent>{children}</AdminShellContent>
      </SidebarProvider>
    </DashboardProvider>
  )
}
