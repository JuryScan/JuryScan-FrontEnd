"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0)

  const testimonials = [
    {
      name: "Marcos Martins",
      role: "Advogado",
      rating: 5,
      text: "A plataforma revolucionou minha prática jurídica. Consigo acompanhar processos de forma muito mais eficiente.",
    },
    {
      name: "Ana Silva",
      role: "Advogada",
      rating: 5,
      text: "Excelente ferramenta para análise de processos do INSS. Recomendo para todos os colegas advogados.",
    },
    {
      name: "Carlos Santos",
      role: "Advogado",
      rating: 5,
      text: "Interface intuitiva e resultados precisos. Economizei muito tempo nos meus processos.",
    },
    {
      name: "Julia Oliveira",
      role: "Advogada",
      rating: 5,
      text: "Ferramenta indispensável para quem trabalha com direito previdenciário. Muito satisfeita!",
    },
    {
      name: "Roberto Lima",
      role: "Advogado",
      rating: 5,
      text: "Suporte excelente e plataforma muito completa. Recomendo fortemente!",
    },
    {
      name: "Patricia Costa",
      role: "Advogada",
      rating: 5,
      text: "Melhor investimento que fiz para meu escritório. Resultados impressionantes!",
    },
  ]

  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const currentTestimonials = testimonials.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Depoimentos de usuários</h2>
        <p className="text-center text-gray-600 mb-12">Confira o que os nossos clientes dizem</p>

        <div className="relative">
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md z-10"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4">
                  <div className="text-gray-400 text-2xl">×</div>
                </div>

                <h4 className="font-bold text-gray-900 text-center mb-1">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm text-center mb-3">{testimonial.role}</p>

                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm text-center leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md z-10"
            aria-label="Próximo"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === index ? "bg-[#633B48]" : "bg-gray-300"
              }`}
              aria-label={`Página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
