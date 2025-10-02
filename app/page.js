import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import StatsSection from "../components/StatsSection"
import ExperimentSection from "../components/ExperimentSection"
import AboutSection from "../components/AboutSection"
import TestimonialsSection from "../components/TestimonialsSection"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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
