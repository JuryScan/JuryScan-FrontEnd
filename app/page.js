"use client";

import { useState } from "react";

import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ExperimentSection from "../components/ExperimentSection";
import AboutSection from "../components/AboutSection";
import TestimonialsSection from "../components/TestimonialsSection";

import Footer from "../components/shared/Footer";
import Header from "@/components/shared/Header"
import Drawer from "../components/Drawer";

export default function HomePage() {

  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(null);

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

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        client={client}
      />

    </div>
  );
}