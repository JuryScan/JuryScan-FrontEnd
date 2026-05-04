import Header from "../components/shared/Header"
import HeroSection from "../components/HeroSection"
import StatsSection from "../components/StatsSection"
import ExperimentSection from "../components/ExperimentSection"
import AboutSection from "../components/AboutSection"
import TestimonialsSection from "../components/TestimonialsSection"
import Footer from "../components/shared/Footer"

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
