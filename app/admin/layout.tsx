import React from 'react'
import AdminShell from '@/components/AdminShell'

export const metadata = {
  title: 'JuryScan | Master Admin',
  description: 'Painel de controle global para administradores do JuryScan.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}