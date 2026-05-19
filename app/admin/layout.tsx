import React from 'react'
import AdminShell from '@/components/AdminShell'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JuryScan | Master Admin',
  description: 'Painel de controle global para administradores do JuryScan.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
