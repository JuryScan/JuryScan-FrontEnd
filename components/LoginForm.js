"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"

const API_URL = "http://localhost:8001/api"

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
        login: credentials.email,
        password: credentials.senha
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      router.push("/auditoria")

    } catch (err) {
      setError("Email ou senha incorretos.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-40 h-16 flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Login</h1>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
          <Button
              type="button"
              variant="outline"
              className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <span className="mr-2">G</span>
            Continuar com o Google
          </Button>

          <div className="text-center text-gray-500 text-sm">ou</div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">👤</span>
            <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="E-mail"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔒</span>
            <input
                type="password"
                name="senha"
                value={credentials.senha}
                onChange={handleChange}
                placeholder="Senha"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
            />
          </div>

          <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#633B48] hover:bg-[#300117] text-white py-3 font-medium disabled:opacity-70"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex flex-col justify-between items-center text-sm">
            <Link href="#" className="text-[#633B48] hover:text-[#300117]">
              Esqueci minha senha
            </Link>
            <Link href="/cadastro" className="text-gray-600 hover:text-gray-900">
              Sem conta? <span className="text-[#633B48]">criar conta</span>
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Ao clicar em "Criar conta", concordo com a{" "}
            <Link href="#" className="text-[#633B48] hover:text-[#300117]">
              política de privacidade
            </Link>{" "}
            da JuryScan.
          </p>
        </form>
      </div>
  )
}