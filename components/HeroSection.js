"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { X } from "lucide-react"

export default function HeroSection() {
  const [showOverlay, setShowOverlay] = useState(true)

  return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
                Quer evitar atrasos com o INSS?
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A tecnologia da nossa plataforma auxilia na análise de processos do INSS, oferecendo insights precisos e
                atualizados. Nossa ferramenta é uma solução completa para advogados que desejam otimizar sua prática
                jurídica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-3">Sobre</Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src="/HeroImage.jpg"
                    alt="Hero"
                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}