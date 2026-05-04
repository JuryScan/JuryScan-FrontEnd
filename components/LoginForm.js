"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"

const API_URL = "http://localhost:8081/api/v1" 

export default function LoginForm() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: "", senha: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const payload = {
        email: credentials.email,
        password: credentials.senha
      }

      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!loginResponse.ok) throw new Error("Email ou senha incorretos.")
      
      const loginData = await loginResponse.json()
      if (loginData.token) localStorage.setItem("token", loginData.token)

      const meResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginData.token}`
        }
      })

      if (!meResponse.ok) throw new Error("Erro ao buscar perfil.")
      
      const userData = await meResponse.json()
      
      const isAdvogado = userData.role === "ADVOGADO" || userData.tipo === "ADVOGADO";

      if (isAdvogado) {
        router.push("/advogado/dashboard")
      } else {
        router.push("/cliente/dashboard")
      }

    } catch (err) {
      setError(err.message || "Erro de conexão.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <h1 className="text-[40px] font-bold text-[#0A1F30] mb-8">Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="w-full space-y-4" onSubmit={handleLogin}>
          
          <button type="button" className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md text-[#A50064] font-semibold hover:bg-gray-50 transition-colors">
            Continuar com o Google
            <img src="/google-icon.svg" alt="" className="w-5 h-5" />
          </button>

          <div className="text-center text-gray-400 text-sm py-2">ou</div>

          <div className="relative">
            <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="E-mail" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-300 text-gray-900" />
          </div>

          <div className="relative">
            <input type="password" name="senha" value={credentials.senha} onChange={handleChange} placeholder="Senha" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-300 text-gray-900" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] py-6 rounded-md font-bold text-lg border-none shadow-none">
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex justify-between items-center text-sm pt-2">
            <Link href="#" className="text-[#A50064] hover:underline font-medium">Esqueci minha senha</Link>
            <div className="text-gray-500">Sem conta? <Link href="/cadastro" className="text-[#A50064] font-medium hover:underline">criar conta</Link></div>
          </div>
        </form>
      </div>
    </div>
  )
}