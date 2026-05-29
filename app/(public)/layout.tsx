import { Suspense, type ReactNode } from "react"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import ScrollToTop from "@/components/shared/ScrollToTop"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}