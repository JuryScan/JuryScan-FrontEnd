"use client"

import { useState, useEffect, useCallback, type JSX } from "react"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, del } from "@/lib/api"
import type { ApiResponse, PageResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface LeadRequest {
  id: string
  tituloAnalise?: string
  status: "DISPONIVEL" | "ADQUIRIDO" | "CANCELADO" | "EXPIRADO"
  dataCriacao?: string
  dataAquisicao?: string
}

const PAGE_SIZE = 10

const STATUS_META: Record<
  LeadRequest["status"],
  { label: string; className: string; Icon: typeof Clock }
> = {
  DISPONIVEL: { label: "Aguardando advogado", className: "bg-yellow-100 text-yellow-700", Icon: Clock },
  ADQUIRIDO: { label: "Advogado assumiu", className: "bg-green-100 text-green-700", Icon: CheckCircle2 },
  CANCELADO: { label: "Cancelado", className: "bg-gray-100 text-gray-600", Icon: XCircle },
  EXPIRADO: { label: "Expirado", className: "bg-gray-100 text-gray-600", Icon: XCircle },
}

function formatDate(value?: string): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR")
}

export default function MeusPedidosPage(): JSX.Element {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<LeadRequest[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const res = await get<ApiResponse<PageResponse<LeadRequest>>>(
        `/leads/my-requests?page=${page}&page_size=${PAGE_SIZE}`
      )
      if (res.success && res.data?.items) {
        setPedidos(res.data.items)
        setTotalPages(res.data.totalPages ?? 0)
      } else {
        setPedidos([])
        setTotalPages(0)
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pedidos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, page])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  const handleCancel = async (id: string) => {
    setCancelingId(id)
    try {
      await del(`/leads/${id}/cancel`)
      toast({ title: "Pedido cancelado", description: "Seu caso foi retirado do marketplace." })
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "CANCELADO" } : p))
      )
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível cancelar o pedido.",
        variant: "destructive",
      })
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1F30] mb-2 flex items-center gap-3">
          <Inbox className="text-[#633B48]" />
          Meus Pedidos
        </h1>
        <p className="text-gray-500">
          Acompanhe os casos que você publicou para os advogados parceiros.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Loader2 className="w-10 h-10 text-gray-300 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando seus pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Você ainda não publicou nenhum caso</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Analise seu CNIS e publique seu caso para que advogados parceiros possam atendê-lo.
          </p>
          <Link
            href="/cliente/dashboard"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold transition-colors"
          >
            Ir para o painel
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {pedidos.map((pedido) => {
              const meta = STATUS_META[pedido.status] ?? STATUS_META.DISPONIVEL
              const StatusIcon = meta.Icon
              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FFECF1] flex items-center justify-center text-[#A50064] flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#0A1F30]">
                        {pedido.tituloAnalise || "Análise de CNIS"}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" /> Publicado em {formatDate(pedido.dataCriacao)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>
                    {pedido.status === "DISPONIVEL" && (
                      <button
                        onClick={() => handleCancel(pedido.id)}
                        disabled={cancelingId === pedido.id}
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-60"
                      >
                        {cancelingId === pedido.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                aria-label="Próxima página"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
