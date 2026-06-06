"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, ArrowRight, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function PagamentoSucessoPage() {
  const { user, refreshUser } = useAuth()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    // Atualiza os dados do usuário. O saldo de créditos é creditado pelo webhook do
    // gateway e pode levar alguns segundos para aparecer na carteira.
    refreshUser().finally(() => setRefreshing(false))
  }, [refreshUser])

  const isAdvogado = user?.tipoUsuario === "ADVOGADO"
  const destino = isAdvogado ? "/advogado/financeiro" : "/cliente/dashboard"
  const destinoLabel = isAdvogado ? "Ir para o Financeiro" : "Ir para o Painel"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Recebemos sua compra de créditos. Eles serão adicionados à sua carteira em
          instantes, assim que o gateway confirmar a transação.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Atualizando seus dados...
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" /> Saldo atualizado automaticamente após a confirmação.
            </>
          )}
        </div>

        <Link href={destino}>
          <button className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors">
            {destinoLabel}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </Link>

        {sessionId && (
          <p className="mt-6 text-[11px] text-gray-300 break-all">Ref.: {sessionId}</p>
        )}
      </div>
    </div>
  )
}
