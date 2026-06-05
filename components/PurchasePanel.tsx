"use client"

import { useState, useEffect, useCallback } from "react"
import { Coins, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

// Preço por crédito alinhado ao backend (TokenPricingConfig: 20 centavos/token).
const PRICE_PER_TOKEN_CENTS = 20

const PLANS = [
  { tokens: 50, label: "Inicial", type: "Avulso" },
  { tokens: 150, label: "Popular", type: "Pacote", highlight: true },
  { tokens: 300, label: "Avançado", type: "Pacote" },
]

const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function PurchasePanel() {
  const { user } = useAuth()
  const [processingTokens, setProcessingTokens] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return
    try {
      const res = await get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`)
      if (res.success) setBalance(res.data)
    } catch {
      /* saldo é apenas contexto */
    }
  }, [user?.id])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleBuy = async (tokens: number) => {
    setProcessingTokens(tokens)
    try {
      const res = await post<ApiResponse<any>>("/product-checkout/checkout", {
        name: `${tokens} créditos JuryScan`,
        amount: tokens * PRICE_PER_TOKEN_CENTS,
        quantity: 1,
      })
      if (res.success && res.data?.sessionUrl) {
        window.location.href = res.data.sessionUrl
        return
      }
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
      })
      setProcessingTokens(null)
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
      })
      setProcessingTokens(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-[#633B48] mb-1">Comprar Créditos</h1>
            <p className="text-gray-600">Escolha o pacote ideal. Cada análise consome 1 crédito.</p>
          </div>
          {balance !== null && (
            <p className="text-sm text-gray-600">
              Saldo atual: <strong className="text-[#633B48]">{balance} créditos</strong>
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {PLANS.map((plan) => {
            const amountCents = plan.tokens * PRICE_PER_TOKEN_CENTS
            const isProcessing = processingTokens === plan.tokens
            return (
              <div
                key={plan.tokens}
                className={`bg-white rounded-2xl p-8 border-2 flex flex-col items-center text-center transition-all ${
                  plan.highlight ? "border-[#633B48] shadow-md scale-[1.02]" : "border-gray-100"
                }`}
              >
                {plan.highlight && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFB6E1] text-[#A50064] px-3 py-1 rounded-full mb-3">
                    Mais popular
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-[#FFECF1] flex items-center justify-center text-[#A50064] mb-4">
                  <Coins className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{plan.label}</h2>
                <p className="text-4xl font-bold text-[#633B48] mb-1">{plan.tokens}</p>
                <p className="text-gray-500 mb-4">créditos</p>
                <p className="text-2xl font-bold text-gray-900 mb-6">{formatBRL(amountCents)}</p>
                <button
                  onClick={() => handleBuy(plan.tokens)}
                  disabled={processingTokens !== null}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.highlight
                      ? "bg-[#633B48] text-white hover:bg-[#300117]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-70`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecionando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Comprar
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pagamento processado com segurança pela Stripe.
        </p>
      </div>
    </div>
  )
}
