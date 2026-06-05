"use client"

import { useState, useEffect, useCallback, type JSX } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, ShieldCheck, Coins, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

// Preço por crédito alinhado ao backend (TokenPricingConfig: 20 centavos/token).
// Assim o nº de créditos exibido é exatamente o creditado pelo webhook (valor/20).
const PRICE_PER_TOKEN_CENTS = 20

const PACKS = [
  { tokens: 50, label: "Inicial" },
  { tokens: 150, label: "Popular", highlight: true },
  { tokens: 300, label: "Avançado" },
]

const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function CheckoutCreditosPage(): JSX.Element {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedTokens, setSelectedTokens] = useState<number>(PACKS[1].tokens)
  const [isProcessing, setIsProcessing] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return
    try {
      const res = await get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`)
      if (res.success) setBalance(res.data)
    } catch {
      /* silencioso: saldo é apenas contexto */
    }
  }, [user?.id])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const amountCents = selectedTokens * PRICE_PER_TOKEN_CENTS

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const res = await post<ApiResponse<any>>("/product-checkout/checkout", {
        name: `${selectedTokens} créditos JuryScan`,
        amount: amountCents,
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
      setIsProcessing(false)
    } catch (error) {
      console.error("Erro no checkout:", error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans flex flex-col items-center">
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
            <Lock className="w-4 h-4" />
            Ambiente Seguro
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-6 mt-8">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprar créditos</h1>
          <p className="text-gray-600">
            Cada análise de CNIS consome 1 crédito.
            {balance !== null && (
              <span className="ml-1 font-medium text-[#633B48]">
                Seu saldo atual: {balance} créditos.
              </span>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            {PACKS.map((pack) => {
              const isSelected = pack.tokens === selectedTokens
              return (
                <button
                  key={pack.tokens}
                  onClick={() => setSelectedTokens(pack.tokens)}
                  className={`w-full flex items-center justify-between rounded-2xl border-2 p-6 text-left transition-all ${
                    isSelected
                      ? "border-[#633B48] bg-[#FFECF1]/40"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#633B48] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{pack.tokens} créditos</span>
                        {pack.highlight && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFB6E1] text-[#A50064] px-2 py-0.5 rounded-full">
                            Mais popular
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{pack.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      {formatBRL(pack.tokens * PRICE_PER_TOKEN_CENTS)}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[#633B48] bg-[#633B48] text-white" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="md:col-span-1">
            <div className="bg-[#0A1F30] rounded-2xl shadow-lg border border-[#14324a] p-6 text-white sticky top-24">
              <h3 className="font-bold text-xl mb-6 border-b border-[#14324a] pb-4">Resumo do Pedido</h3>

              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-[#14324a] p-2 rounded-lg">
                    <Coins className="w-5 h-5 text-[#FFB6E1]" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedTokens} créditos JuryScan</p>
                    <p className="text-xs text-gray-400 mt-1">Adicionados à sua carteira</p>
                  </div>
                </div>
                <span className="font-bold whitespace-nowrap">{formatBRL(amountCents)}</span>
              </div>

              <div className="border-t border-[#14324a] pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#FFB6E1]">{formatBRL(amountCents)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Redirecionando...
                  </>
                ) : (
                  "Pagar com cartão"
                )}
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Pagamento processado pela Stripe
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Lock className="w-4 h-4 text-green-400" /> Transação criptografada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
