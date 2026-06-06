"use client"

import { useState, useEffect, useCallback, type JSX, type ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Clock,
  Lock,
  Coins,
  Loader2,
  Briefcase,
  CheckCircle2,
} from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

import ProgressIndicator from "@/components/ProgressIndicator"

interface ClientAnalysis {
  id?: string
  titulo?: string
  falhas: Array<{ id?: string; titulo?: string; descricao?: string }>
}

export default function ClienteDashboardPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepLabel, setStepLabel] = useState("")
  const [error, setError] = useState<"PASSWORD_PROTECTED" | "ILLEGIBLE" | "GENERIC" | null>(null)
  const [analysis, setAnalysis] = useState<ClientAnalysis | null>(null)
  const [isCreatingLead, setIsCreatingLead] = useState(false)
  const [leadCreatedId, setLeadCreatedId] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingBalance(false)
      return
    }
    setIsLoadingBalance(true)
    try {
      const res = await get<ApiResponse<number>>(`/wallets/user/${user.id}/balance`)
      if (res.success) setBalance(res.data)
    } catch {
      // saldo é informativo nesta tela; ignora falha
    } finally {
      setIsLoadingBalance(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setAnalysis(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    if (!user?.id) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para analisar seu CNIS.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)
    setProgress(40)
    setStepLabel("Analisando seu histórico...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await post<ApiResponse<any>>(`/analysis/upload`, formData)
      const data = response.data

      setProgress(100)
      setAnalysis({
        id: data?.id,
        titulo: data?.titulo,
        falhas: data?.falhas ?? [],
      })
    } catch (err: any) {
      console.error("Erro ao analisar CNIS:", err)
      const msg = err?.message?.toLowerCase() ?? ""
      if (msg.includes("password") || msg.includes("senha") || err?.status === 403) {
        setError("PASSWORD_PROTECTED")
      } else if (msg.includes("ilegível") || msg.includes("corrompido") || msg.includes("format")) {
        setError("ILLEGIBLE")
      } else {
        setError("GENERIC")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setAnalysis(null)
    setIsAnalyzing(false)
    setFile(null)
  }

  const handleVerRelatorio = () => {
    // A análise já consome créditos no upload; o relatório completo é só a visão detalhada (sem cobrança extra).
    const query = analysis?.id ? `?analysisId=${analysis.id}` : ""
    router.push(`/cliente/relatorio${query}`)
  }

  const handleRequestAdvogado = async () => {
    if (!analysis?.id) {
      toast({
        title: "Erro",
        description: "Análise não disponível.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingLead(true)
    try {
      const res = await post<ApiResponse<any>>(`/leads/request`, {
        analysisId: analysis.id,
      })
      if (res?.success) {
        setLeadCreatedId(res.data?.id || "created")
        toast({
          title: "Sucesso!",
          description: "Solicitação enviada. Advogados podem visualizar seu lead no marketplace.",
        })
        setTimeout(() => {
          router.push("/cliente/meus-pedidos")
        }, 2000)
      }
    } catch (e: any) {
      toast({
        title: "Erro",
        description: e?.message || "Não foi possível solicitar um advogado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingLead(false)
    }
  }

  const totalFalhas = analysis?.falhas.length ?? 0
  const primeiraFalha = analysis?.falhas[0]
  const ocultas = Math.max(totalFalhas - 1, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-[#162D3F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análise CNIS</h1>
            <p className="text-gray-400 max-w-2xl">Envie o seu extrato previdenciário e nossa Inteligência Artificial vai traduzir tudo de forma simples e clara, identificando pendências e próximos passos.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 shrink-0">
            <Coins className="w-5 h-5 text-[#FFB6E1]" />
            <div className="leading-tight">
              <p className="text-xs text-gray-400">Seus créditos</p>
              {isLoadingBalance ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-6 bg-white/10 rounded animate-pulse w-20"></div>
                  <Loader2 className="w-3 h-3 animate-spin text-[#FFB6E1]" />
                </div>
              ) : (
                <p className="text-lg font-bold">{balance !== null ? balance : "--"}</p>
              )}
            </div>
            <Link
              href="/cliente/checkout"
              className="ml-2 text-xs font-bold text-[#0A1F30] bg-[#FFB6E1] hover:bg-[#ff9ed4] px-3 py-2 rounded-lg transition-colors"
            >
              Comprar
            </Link>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-12 font-sans flex flex-col items-center flex-grow">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFECF1] flex items-center justify-center">
                <FileText className="text-[#633B48] w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Seu Documento
              </h2>
            </div>

            <div className="flex-grow flex flex-col">
              {!file ? (
                <div className="border-2 border-dashed border-[#633B48]/30 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-[#FFECF1]/50 transition-colors cursor-pointer relative h-full min-h-[300px]">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Selecionar arquivo PDF do CNIS"
                  />
                  <Upload className="w-12 h-12 text-[#633B48] mb-4 opacity-80" />
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    Toque para escolher o PDF
                  </p>
                  <p className="text-sm text-gray-500">
                    Apenas o arquivo original do Meu INSS
                  </p>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-xl p-8 text-center h-full min-h-[300px] flex flex-col justify-center items-center">
                  <ShieldCheck className="w-16 h-16 text-green-500 mb-4" />
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    Arquivo recebido!
                  </p>
                  <p className="text-sm text-gray-600 mb-6 truncate max-w-[250px]">
                    {file.name}
                  </p>
                  <button
                    onClick={() => {
                      setFile(null)
                      setAnalysis(null)
                      setError(null)
                    }}
                    className="px-4 py-2 rounded-md text-gray-500 border border-gray-300 hover:bg-white transition-colors"
                    aria-label="Trocar arquivo"
                  >
                    Trocar arquivo
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full py-5 bg-[#633B48] hover:bg-[#300117] text-white font-bold text-lg rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "Processando..." : "Traduzir meu CNIS"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full min-h-[450px]">
            {!analysis && !isAnalyzing && !error && (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 min-h-[400px]">
                <Clock className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-lg font-medium text-gray-500">
                  Sua análise aparecerá aqui
                </p>
                <p className="text-sm mt-2">É rápido e seguro.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex-grow flex flex-col items-center justify-center text-center min-h-[400px] animate-in fade-in duration-500">
                <div className="w-full max-w-xs">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Analisando seu histórico...
                  </h3>
                  <ProgressIndicator value={progress} label={stepLabel} />
                </div>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="mb-6 bg-red-50 p-6 rounded-full">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Erro na Análise</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8">
                  {error === "PASSWORD_PROTECTED"
                    ? "Seu PDF está protegido por senha. Remova a proteção e envie novamente."
                    : error === "ILLEGIBLE"
                      ? "Não conseguimos ler o documento. Use o arquivo original do Meu INSS."
                      : "Ocorreu um problema ao ler seu documento. Tente enviar novamente ou use o arquivo original."}
                </p>
                <button
                  onClick={handleRetry}
                  className="border-2 border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] font-bold px-8 py-2 rounded-xl transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {analysis && (
              <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">
                    Resumo da sua vida
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-200">
                    <AlertCircle size={16} />
                    Encontramos {totalFalhas} {totalFalhas === 1 ? "ponto de atenção" : "pontos de atenção"}
                  </div>
                </div>

                <div className="space-y-4 flex-grow">
                  {primeiraFalha ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative">
                      <div className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                        Amostra Grátis
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        {primeiraFalha.titulo || "Ponto de atenção encontrado"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {primeiraFalha.descricao ||
                          "Identificamos uma inconsistência no seu CNIS que pode impactar seu benefício."}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800">
                      Nenhuma inconsistência grave foi encontrada no seu CNIS.
                    </div>
                  )}

                  {ocultas > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                      <div className="blur-sm opacity-50 select-none pointer-events-none">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Pendência adicional detectada
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Há mais inconsistências no seu extrato que podem afetar o valor
                          ou a liberação do seu benefício...
                        </p>
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                          <Lock className="w-6 h-6 text-[#633B48]" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          {ocultas} {ocultas === 1 ? "Pendência Oculta" : "Pendências Ocultas"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {analysis && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
            {leadCreatedId ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-10 text-green-800 shadow-md">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <h4 className="font-bold text-2xl">Lead criado com sucesso!</h4>
                </div>
                <p className="text-center text-green-700 mb-6">
                  Sua solicitação foi enviada para o marketplace. Advogados podem visualizar e capturar seu lead.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push("/cliente/meus-pedidos")}
                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-5 h-5" />
                    Ver Meus Leads
                  </button>
                  <button
                    onClick={() => {
                      setAnalysis(null)
                      setFile(null)
                      setLeadCreatedId(null)
                    }}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-green-600 font-bold border border-green-200 transition-colors"
                  >
                    Analisar Novo CNIS
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#633B48] rounded-2xl p-8 md:p-10 text-white shadow-xl border border-[#300117]">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h4 className="font-bold text-2xl md:text-3xl mb-3">
                    Não perca dinheiro do INSS
                  </h4>
                  <p className="text-[#FFECF1] text-base md:text-lg">
                    Problemas ocultos podem reduzir o valor da sua aposentadoria ou
                    atrasar a liberação. Escolha como quer resolver as pendências
                    encontradas:
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <button
                    onClick={handleVerRelatorio}
                    className="w-full py-5 rounded-xl bg-white hover:bg-gray-100 text-[#633B48] font-bold text-lg flex flex-col items-center justify-center transition-transform hover:scale-[1.02] shadow-md gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm md:text-base">Ver Relatório Completo</span>
                  </button>

                  <button
                    onClick={handleRequestAdvogado}
                    disabled={isCreatingLead}
                    className="w-full py-5 rounded-xl bg-[#FFB6E1] hover:bg-[#ff9ed4] text-[#0A1F30] font-bold text-lg flex flex-col items-center justify-center transition-transform hover:scale-[1.02] shadow-md gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCreatingLead ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Briefcase className="w-5 h-5" />
                    )}
                    <span className="text-sm md:text-base">
                      {isCreatingLead ? "Enviando..." : "Solicitar Advogado"}
                    </span>
                  </button>

                  <Link
                    href={`/cliente/advogados${analysis?.id ? `?analysisId=${analysis.id}` : ""}`}
                    className="w-full"
                  >
                    <button className="w-full py-5 rounded-xl bg-[#300117] hover:bg-[#1a000c] text-white border border-[#FFECF1]/20 font-bold text-lg flex flex-col items-center justify-center transition-transform hover:scale-[1.02] shadow-md gap-2">
                      <ArrowRight className="w-5 h-5" />
                      <span className="text-sm md:text-base">Parceiros Diretos</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
