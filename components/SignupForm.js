"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

const API_URL = "http://localhost:8081/api/v1" // Ajustei a porta para 8081 conforme o print do seu Swagger

export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Controle do tipo de usuário
  const [userType, setUserType] = useState("comum") // 'comum' ou 'advogado'

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    // Campos específicos do advogado:
    numeroOab: "",
    experiencia: "",
    descricao: "",
  })

  const handleNext = () => { if (step < 3) setStep(step + 1) }
  const handleBack = () => { if (step > 1) setStep(step - 1) }

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
      // Converte a data do formato YYYY-MM-DD para o ISO que o backend exige
      const dataIso = formData.dataNascimento 
        ? new Date(formData.dataNascimento).toISOString() 
        : new Date().toISOString()

      // Monta o payload base (comum a todos)
      const basePayload = {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        dataNascimento: dataIso,
        cpf: formData.cpf.replace(/\D/g, '') // Remove pontuações
      }

      // Prepara o endpoint e o payload final dependendo do tipo
      let endpoint = `${API_URL}/users/comum/register`
      let finalPayload = basePayload

      if (userType === "advogado") {
        endpoint = `${API_URL}/users/advogado/register`
        finalPayload = {
          ...basePayload,
          numeroOab: formData.numeroOab,
          experiencia: formData.experiencia,
          descricao: formData.descricao
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao criar conta. Verifique os dados.")
      }

      router.push("/login")

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para mudar de aba resetando os campos específicos
  const handleTabChange = (type) => {
    setUserType(type)
    setStep(1) // Volta pro passo 1 ao trocar de perfil
    setError("")
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
      <div className="flex justify-center mb-8">
        <img src="/logo.svg" alt="JuryScan" className="w-40 object-contain" />
      </div>

      <h1 className="text-3xl font-bold text-center text-[#0A1F30] mb-2">Criar Conta</h1>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Selecione seu perfil e preencha as informações abaixo.
      </p>

      {/* ABAS: CLIENTE / ADVOGADO */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
        <button
          type="button"
          onClick={() => handleTabChange("comum")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "comum" ? "bg-white text-[#A50064] shadow" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sou Cliente
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("advogado")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "advogado" ? "bg-white text-[#A50064] shadow" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sou Advogado
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      {/* Indicadores de Passo */}
      <div className="flex justify-center space-x-4 mb-8">
        <div className={`w-8 h-8 ${step >= 1 ? "bg-[#FFB6E1] text-[#A50064]" : "bg-gray-100 text-gray-400"} rounded-full flex items-center justify-center font-bold text-sm transition-colors`}>
          {step > 1 ? "✓" : "1"}
        </div>
        <div className={`w-8 h-8 ${step >= 2 ? "bg-[#FFB6E1] text-[#A50064]" : "bg-gray-100 text-gray-400"} rounded-full flex items-center justify-center font-bold text-sm transition-colors`}>
          {step > 2 ? "✓" : "2"}
        </div>
        <div className={`w-8 h-8 ${step >= 3 ? "bg-[#FFB6E1] text-[#A50064]" : "bg-gray-100 text-gray-400"} rounded-full flex items-center justify-center font-bold text-sm transition-colors`}>
          3
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* PASSO 1: Identificação Básica */}
        {step === 1 && (
          <>
            <div>
              <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Nome Completo" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            <div>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 ml-1">Data de Nascimento</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-500" />
            </div>
            {/* OAB só aparece se for Advogado */}
            {userType === "advogado" && (
              <div>
                <input type="text" name="numeroOab" value={formData.numeroOab} onChange={handleChange} placeholder="Número da OAB" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
              </div>
            )}
          </>
        )}

        {/* PASSO 2: Contato e Perfil Profissional */}
        {step === 2 && (
          <>
            <div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            <div>
              <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            
            {/* Campos adicionais do Advogado */}
            {userType === "advogado" && (
              <>
                <div>
                  <input type="text" name="experiencia" value={formData.experiencia} onChange={handleChange} placeholder="Anos de Experiência (ex: 5 anos)" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
                </div>
                <div>
                  <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Breve descrição profissional..." required rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900 resize-none" />
                </div>
              </>
            )}
          </>
        )}

        {/* PASSO 3: Senha */}
        {step === 3 && (
          <>
            <div>
              <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            <div>
              <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} placeholder="Confirmar Senha" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFB6E1] text-gray-900" />
            </div>
            <div className="bg-[#FFECF1] border border-[#FFB6E1] rounded-lg p-3 mt-2">
              <p className="text-xs text-[#A50064] text-center">
                Crie uma senha forte com letras e números.
              </p>
            </div>
          </>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-between pt-4 gap-4">
          <Button type="button" onClick={handleBack} disabled={step === 1 || isLoading} variant="outline" className="flex-1 py-6 border-gray-300 text-gray-700 disabled:opacity-50">
            Voltar
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={handleNext} className="flex-1 py-6 bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] font-bold border-none shadow-none">
              Próximo
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading} className="flex-1 py-6 bg-[#A50064] hover:bg-[#7a004a] text-white font-bold border-none shadow-none transition-colors disabled:opacity-70">
              {isLoading ? "Criando..." : "Finalizar"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}