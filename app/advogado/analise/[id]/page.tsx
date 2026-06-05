"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import AnalysisResult from "@/components/AnalysisResult"
import { get } from "@/lib/api"
import type { ApiResponse, AnalysisResult as AnalysisResultType } from "@/lib/types"

export default function AnalysisDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState<AnalysisResultType | null>(null)

  const fetchAnalysisDetails = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const response = await get<ApiResponse<AnalysisResultType>>(`/analysis/${id}`)
      
      if (response.success) {
        const analysisData = response.data
        // Mapear 'falhas' da API para 'issues' esperado pelo componente
        if (analysisData.falhas && !analysisData.issues) {
          analysisData.issues = analysisData.falhas
        }
        setAnalysis(analysisData)
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da análise:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAnalysisDetails()
  }, [fetchAnalysisDetails])

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-[#633B48] transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para o histórico
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#633B48]" />
            <p className="text-lg font-medium">Carregando detalhes do relatório...</p>
          </div>
        ) : !analysis ? (
          <div className="p-20 text-center text-gray-400">
            <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Relatório não encontrado</h3>
            <p>Não foi possível carregar os dados desta análise.</p>
          </div>
        ) : (
          <AnalysisResult result={analysis} loading={false} />
        )}
      </div>
    </div>
  )
}
