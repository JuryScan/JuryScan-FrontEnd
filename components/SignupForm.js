"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

const API_URL = "http://localhost:8001/api"

export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
    confirmarSenha: "",
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.")
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        name: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        birthDate: formData.dataNascimento,
        email: formData.email,
        phone: formData.telefone,
        address: formData.endereco,
        password: formData.senha
      }

      const response = await fetch(`${API_URL}/users/comum/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao criar conta.")
      }

      router.push("/login")

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-40 h-16 flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Quase lá</h1>
        <p className="text-center text-gray-600 mb-8">
          Preencha todas as informações abaixo para podermos criar sua conta comercial.
        </p>

        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              {error}
            </div>
        )}

        <div className="flex justify-center space-x-4 mb-8">
          <div
              className={`w-10 h-10 ${step >= 1 ? "bg-[#633B48] text-white" : "bg-gray-200 text-gray-500"} rounded-full flex items-center justify-center font-medium`}
          >
            {step > 1 ? "✓" : "1"}
          </div>
          <div
              className={`w-10 h-10 ${step >= 2 ? "bg-[#633B48] text-white" : "bg-gray-200 text-gray-500"} rounded-full flex items-center justify-center font-medium`}
          >
            {step > 2 ? "✓" : "2"}
          </div>
          <div
              className={`w-10 h-10 ${step >= 3 ? "bg-[#633B48] text-white" : "bg-gray-200 text-gray-500"} rounded-full flex items-center justify-center font-medium`}
          >
            3
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Nome Completo</label>
                  <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">CPF</label>
                  <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Data de Nascimento</label>
                  <input
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>
              </>
          )}

          {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">E-mail</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Telefone</label>
                  <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Endereço</label>
                  <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro, cidade"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>
              </>
          )}

          {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Senha</label>
                  <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#633B48] mb-2">Confirmar Senha</label>
                  <input
                      type="password"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      placeholder="Confirme sua senha"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
                  />
                </div>

                <div className="bg-[#FFECF1] border border-[#633B48] rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
                  </p>
                </div>
              </>
          )}

          <div className="flex justify-between pt-4">
            <Button
                type="button"
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                variant="outline"
                className="px-8 py-3 border-gray-300 text-gray-700 bg-transparent disabled:opacity-50"
            >
              Voltar
            </Button>
            {step < 3 ? (
                <Button type="button" onClick={handleNext} className="px-8 py-3 bg-[#633B48] hover:bg-[#300117] text-white">
                  Próximo
                </Button>
            ) : (
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-[#633B48] hover:bg-[#300117] text-white disabled:opacity-70"
                >
                  {isLoading ? "Criando..." : "Finalizar"}
                </Button>
            )}
          </div>
        </form>
      </div>
  )
}