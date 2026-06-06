"use client"

import { useCallback, useEffect, useState, type JSX } from "react"
import Link from "next/link"
import {
  Inbox,
  Loader2,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
} from "lucide-react"
import { get, del } from "@/lib/api"
import type { ApiResponse, PageResponse, LeadRequest, LeadStatus } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

const STATUS: Record<LeadStatus, { label: string; chip: string; Icon: typeof Clock; hint: string }> = {
  DISPONIVEL: { label: "No marketplace", chip: "bg-blue-100 text-blue-700", Icon: Clock, hint: "Aguardando um advogado parceiro assumir." },
  ADQUIRIDO: { label: "Em atendimento", chip: "bg-green-100 text-green-700", Icon: CheckCircle2, hint: "Um advogado assumiu o seu caso." },
  EXPIRADO: { label: "Expirado", chip: "bg-gray-100 text-gray-600", Icon: XCircle, hint: "O prazo deste pedido expirou." },
  CANCELADO: { label: "Cancelado", chip: "bg-gray-100 text-gray-500", Icon: XCircle, hint: "Você cancelou este pedido." },
}

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "--"

export default function MeusPedidosPage(): JSX.Element {
  const [pedidos, setPedidos] = useState<LeadRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await get<ApiResponse<PageResponse<LeadRequest>>>(
        "/leads/my-requests?page=0&page_size=20"
      )
      // O backend devolve 204 (corpo vazio) quando não há pedidos.
      if (res?.success && res.data?.items) setPedidos(res.data.items)
      else setPedidos([])
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err)
      setPedidos([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  const handleCancelar = async (id: string) => {
    setCancelingId(id)
    try {
      await del<ApiResponse<unknown>>(`/leads/${id}/cancel`)
      toast({ title: "Pedido cancelado", description: "Seu caso foi retirado do marketplace." })
      await fetchPedidos()
    } catch (err: any) {
      toast({
        title: "Não foi possível cancelar",
        description: err?.message || "Tente novamente em instantes.",
        variant: "destructive",
      })
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-[#162D3F] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
            <p className="text-gray-400">
              Acompanhe os casos que você publicou no marketplace de advogados.
            </p>
          </div>
          <button
            onClick={fetchPedidos}
            disabled={isLoading}
            className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#633B48]" />
            <p>Carregando seus pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Inbox className="w-7 h-7 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Você ainda não publicou pedidos</h2>
            <p className="text-gray-500 mb-6">
              Faça a análise do seu CNIS e publique seu caso para que advogados parceiros possam atendê-lo.
            </p>
            <Link href="/cliente/dashboard">
              <button className="px-6 py-3 rounded-xl bg-[#633B48] hover:bg-[#300117] text-white font-bold transition-colors">
                Ir para a análise
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const s = STATUS[pedido.status] ?? STATUS.DISPONIVEL
              const Icon = s.Icon
              const podeCancelar = pedido.status === "DISPONIVEL"
              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FFECF1] text-[#633B48] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {pedido.tituloAnalise || "Análise de CNIS"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Publicado em {formatDate(pedido.dataCriacao)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.chip}`}>
                          <Icon className="w-3 h-3" />
                          {s.label}
                        </span>
                        <span className="text-xs text-gray-400">{s.hint}</span>
                      </div>
                    </div>
                  </div>

                  {podeCancelar && (
                    <button
                      onClick={() => handleCancelar(pedido.id)}
                      disabled={cancelingId === pedido.id}
                      className="self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancelingId === pedido.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Cancelar
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
