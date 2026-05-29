"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Search, 
  ArrowRight, 
  Calendar, 
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get } from "@/lib/api"
import type { ApiResponse, PageResponse, AnalysisResult } from "@/lib/types"

export default function AnalysisHistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [data, setData] = useState<PageResponse<AnalysisResult> | null>(null)

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const response = await get<ApiResponse<PageResponse<AnalysisResult>>>(
        `/analysis/user/${user.id}?page=${page}&page_size=10`
      )
      
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, page])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleViewDetails = (id: string) => {
    router.push(`/advogado/auditoria/${id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F30] mb-2">Histórico de Auditorias</h1>
          <p className="text-gray-500">Consulte e gerencie todas as análises de CNIS realizadas.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#633B48]" />
            <p className="text-lg font-medium">Carregando histórico...</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Nenhuma análise encontrada</h3>
            <p className="max-w-sm mx-auto">Você ainda não realizou nenhuma auditoria de CNIS ou o filtro não retornou resultados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Título / Segurado</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Data da Análise</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Pendências</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FFECF1] text-[#A50064] rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{analysis.titulo}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{analysis.descricaoGeral}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(analysis.dataCriacao ?? "").toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-bold text-gray-700">
                            {analysis.issues?.length || 0} Inconsistências
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleViewDetails(analysis.id ?? "")}
                          className="px-4 py-2 bg-gray-100 hover:bg-[#633B48] text-gray-700 hover:text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-auto"
                        >
                          Ver Detalhes
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.totalPages > 1 && (
              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando <span className="font-bold text-gray-900">{data.items.length}</span> de <span className="font-bold text-gray-900">{data.totalElements}</span> análises
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold px-4">
                    Página {page + 1} de {data.totalPages}
                  </span>
                  <button
                    disabled={page >= data.totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
