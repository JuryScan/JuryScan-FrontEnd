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
  const [error, setError] = useState<"PASSWORD_PROTECTED" | "ILLEGIBLE" | "GENERIC" | null>(null)
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResultType | null>(null)

  const handleRetry = () => {
    setError(null)
    setAnalysisResult(null)
    setIsLoading(false)
  }

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
    setError(null)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await post<any>(`/analysis/user/${user.id}`, formData)
      
      const backendData = response.data

      const mappedResult: AnalysisResultType = {
        id: backendData.id,
        titulo: backendData.titulo,
        descricaoGeral: backendData.descricaoGeral,
        dataCriacao: backendData.dataCriacao,
        issues: backendData.falhas?.map((f: any) => ({
          id: f.id,
          titulo: f.titulo,
          severidade: f.severidade,
          descricao: f.descricao,
          sugestaoCorrecao: f.sugestaoCorrecao,
          confianca: f.confianca,
        })) || [],
      }

      setAnalysisResult(mappedResult)
    } catch (err: any) {
      console.error("Erro ao analisar CNIS:", err)
      
      // Lógica de categorização de erro baseada no retorno da API
      let errorType: "PASSWORD_PROTECTED" | "ILLEGIBLE" | "GENERIC" = "GENERIC"
      
      const errorMessage = err.message?.toLowerCase() || ""
      if (errorMessage.includes("password") || errorMessage.includes("senha") || err.status === 403) {
        errorType = "PASSWORD_PROTECTED"
      } else if (errorMessage.includes("ilegível") || errorMessage.includes("corrompido") || errorMessage.includes("format")) {
        errorType = "ILLEGIBLE"
      }

      setError(errorType)
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
                error={error}
                onRetry={handleRetry}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
