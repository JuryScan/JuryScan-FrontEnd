"use client"

import { useState, useEffect, useCallback, type JSX } from "react"
import {
  Users,
  Search,
  MessageSquare,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react"
import { get } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

interface AcquiredLead {
  id: string
  nomeCliente?: string
  tituloAnalise?: string
  status?: string
  dataAquisicao?: string
  dataCriacao?: string
}

interface LeadDetails {
  nomeCompleto?: string
  email?: string
  telefone?: string
  cpf?: string
  analise?: { id?: string; titulo?: string; falhas?: unknown[] }
}

function formatDate(value?: string): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR")
}

export default function ClientesLeadsPage(): JSX.Element {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [leads, setLeads] = useState<AcquiredLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailsById, setDetailsById] = useState<Record<string, LeadDetails>>({})
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const res = await get<ApiResponse<any>>(`/leads/acquired?page=0&page_size=50`)
      if (res.success && res.data?.items?.length) {
        setLeads(res.data.items as AcquiredLead[])
      } else {
        setLeads([])
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar sua carteira de clientes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const toggleDetails = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailsById[id]) {
      setLoadingDetailsId(id)
      try {
        const res = await get<ApiResponse<LeadDetails>>(`/leads/${id}/details`)
        if (res.success && res.data) {
          setDetailsById((prev) => ({ ...prev, [id]: res.data }))
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do lead:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do cliente.",
          variant: "destructive",
        })
      } finally {
        setLoadingDetailsId(null)
      }
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase()
    return (
      (lead.nomeCliente || "").toLowerCase().includes(term) ||
      (lead.tituloAnalise || "").toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F30] mb-2 flex items-center gap-3">
            <Users className="text-[#633B48]" />
            Minha Carteira de Clientes
          </h1>
          <p className="text-gray-500">
            Clientes a partir dos leads que você adquiriu no marketplace.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou análise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#633B48] transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-20 text-center">
            <Loader2 className="w-10 h-10 text-gray-300 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando sua carteira...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Nenhum cliente ainda</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Adquira leads no marketplace para começar a montar sua carteira.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const details = detailsById[lead.id]
            const isExpanded = expandedId === lead.id
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#FFECF1] rounded-2xl flex items-center justify-center text-[#A50064] text-2xl font-bold">
                      {(lead.nomeCliente || "C").charAt(0)}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-[#0A1F30]">
                            {lead.nomeCliente || "Cliente"}
                          </h2>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border bg-green-100 text-green-700 border-green-200">
                            Adquirido
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Adquirido em{" "}
                            {formatDate(lead.dataAquisicao || lead.dataCriacao)}
                          </span>
                          {details?.email && (
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" /> {details.email}
                            </span>
                          )}
                          {details?.telefone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" /> {details.telefone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#633B48]" />
                      <p className="text-[#0A1F30] text-sm leading-relaxed">
                        {lead.tituloAnalise || "Análise de CNIS"}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600"
                          title="CNIS Analisado"
                        >
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-600"
                          title="Lead Adquirido"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      <button
                        onClick={() => toggleDetails(lead.id)}
                        className="text-sm font-bold text-[#633B48] flex items-center gap-1 hover:underline"
                      >
                        {isExpanded ? "Ocultar detalhes" : "Ver histórico do cliente"}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        {loadingDetailsId === lead.id ? (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Carregando detalhes...
                          </div>
                        ) : details ? (
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-400 text-xs mb-1">Nome completo</p>
                              <p className="font-medium text-[#0A1F30]">{details.nomeCompleto || "—"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-400 text-xs mb-1">CPF</p>
                              <p className="font-medium text-[#0A1F30]">{details.cpf || "—"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-400 text-xs mb-1">E-mail</p>
                              <p className="font-medium text-[#0A1F30]">{details.email || "—"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-400 text-xs mb-1">Telefone</p>
                              <p className="font-medium text-[#0A1F30]">{details.telefone || "—"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
                              <p className="text-gray-400 text-xs mb-1">Pendências na análise</p>
                              <p className="font-medium text-[#0A1F30]">
                                {details.analise?.falhas?.length ?? 0} pendência(s) detectada(s)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">Detalhes indisponíveis.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
