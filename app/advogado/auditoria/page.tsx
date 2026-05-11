"use client"

import { useState, type JSX, useCallback } from "react"
import Footer from "@/components/shared/Footer"
import CnisUpload from "@/components/CnisUpload"
import AnalysisResult from "@/components/AnalysisResult"
import type { AnalysisResult as AnalysisResultType, Severity } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import { post } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function AuditorPage(): JSX.Element {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResultType | null>(null)

  const handleAnalyze = useCallback(async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para realizar uma análise.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // A API retorna um objeto ApiResponse com AnalysisResponseDTO no campo 'data'
      const response = await post<any>(`/analysis/user/${user.id}`, formData)
      
      const backendData = response.data

      // Map backend data to frontend AnalysisResultType
      const mappedResult: AnalysisResultType = {
        status: (backendData.falhas?.some((f: any) => f.severidade === "ALTA") ? "critical" : 
                backendData.falhas?.some((f: any) => f.severidade === "MEDIA") ? "warning" : "info") as Severity,
        summary: {
          clientName: backendData.titulo || "Segurado",
          totalIssues: backendData.falhas?.length || 0,
          processedAt: new Date(backendData.dataCriacao || Date.now()).toLocaleString("pt-BR"),
        },
        issues: (backendData.falhas || []).map((f: any, index: number) => ({
          id: f.id || index,
          type: "generic",
          severity: f.severidade === "ALTA" ? "critical" : 
                    f.severidade === "MEDIA" ? "warning" : "info",
          title: f.titulo,
          description: backendData.descricaoGeral || "Inconsistência detectada pela inteligência artificial.",
          recommendation: f.sugestaoCorrecao,
        })),
      }

      setAnalysisResult(mappedResult)
    } catch (error: any) {
      console.error("Erro ao analisar CNIS:", error)
      toast({
        title: "Erro ao processar arquivo",
        description: error.message || "Ocorreu um erro ao tentar analisar o arquivo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="h-full">
              <CnisUpload onAnalyze={handleAnalyze as any} />
            </div>

            <div className="h-full">
              <AnalysisResult
                result={analysisResult}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
