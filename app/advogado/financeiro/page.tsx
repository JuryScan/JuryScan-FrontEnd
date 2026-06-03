"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { 
  History, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2, 
  Coins,
  Wallet,
  ArrowRight
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse, PageResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import PurchaseConfirmationModal from "@/components/PurchaseConfirmationModal"

interface Transaction {
  id: string
  tipoTransacao: "COMPRA" | "CONSUMO"
  quantidade: number
  dataCriacao: string
  stripeCheckoutId?: string
}

export default function FinanceiroPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false)
  const [filterType, setFilterType] = useState<string>("todos")
  const [filterMonth, setFilterMonth] = useState<string>("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    tokens: number
    price: number
    label: string
  } | null>(null)

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Pagamento Concluído!", description: "Seus créditos foram adicionados à sua carteira." })
    }
    if (searchParams.get("cancel") === "true") {
      toast({ title: "Pagamento Cancelado", description: "A operação de compra de créditos foi cancelada.", variant: "destructive" })
    }
  }, [searchParams])

  const fetchData = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return }
    setIsLoading(true)
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`),
        get<ApiResponse<PageResponse<Transaction>>>(`/transactions/user/${user.id}?page=0&page_size=10`)
      ])
      if (balanceRes.success) setBalance(balanceRes.data)
      if (transactionsRes.success) {
        setTransactions(transactionsRes.data.items)
        setFilteredTransactions(transactionsRes.data.items)
      }
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    let result = [...transactions]
    if (filterType !== "todos") result = result.filter(t => t.tipoTransacao === filterType)
    if (filterMonth !== "todos") result = result.filter(t => new Date(t.dataCriacao).getMonth().toString() === filterMonth)
    setFilteredTransactions(result)
  }, [transactions, filterType, filterMonth])

  const handleDownloadReceipt = (transactionId: string) => {
    toast({ title: "Gerando Recibo", description: "O download do recibo PDF começará em instantes." })
  }

  const handleBuyClick = (price: number, tokens: number, label: string) => {
    setSelectedPlan({
      tokens,
      price,
      label,
    })
    setIsModalOpen(true)
  }

  const handleBuyCredits = async () => {
    if (!selectedPlan) return

    setIsBuying(true)
    try {
      const response = await post<ApiResponse<any>>("/product-checkout/checkout", {
        name: `${selectedPlan.tokens} Créditos JuryScan`,
        amount: selectedPlan.price * 100,
        quantity: 1
      })
      if (response.success && response.data.sessionUrl) {
        setIsModalOpen(false)
        window.open(response.data.sessionUrl, "_blank")
      }
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error)
      toast({
        title: "Erro ao processar pagamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      })
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#162D3F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Financeiro</h1>
          <p className="text-gray-400">Gerencie seus créditos e acompanhe seu histórico de transações.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12 items-stretch">
          <div className="bg-[#0A1F30] rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#FFB6E1] mb-2 font-medium">
                <Wallet className="w-5 h-5" />
                Saldo Disponível
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-bold">{balance !== null ? balance : "--"}</h2>
                <span className="text-xl text-gray-400 font-medium">Créditos</span>
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-sm text-gray-400">Cada análise de CNIS consome 30 créditos.</p>
            </div>
            <Coins className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-[#0A1F30] mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#633B48]" />
              Adquirir Créditos
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 items-stretch">
              {[
                { tokens: 60, price: 19.90, label: "Básico", highlight: false },
                { tokens: 120, price: 79.90, label: "Popular", highlight: true },
                { tokens: 470, price: 149.90, label: "Profissional", highlight: false }
              ].map((plan) => (
                <div
                  key={plan.tokens}
                  className={`p-6 rounded-xl border-2 flex flex-col items-center text-center transition-colors ${
                    plan.highlight ? "border-[#633B48] bg-[#FFECF1]/20 shadow-md" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlight ? "text-[#633B48]" : "text-gray-400"}`}>
                    {plan.label}
                  </span>
                  <span className="text-3xl font-bold text-[#0A1F30] mb-1">{plan.tokens}</span>
                  <span className="text-sm text-gray-500 mb-4">Créditos</span>
                  <div className="text-xl font-bold text-[#0A1F30] mb-6">R$ {plan.price.toFixed(2).replace('.', ',')}</div>
                  <button
                    onClick={() => handleBuyClick(plan.price, plan.tokens, plan.label)}
                    disabled={isBuying}
                    className={`w-full h-10 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                      plan.highlight ? "bg-[#633B48] text-white hover:bg-[#4A2C38]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Comprar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[#0A1F30] flex items-center gap-2">
              <History className="w-5 h-5 text-[#633B48]" />
              Histórico de Transações
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48]"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="COMPRA">Compras</option>
                <option value="CONSUMO">Consumos</option>
              </select>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48]"
              >
                <option value="todos">Todos os Meses</option>
                <option value="0">Janeiro</option>
                <option value="1">Fevereiro</option>
                <option value="2">Março</option>
                <option value="3">Abril</option>
                <option value="4">Maio</option>
                <option value="5">Junho</option>
                <option value="6">Julho</option>
                <option value="7">Agosto</option>
                <option value="8">Setembro</option>
                <option value="9">Outubro</option>
                <option value="10">Novembro</option>
                <option value="11">Dezembro</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#633B48]" />
              <p>Carregando transações...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-20 text-center text-gray-400">
              <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Quantidade</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {new Date(t.dataCriacao).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          t.tipoTransacao === "COMPRA" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {t.tipoTransacao === "COMPRA" ? <><ArrowDownLeft className="w-3 h-3" /> Compra</> : <><ArrowUpRight className="w-3 h-3" /> Consumo</>}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-[#0A1F30]">
                        {t.tipoTransacao === "COMPRA" ? "+" : "-"}{t.quantidade} tokens
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleDownloadReceipt(t.id)}
                          className="text-[#633B48] hover:text-[#4A2C38] font-bold text-xs flex items-center gap-1 group"
                        >
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                          Recibo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PurchaseConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        plan={selectedPlan}
        onConfirm={handleBuyCredits}
        isLoading={isBuying}
      />
    </div>
  )
}