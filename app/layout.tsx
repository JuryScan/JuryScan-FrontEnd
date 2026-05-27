import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense, type ReactNode } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css"; 

export const metadata = {
  title: {
    default: "JuryScan - Análise Inteligente de Processos INSS",
    template: "%s | JuryScan",
  },
  description:
    "Plataforma completa para advogados e clientes. Análise de CNIS com inteligência artificial para evitar atrasos com o INSS.",
  keywords: ["INSS", "CNIS", "advogado", "previdenciário", "análise", "processos"],
  openGraph: {
    title: "JuryScan - Análise Inteligente de Processos INSS",
    description: "Plataforma completa para advogados e clientes. Análise de CNIS com inteligência artificial.",
    type: "website",
    locale: "pt_BR",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <Suspense fallback={<div className="p-4 text-center">Carregando...</div>}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}