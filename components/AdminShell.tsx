"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, LogOut, History, Shield, Menu } from 'lucide-react'
import { DashboardProvider } from '@/components/DashboardContext'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem { href: string; label: string; icon: React.ElementType }

const menuItems: MenuItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard Master', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/logs', label: 'Logs de Atividade', icon: History },
]

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); router.push('/login') }

  return (
    <div className="flex min-h-screen w-full bg-[#F8F5F5]">

      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-white border-r border-[#e8e0e3] flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-[68px]' : 'w-56'}`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#e8e0e3]">
          <div className="size-9 bg-[#633B48] rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">J</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#0A1F30] whitespace-nowrap">JuryScan</p>
              <p className="text-[10px] text-[#A50064] font-bold uppercase tracking-wider whitespace-nowrap">Admin Master</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFECF1] text-[#A50064]'
                    : 'text-[#4a3540] hover:bg-[#F8F5F5] hover:text-[#633B48]'
                }`}
              >
                <Icon className="size-4 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-5 pt-3 border-t border-[#e8e0e3]">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sair' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="size-4 flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sair do Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Header */}
        <header className="h-16 sticky top-0 z-40 border-b border-[#e8e0e3] bg-white px-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-[#633B48] hover:bg-[#FFECF1] transition-colors"
            >
              <Menu className="size-4" />
            </button>
            <div className="h-5 w-px bg-[#e8e0e3]" />
            <div className="flex items-center gap-1.5">
              <Shield className="size-3 text-[#A50064]" />
              <span className="text-xs font-bold text-[#A50064] uppercase tracking-wider">Modo Segurança</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#0A1F30]">{user?.nomeCompleto || 'Administrador'}</p>
              <p className="text-xs text-[#A50064] font-semibold">Admin Master</p>
            </div>
            <div className="size-9 bg-[#633B48] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.nomeCompleto?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </DashboardProvider>
  )
}
