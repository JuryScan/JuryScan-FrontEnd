"use client"

import { useCallback, useEffect, useState, type JSX } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  ArrowRight,
  ShieldAlert,
  Info,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

type Severidade = "ALTA" | "MEDIA" | "BAIXA" | "INFO"

interface Falha {
  id?: string
  titulo?: string
  severidade?: Severidade
  descricao?: string
  sugestaoCorrecao?: string
  confianca?: number
}

interface Analise {
  id?: string
  titulo?: string
  descricaoGeral?: string
  sumario?: string
  relatorioSumarioJuridico?: string
  dataCriacao?: string
  falhas?: Falha[]
}

const SEV: Record<Severidade, { box: string; title: string; text: string; chip: string; label: string; Icon: typeof Info }> = {
  ALTA: { box: "bg-red-50 border-red-200", title: "text-red-900", text: "text-red-800", chip: "bg-red-100 text-red-700", label: "Alta", Icon: ShieldAlert },
  MEDIA: { box: "bg-yellow-50 border-yellow-200", title: "text-yellow-900", text: "text-yellow-800", chip: "bg-yellow-100 text-yellow-700", label: "Média", Icon: AlertTriangle },
  BAIXA: { box: "bg-blue-50 border-blue-200", title: "text-blue-900", text: "text-blue-800", chip: "bg-blue-100 text-blue-700", label: "Baixa", Icon: Info },
  INFO: { box: "bg-gray-50 border-gray-200", title: "text-gray-900", text: "text-gray-700", chip: "bg-gray-100 text-gray-600", label: "Informação", Icon: Info },
}

export default function RelatorioPage(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("analysisId")

  const [analise, setAnalise] = useState<Analise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const fetchAnalise = useCallback(async () => {
    if (!analysisId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(false)
    try {
      const res = await get<ApiResponse<Analise>>(`/analysis/${analysisId}`)
      if (res.success && res.data) {
        setAnalise(res.data)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error("Erro ao carregar análise:", err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [analysisId])

  useEffect(() => {
    fetchAnalise()
  }, [fetchAnalise])

  const handlePublicar = async () => {
    if (!analysisId) return
    setIsPublishing(true)
    try {
      await post<ApiResponse<unknown>>("/leads/request", { analysisId })
      toast({
        title: "Caso publicado!",
        description: "Seu caso entrou no marketplace e advogados parceiros poderão atendê-lo.",
      })
      router.push("/cliente/meus-pedidos")
    } catch (err: any) {
      toast({
        title: "Não foi possível publicar",
        description: err?.message || "Tente novamente em instantes.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const falhas = analise?.falhas ?? []

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#162D3F] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
            <p className="text-gray-400">
              Visualize a análise completa do seu CNIS com pendências e sugestões de correção.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <button
          onClick={() => router.push("/cliente/dashboard")}
          className="flex items-center text-gray-600 hover:text-[#633B48] transition-colors font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Início
        </button>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#633B48]" />
            <p>Carregando seu relatório...</p>
          </div>
        ) : !analysisId ? (
          <EmptyState
            titulo="Nenhuma análise selecionada"
            descricao="Faça a análise do seu CNIS para visualizar o relatório completo."
          />
        ) : error ? (
          <EmptyState
            titulo="Não encontramos esse relatório"
            descricao="A análise pode não existir mais. Tente fazer uma nova análise do seu CNIS."
          />
        ) : (
          <>
            <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#633B48]"></div>
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold mb-3 uppercase tracking-wider">
                <FileText className="w-3 h-3" /> Análise Concluída
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {analise?.titulo || "Relatório do seu INSS"}
              </h1>
              <p className="text-gray-600">
                {falhas.length === 0
                  ? "Nossa IA analisou seu documento e não encontrou inconsistências graves."
                  : <>Nossa IA analisou seu documento e encontrou <strong>{falhas.length} {falhas.length === 1 ? "pendência" : "pendências"}</strong> que precisam da sua atenção.</>}
              </p>
              {analise?.sumario && (
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{analise.sumario}</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-b-2xl p-8 shadow-sm space-y-6">
              {falhas.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3 text-green-800">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  <p>Nenhuma inconsistência grave foi encontrada no seu CNIS.</p>
                </div>
              ) : (
                falhas.map((falha, idx) => {
                  const sev = SEV[(falha.severidade as Severidade) ?? "INFO"] ?? SEV.INFO
                  const Icon = sev.Icon
                  return (
                    <div key={falha.id ?? idx} className={`border rounded-xl p-6 ${sev.box}`}>
                      <div className="flex gap-4">
                        <div className="mt-1">
                          <Icon className={`w-6 h-6 ${sev.title}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className={`font-bold text-lg ${sev.title}`}>
                              {falha.titulo || "Ponto de atenção"}
                            </h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.chip}`}>
                              {sev.label}
                            </span>
                          </div>
                          {falha.descricao && (
                            <p className={`mb-4 leading-relaxed ${sev.text}`}>{falha.descricao}</p>
                          )}
                          {falha.sugestaoCorrecao && (
                            <div className="bg-white/60 p-4 rounded-lg border border-black/5 text-sm text-gray-700">
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

            <div className="mt-12 bg-[#0A1F30] rounded-2xl p-8 md:p-10 text-white shadow-xl border border-[#14324a]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left flex-1">
                  <h4 className="font-bold text-2xl mb-3">Precisa de ajuda com esses acertos?</h4>
                  <p className="text-gray-300 text-base max-w-xl">
                    Publique seu caso no nosso marketplace e advogados parceiros poderão
                    analisá-lo e entrar em contato. Você acompanha tudo em "Meus Pedidos".
                  </p>
                </div>
                <div className="w-full md:w-auto space-y-3">
                  <button
                    onClick={handlePublicar}
                    disabled={isPublishing}
                    className="w-full md:w-auto px-8 py-5 rounded-xl bg-[#633B48] hover:bg-[#300117] border border-[#FFECF1]/20 text-white font-bold text-lg flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isPublishing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Publicar meu caso
                      </>
                    )}
                  </button>
                  <Link href="/cliente/advogados" className="block">
                    <button className="w-full md:w-auto px-8 py-3 rounded-xl text-gray-300 hover:text-white font-medium flex items-center justify-center transition-colors">
                      Ver advogados parceiros <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ titulo, descricao }: { titulo: string; descricao: string }): JSX.Element {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
        <FileText className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h2>
      <p className="text-gray-500 mb-6">{descricao}</p>
      <Link href="/cliente/dashboard">
        <button className="px-6 py-3 rounded-xl bg-[#633B48] hover:bg-[#300117] text-white font-bold transition-colors">
          Ir para a análise
        </button>
      </Link>
    </div>
  )
}
