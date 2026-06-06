"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, Coins, Loader2, Check, Wallet } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

// Pacotes de créditos. Preço honesto: R$ 0,20 por crédito (o webhook credita amount/20).
// Cada análise de CNIS consome 30 créditos.
const CREDITOS_POR_ANALISE = 30

interface Pacote {
  creditos: number
  preco: number
  label: string
  destaque: boolean
}

const PACOTES: Pacote[] = [
  { creditos: 30, preco: 6.0, label: "Inicial", destaque: false },
  { creditos: 90, preco: 18.0, label: "Mais popular", destaque: true },
  { creditos: 300, preco: 60.0, label: "Avançado", destaque: false },
]

const formatBRL = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function CheckoutCreditosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const [processingCreditos, setProcessingCreditos] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  const fetchBalance = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingBalance(false)
      return
    }
    setIsLoadingBalance(true)
    try {
      const res = await get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`)
      if (res.success) setBalance(res.data)
    } catch {
      // saldo é apenas informativo nesta tela; ignora falha
    } finally {
      setIsLoadingBalance(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleComprar = async (pacote: Pacote) => {
    setProcessingCreditos(pacote.creditos)
    try {
      const response = await post<ApiResponse<{ sessionUrl?: string }>>("/product-checkout/checkout", {
        name: `${pacote.creditos} créditos JuryScan`,
        amount: Math.round(pacote.preco * 100),
        quantity: 1,
      })

      if (response.success && response.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl
        return
      }

      toast({
        title: "Pagamento indisponível",
        description: "Não foi possível iniciar o pagamento. Tente novamente em instantes.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Erro no checkout:", error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setProcessingCreditos(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-[#633B48] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <ShieldCheck className="w-4 h-4" />
            Pagamento via gateway seguro
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprar créditos</h1>
          <p className="text-gray-600">
            Os créditos ficam na sua carteira e são usados nas análises do seu CNIS
            (cada análise consome {CREDITOS_POR_ANALISE} créditos).
          </p>
        </div>

        <div className="mb-8 inline-flex items-center gap-3 bg-[#0A1F30] text-white rounded-2xl px-6 py-4 shadow-sm">
          <Wallet className="w-5 h-5 text-[#FFB6E1]" />
          <span className="text-sm text-gray-300">Saldo atual:</span>
          {isLoadingBalance ? (
            <div className="flex items-center gap-2">
              <div className="h-6 bg-white/10 rounded animate-pulse w-32"></div>
              <Loader2 className="w-4 h-4 animate-spin text-[#FFB6E1]" />
            </div>
          ) : (
            <span className="text-xl font-bold">
              {balance !== null ? `${balance} créditos` : "--"}
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-stretch">
          {PACOTES.map((pacote) => {
            const analises = Math.floor(pacote.creditos / CREDITOS_POR_ANALISE)
            const isProcessing = processingCreditos === pacote.creditos
            const anyProcessing = processingCreditos !== null
            return (
              <div
                key={pacote.creditos}
                className={`relative rounded-2xl border-2 p-8 flex flex-col items-center text-center bg-white transition-colors ${
                  pacote.destaque ? "border-[#633B48] shadow-md" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {pacote.destaque && (
                  <span className="absolute -top-3 bg-[#633B48] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pacote.label}
                  </span>
                )}
                {!pacote.destaque && (
                  <span className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">
                    {pacote.label}
                  </span>
                )}

                <div className="flex items-center gap-2 mt-3 mb-1">
                  <Coins className="w-6 h-6 text-[#633B48]" />
                  <span className="text-4xl font-bold text-[#0A1F30]">{pacote.creditos}</span>
                </div>
                <span className="text-sm text-gray-500 mb-1">créditos</span>
                <span className="text-xs text-gray-400 mb-4">
                  equivale a {analises} {analises === 1 ? "análise" : "análises"}
                </span>

                <div className="text-2xl font-bold text-[#0A1F30] mb-6">{formatBRL(pacote.preco)}</div>

                <button
                  onClick={() => handleComprar(pacote)}
                  disabled={anyProcessing}
                  className={`mt-auto w-full h-11 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                    pacote.destaque
                      ? "bg-[#633B48] text-white hover:bg-[#300117]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Comprar</>}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Você será redirecionado ao gateway para concluir o pagamento com segurança.
        </div>
      </div>
    </div>
  )
}
