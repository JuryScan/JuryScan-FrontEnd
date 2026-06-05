"use client"

import { useState, useEffect, useCallback, type JSX } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldAlert,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { get } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface Falha {
  id?: string
  titulo?: string
  descricao?: string
  sugestaoCorrecao?: string
  severidade?: string
}

interface Analysis {
  id?: string
  titulo?: string
  descricaoGeral?: string
  sumario?: string
  dataCriacao?: string
  falhas?: Falha[]
}

function severityStyle(sev?: string) {
  switch ((sev || "").toUpperCase()) {
    case "ALTA":
    case "CRITICA":
    case "CRITICO":
      return {
        wrap: "bg-red-50 border-red-200",
        Icon: ShieldAlert,
        iconColor: "text-red-600",
        title: "text-red-900",
        text: "text-red-800",
        box: "bg-white/60 border-red-200 text-red-900",
      }
    case "MEDIA":
      return {
        wrap: "bg-yellow-50 border-yellow-200",
        Icon: AlertTriangle,
        iconColor: "text-yellow-600",
        title: "text-yellow-900",
        text: "text-yellow-800",
        box: "bg-white/60 border-yellow-200 text-yellow-900",
      }
    default:
      return {
        wrap: "bg-blue-50 border-blue-200",
        Icon: Info,
        iconColor: "text-blue-600",
        title: "text-blue-900",
        text: "text-blue-800",
        box: "bg-white/60 border-blue-200 text-blue-900",
      }
  }
}

export default function RelatorioPage(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("analysisId")

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  const fetchAnalysis = useCallback(async () => {
    if (!analysisId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const res = await get<ApiResponse<Analysis>>(`/analysis/${analysisId}`)
      if (res.success && res.data) setAnalysis(res.data)
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [analysisId])

  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  const falhas = analysis?.falhas ?? []

  const handleDownload = async () => {
    if (!analysis) return
    setIsDownloading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      const margin = 14
      const width = doc.internal.pageSize.getWidth() - margin * 2
      let y = 20

      doc.setFontSize(16)
      doc.text(analysis.titulo || "Relatório do seu INSS", margin, y)
      y += 10
      doc.setFontSize(11)

      falhas.forEach((falha, index) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        doc.setFont("helvetica", "bold")
        const titulo = `${index + 1}. ${falha.titulo || "Ponto de atenção"}`
        doc.text(doc.splitTextToSize(titulo, width), margin, y)
        y += 8
        doc.setFont("helvetica", "normal")
        if (falha.descricao) {
          const desc = doc.splitTextToSize(falha.descricao, width)
          doc.text(desc, margin, y)
          y += desc.length * 6 + 2
        }
        if (falha.sugestaoCorrecao) {
          const sug = doc.splitTextToSize(`O que fazer: ${falha.sugestaoCorrecao}`, width)
          doc.text(sug, margin, y)
          y += sug.length * 6 + 4
        }
      })

      doc.save(`relatorio-${analysis.id || "cnis"}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      toast({ title: "Erro", description: "Não foi possível gerar o PDF.", variant: "destructive" })
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#633B48]" />
      </div>
    )
  }

  if (!analysisId || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Nenhum relatório selecionado</h1>
          <p className="text-gray-600 mb-6">
            Analise um CNIS no seu painel para gerar um relatório completo.
          </p>
          <Link
            href="/cliente/dashboard"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold transition-colors"
          >
            Ir para o painel <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-center gap-2 text-sm font-medium">
        <CheckCircle2 className="w-5 h-5" />
        Relatório completo liberado.
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/cliente/dashboard")}
            className="flex items-center text-gray-600 hover:text-[#633B48] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Início
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="hidden md:flex items-center gap-2 bg-[#FFECF1] text-[#633B48] px-4 py-2 rounded-lg font-bold hover:bg-[#ffd6e4] transition-colors disabled:opacity-70"
          >
            {isDownloading ? "Gerando..." : "Baixar PDF"}
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#633B48]"></div>
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold mb-3 uppercase tracking-wider">
            <FileText className="w-3 h-3" /> Análise Concluída
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {analysis.titulo || "Relatório do seu INSS"}
          </h1>
          <p className="text-gray-600">
            Nossa IA analisou seu documento e encontrou{" "}
            <strong>
              {falhas.length} {falhas.length === 1 ? "pendência" : "pendências"}
            </strong>{" "}
            que {falhas.length === 1 ? "precisa" : "precisam"} da sua atenção.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-2xl p-8 shadow-sm space-y-6">
          {falhas.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-800">
              Nenhuma inconsistência grave foi encontrada no seu CNIS.
            </div>
          ) : (
            falhas.map((falha, index) => {
              const style = severityStyle(falha.severidade)
              const Icon = style.Icon
              return (
                <div key={falha.id || index} className={`${style.wrap} border rounded-xl p-6`}>
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Icon className={`w-6 h-6 ${style.iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${style.title} mb-2`}>
                        {falha.titulo || "Ponto de atenção encontrado"}
                      </h3>
                      {falha.descricao && (
                        <p className={`${style.text} mb-4 leading-relaxed`}>{falha.descricao}</p>
                      )}
                      {falha.sugestaoCorrecao && (
                        <div className={`${style.box} p-4 rounded-lg border text-sm`}>
                          <strong>O que fazer:</strong> {falha.sugestaoCorrecao}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="md:hidden w-full mt-6 py-4 flex items-center justify-center gap-2 bg-[#FFECF1] text-[#633B48] rounded-xl font-bold shadow-sm border border-[#ffd6e4] active:scale-[0.98]"
        >
          {isDownloading ? "Gerando Relatório..." : "Baixar Relatório em PDF"}
          <Download className="w-5 h-5" />
        </button>

        <div className="mt-12 bg-[#0A1F30] rounded-2xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#14324a]">
          <div className="text-center md:text-left flex-1">
            <h4 className="font-bold text-2xl mb-3">Precisa de ajuda com esses acertos?</h4>
            <p className="text-gray-300 text-base max-w-xl">
              Você pode tentar resolver sozinho no Meu INSS, ou contratar um de nossos
              especialistas para fazer isso de forma rápida e segura.
            </p>
          </div>
          <Link
            href={`/cliente/advogados${analysisId ? `?analysisId=${analysisId}` : ""}`}
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto px-8 py-5 rounded-xl bg-[#633B48] hover:bg-[#300117] border border-[#FFECF1]/20 text-white font-bold text-lg flex items-center justify-center transition-transform hover:scale-105">
              Ver Advogados Parceiros <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
