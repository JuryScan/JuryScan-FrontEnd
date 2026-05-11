import HeroSection from "@/components/HeroSection"
import StatsSection from "@/components/StatsSection"
import ExperimentSection from "@/components/ExperimentSection"
import AboutSection from "@/components/AboutSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import Footer from "@/components/shared/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Início - JuryScan",
  description: "Análise inteligente de processos INSS com inteligência artificial para advogados e clientes.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <StatsSection />
        <ExperimentSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
