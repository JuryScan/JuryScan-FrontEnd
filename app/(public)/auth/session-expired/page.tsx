"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearAuth } from "@/lib/auth"

export default function SessionExpiredPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Limpa os dados de autenticação quando chega nessa página
    clearAuth()
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Sessão Expirada
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-8 leading-relaxed">
          Sua sessão de autenticação expirou por razões de segurança. Por favor, faça login novamente para continuar.
        </p>

        {/* Button */}
        <Button
          onClick={handleLogin}
          className="w-full bg-[#633B48] hover:bg-[#4a2a36] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          Fazer Login Novamente
        </Button>
      </div>
    </div>
  )
}
