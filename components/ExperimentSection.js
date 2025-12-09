"use client"

import { useState } from "react"
import { Button } from "./ui/button"

export default function ExperimentSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Por favor, insira seu e-mail")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um e-mail válido")
      return
    }

    setSubmitted(true)
    console.log("Email submitted:", email)

    setTimeout(() => {
      setSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section id="servicos" className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Experimente Agora!</h2>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                />
                <Button type="submit" className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-3">
                  Começar
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            </form>
          ) : (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-green-500 text-3xl">✓</span>
              </div>
              <p className="text-green-600 font-medium">Obrigado! Entraremos em contato em breve.</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Não cobramos nada até você conseguir seu primeiro resultado com nossa plataforma.
        </p>
      </div>
    </section>
  )
}
