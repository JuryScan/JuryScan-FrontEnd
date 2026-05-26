import React from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JuryScan | Dashboard',
  description: 'Área administrativa do JuryScan com navegação persistente.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
