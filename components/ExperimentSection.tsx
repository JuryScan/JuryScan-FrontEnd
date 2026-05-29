"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export default function ExperimentSection(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: FormEvent) => {
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

    // Leva o visitante direto ao cadastro, ja com o e-mail preenchido.
    router.push(`/cadastro?email=${encodeURIComponent(email)}`)
  }

  return (
    <section id="servicos" className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Experimente Agora!
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="E-mail"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  aria-label="Endereço de e-mail para contato"
                />
                <Button
                  type="submit"
                  className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-3"
                >
                  Começar
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-left" role="alert">
                  {error}
                </p>
              )}
            </form>
        </div>

        <p className="text-sm text-gray-500">
          Não cobramos nada até você conseguir seu primeiro resultado com nossa
          plataforma.
        </p>
      </div>
    </section>
  )
}
