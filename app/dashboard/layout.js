import DashboardShell from '@/components/DashboardShell'

export const metadata = {
  title: 'JuryScan | Dashboard',
  description: 'Área administrativa do JuryScan com navegação persistente.',
}

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
