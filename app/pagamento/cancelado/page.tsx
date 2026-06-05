"use client"

import { type JSX } from "react"
import Link from "next/link"
import { XCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Página de retorno do gateway de pagamento (cancelamento).
 * O Stripe redireciona para cá quando o usuário cancela o checkout.
 */
export default function PagamentoCanceladoPage(): JSX.Element {
  const { user } = useAuth()
  const isAdvogado = user?.tipoUsuario === "ADVOGADO"
  const tentarNovamente = isAdvogado ? "/advogado/financeiro" : "/cliente/checkout"
  const inicio = isAdvogado ? "/advogado/dashboard" : "/cliente/dashboard"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento cancelado</h1>
        <p className="text-gray-600 mb-8">
          Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={tentarNovamente}
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold transition-colors"
          >
            Tentar novamente
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href={inicio}
            className="w-full inline-flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-[#633B48] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
