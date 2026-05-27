import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, type ReactNode } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata = {
  title: {
    default: "JuryScan - Análise Inteligente de Processos INSS",
    template: "%s | JuryScan",
  },
  description: "Plataforma completa para advogados e clientes.",
  icons: { icon: "/icon.png" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={<div className="p-4 text-center">Carregando...</div>}>
            {children}
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}