"use client"

import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function PagamentoCanceladoPage() {
  const { user } = useAuth()
  const isAdvogado = user?.tipoUsuario === "ADVOGADO"
  const voltar = isAdvogado ? "/advogado/financeiro" : "/cliente/dashboard"
  const comprar = isAdvogado ? "/advogado/financeiro" : "/cliente/checkout"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-gray-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento cancelado</h1>
        <p className="text-gray-600 mb-8">
          Nenhum valor foi cobrado. Você pode tentar novamente quando quiser — seus
          créditos atuais continuam disponíveis na carteira.
        </p>

        <div className="space-y-3">
          <Link href={comprar}>
            <button className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors">
              <RefreshCw className="mr-2 w-5 h-5" />
              Tentar novamente
            </button>
          </Link>
          <Link href={voltar}>
            <button className="w-full py-3 text-gray-600 hover:text-[#633B48] font-medium flex items-center justify-center transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Voltar
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
