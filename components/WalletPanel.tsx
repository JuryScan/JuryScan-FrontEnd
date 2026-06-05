"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Coins,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  History,
  Wallet,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get } from "@/lib/api"
import type { ApiResponse, PageResponse } from "@/lib/types"

interface Transaction {
  id: string
  tipoTransacao: "COMPRA" | "CONSUMO" | "AQUISICAO_LEAD"
  quantidade: number
  dataCriacao: string
}

export default function WalletPanel() {
  const router = useRouter()
  const { user } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const [balanceRes, txRes] = await Promise.all([
        get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`),
        get<ApiResponse<PageResponse<Transaction>>>(
          `/transactions/user/${user.id}?page=0&page_size=10`
        ),
      ])
      if (balanceRes.success) setBalance(balanceRes.data)
      if (txRes.success && txRes.data?.items) setTransactions(txRes.data.items)
    } catch (error) {
      console.error("Erro ao carregar carteira:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const usedThisMonth = transactions
    .filter((t) => t.tipoTransacao !== "COMPRA")
    .filter((t) => {
      const d = new Date(t.dataCriacao)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + t.quantidade, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#633B48]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Wallet className="w-7 h-7 text-[#633B48]" />
          <h1 className="text-2xl font-bold text-gray-900">Minha Carteira</h1>
        </div>

        {/* Saldo */}
        <div className="bg-[#0A1F30] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FFB6E1] mb-2 font-medium">
                <Coins className="w-5 h-5" />
                Saldo Disponível
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-bold">{balance !== null ? balance : "--"}</h2>
                <span className="text-xl text-gray-400 font-medium">créditos</span>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Usados este mês: <strong className="text-white">{usedThisMonth}</strong> créditos
              </p>
            </div>
            <button
              onClick={() => router.push("/cliente/checkout")}
              className="bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Comprar créditos
            </button>
          </div>
          <Coins className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <History className="w-5 h-5 text-[#633B48]" />
            <h3 className="text-lg font-bold text-gray-900">Histórico de Transações</h3>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Nenhuma transação ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((t) => {
                const isCompra = t.tipoTransacao === "COMPRA"
                return (
                  <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isCompra ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {isCompra ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isCompra ? "Compra de créditos" : "Consumo (análise)"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(t.dataCriacao).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${isCompra ? "text-green-700" : "text-orange-700"}`}>
                      {isCompra ? "+" : "-"}
                      {t.quantidade} créditos
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
