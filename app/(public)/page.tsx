import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ExperimentSection from "@/components/ExperimentSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";

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
    </div>
  );
}