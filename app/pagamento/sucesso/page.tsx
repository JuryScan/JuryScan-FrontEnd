"use client"

import { useEffect, type JSX } from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Página de retorno do gateway de pagamento (sucesso).
 * O Stripe redireciona para cá após o checkout; o saldo é creditado pelo webhook
 * e fica visível na carteira/financeiro.
 */
export default function PagamentoSucessoPage(): JSX.Element {
  const { user, isLoading, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const isAdvogado = user?.tipoUsuario === "ADVOGADO"
  const destino = isAdvogado ? "/advogado/financeiro" : "/wallet"
  const destinoLabel = isAdvogado ? "Ir para o Financeiro" : "Ver minha carteira"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h1>
        <p className="text-gray-600 mb-8">
          Seus créditos foram adicionados à sua carteira. O saldo pode levar alguns
          segundos para atualizar.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <Link
            href={destino}
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold transition-colors"
          >
            {destinoLabel}
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  )
}
