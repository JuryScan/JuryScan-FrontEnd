'use client'

import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useUser, useDashboard } from '@/components/DashboardContext'
import { ChevronRight, LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function Topbar() {
  const { user, logout } = useUser()
  const { breadcrumbs } = useDashboard()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Você está em</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                {breadcrumbs.map((item, index) => (
                  <span key={item.href} className="inline-flex items-center gap-2">
                    <span className="text-foreground/80">{item.label}</span>
                    {index < breadcrumbs.length - 1 ? (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Créditos
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {user ? user.credits : 0}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Saldo em conta</div>
              <div className="text-sm font-semibold text-foreground">
                {currencyFormatter.format(user?.balance ?? 0)}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 text-left transition hover:bg-muted focus:outline-none">
                  <Avatar>
                    <AvatarFallback>{user?.initials ?? 'US'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? 'Usuário'}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.role ?? 'Convidado'}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Conta</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default">Perfil</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
