"use client"

import { useState, type JSX, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Search,
  Clock,
  LayoutDashboard,
  BrainCircuit,
  AlertCircle,
  Coins,
  Loader2,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { useAuth } from "@/contexts/AuthContext"
import { get } from "@/lib/api"
import type { ApiResponse, AuditRecord, DashboardAdvogado } from "@/lib/types"

interface AcquiredLead {
  id: string
  nomeCliente?: string
  tituloAnalise?: string
  status?: string
  dataAquisicao?: string
  dataCriacao?: string
}

function formatDate(value?: string): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR")
}

export default function AdvogadoDashboardPage(): JSX.Element {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"general" | "intelligence">("general")
  const [recentAnalyses, setRecentAnalyses] = useState<AuditRecord[]>([])
  const [recentLeads, setRecentLeads] = useState<AcquiredLead[]>([])
  const [dashboard, setDashboard] = useState<DashboardAdvogado | null>(null)
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user?.id) return

    setIsLoadingAnalyses(true)
    try {
      const [analysesRes, dashboardRes, leadsRes] = await Promise.all([
        get<ApiResponse<any>>(`/analysis/user/${user.id}?page=0&page_size=5`),
        get<ApiResponse<DashboardAdvogado>>(`/dashboard/advogado/me`),
        get<ApiResponse<any>>(`/leads/acquired?page=0&page_size=3`),
      ])

      if (analysesRes.success && analysesRes.data?.items?.length) {
        const mappedAnalyses: AuditRecord[] = analysesRes.data.items.map((item: any) => ({
          id: item.id,
          client: item.titulo || "Segurado",
          date: formatDate(item.dataCriacao),
          issues: item.falhas?.length || 0,
          status: "Concluído",
        }))
        setRecentAnalyses(mappedAnalyses)
      } else {
        setRecentAnalyses([])
      }

      if (dashboardRes.success && dashboardRes.data) {
        setDashboard(dashboardRes.data)
      }

      if (leadsRes.success && leadsRes.data?.items?.length) {
        setRecentLeads(leadsRes.data.items as AcquiredLead[])
      } else {
        setRecentLeads([])
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
    } finally {
      setIsLoadingAnalyses(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredAnalyses = recentAnalyses.filter((analysis) =>
    analysis.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Séries dos últimos 6 meses (label pt-BR já vem do backend), mescladas para o recharts.
  const monthlyData = (dashboard?.analisesPorMes ?? []).map((ponto, index) => ({
    month: ponto.label,
    analyses: ponto.count,
    errors: dashboard?.errosPorMes?.[index]?.count ?? 0,
  }))

  const kpi = (value?: number) => (dashboard ? value ?? 0 : "--")

  return (
    <div className="flex flex-col font-sans">
      <div className="bg-[#0A1F30] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
              <p className="text-gray-400">
                Bem-vindo de volta, {user?.nomeCompleto || "Dr(a)."}. Aqui está o resumo do seu
                escritório hoje.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-[#162D3F] p-1 rounded-xl flex">
                <button
                  onClick={() => setViewMode("general")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === "general"
                      ? "bg-[#FFB6E1] text-[#A50064]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Geral
                </button>
                <button
                  onClick={() => setViewMode("intelligence")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === "intelligence"
                      ? "bg-[#FFB6E1] text-[#A50064]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" />
                  Inteligência
                </button>
              </div>

              <Link href="/advogado/analise">
                <button className="bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg whitespace-nowrap">
                  <Plus className="w-5 h-5" />
                  Nova Análise
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
        {viewMode === "general" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Clientes Ativos</p>
                  <h3 className="text-2xl font-bold text-gray-900">{kpi(dashboard?.clientesAtivos)}</h3>
                </div>
              </div>

              <Link
                href="/advogado/marketplace"
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 group hover:border-[#FFB6E1] transition-colors"
              >
                <div className="w-12 h-12 bg-[#FFECF1] text-[#A50064] rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Novos Leads</p>
                  <h3 className="text-2xl font-bold text-gray-900">{kpi(dashboard?.leadsDisponiveis)}</h3>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-[#A50064] transition-colors" />
              </Link>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Análises no Mês</p>
                  <h3 className="text-2xl font-bold text-gray-900">{kpi(dashboard?.analisesNoMes)}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 group hover:border-[#FFB6E1] transition-colors cursor-pointer relative overflow-hidden">
                <Link href="/advogado/financeiro" className="absolute inset-0 z-10" />
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Saldo de Tokens</p>
                  <h3 className="text-2xl font-bold text-gray-900">{kpi(dashboard?.saldoTokens)}</h3>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-[#A50064] transition-colors" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#633B48]" />
                    Solicitações de Atendimento
                  </h2>
                  <Link
                    href="/advogado/marketplace"
                    className="text-sm text-[#633B48] font-bold hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {isLoadingAnalyses ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p className="text-sm">Carregando solicitações...</p>
                    </div>
                  ) : recentLeads.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <p className="text-sm">Nenhuma solicitação ainda.</p>
                      <Link
                        href="/advogado/marketplace"
                        className="text-sm text-[#633B48] font-bold hover:underline"
                      >
                        Buscar leads no marketplace
                      </Link>
                    </div>
                  ) : (
                    recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900">{lead.nomeCliente || "Cliente"}</h4>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Adquirido
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDate(lead.dataAquisicao || lead.dataCriacao)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 truncate">
                          {lead.tituloAnalise || "Análise de CNIS"}
                        </p>
                        <Link
                          href="/advogado/marketplace"
                          className="text-sm font-bold text-[#633B48] flex items-center group-hover:underline"
                        >
                          Ver detalhes <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
                    <FileText className="w-5 h-5 text-[#633B48]" />
                    Análises Recentes
                  </h2>
                  <div className="flex items-center gap-4 w-full justify-end">
                    <div className="relative hidden md:block w-full max-w-xs">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#633B48]"
                        aria-label="Buscar cliente nas análises"
                      />
                    </div>
                    <Link
                      href="/advogado/historico"
                      className="text-sm text-[#633B48] font-bold hover:underline whitespace-nowrap"
                    >
                      Ver todos
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {isLoadingAnalyses ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p className="text-sm">Carregando análises...</p>
                    </div>
                  ) : filteredAnalyses.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <p className="text-sm">Nenhuma análise encontrada.</p>
                    </div>
                  ) : (
                    filteredAnalyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                            {analysis.client.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{analysis.client}</h4>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <span>Data: {analysis.date}</span>
                              <span>•</span>
                              <span className="text-orange-600 font-medium">
                                {analysis.issues} pendências
                              </span>
                            </p>
                          </div>
                        </div>
                        <Link href={`/advogado/analise/${analysis.id}`}>
                          <button
                            className="p-2 text-gray-400 hover:text-[#633B48] hover:bg-[#FFECF1] rounded-lg transition-colors"
                            title="Abrir Relatório"
                            aria-label={`Abrir relatório de ${analysis.client}`}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900">Total de Erros</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpi(dashboard?.totalErros)}</p>
                <p className="text-sm text-red-600 font-medium mt-1">
                  Pendências detectadas nos leads adquiridos
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900">Análises Totais</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpi(dashboard?.analisesTotais)}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">CNIS processados por você</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900">Leads Adquiridos</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpi(dashboard?.leadsAdquiridosTotais)}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  Gasto de {kpi(dashboard?.totalGastoEmLeads)} tokens
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#633B48]" />
                  Volume de Análises Mensais
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      />
                      <Bar dataKey="analyses" fill="#0A1F30" radius={[4, 4, 0, 0]} name="Análises" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#633B48]" />
                  Tendência de Erros Detectados
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="errors"
                        stroke="#A50064"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#A50064", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 8 }}
                        name="Erros"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
