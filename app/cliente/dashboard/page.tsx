"use client"

import { useState, type JSX, type ChangeEvent } from "react"
import Link from "next/link"
import {
  Upload,
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Clock,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"
import { post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

import ProgressIndicator from "@/components/ProgressIndicator"

export default function ClienteDashboardPage(): JSX.Element {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepLabel, setStepLabel] = useState("")
  const [error, setError] = useState<"PASSWORD_PROTECTED" | "ILLEGIBLE" | "GENERIC" | null>(null)
  const [result, setResult] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(false)
    }
  }

  const handleAnalyze = () => {
    if (!file) return
    setIsAnalyzing(true)
    setError(null)
    setResult(false)
    setProgress(10)
    setStepLabel("Lendo documento...")

    // Simulação de progresso para o cliente
    const steps = [
      { p: 35, l: "Identificando vínculos..." },
      { p: 70, l: "Analisando inconsistências..." },
      { p: 95, l: "Gerando resumo..." }
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgress(step.p)
        setStepLabel(step.l)
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false)
            setResult(true)
            setProgress(100)
          }, 2000)
        }
      }, (index + 1) * 3000)
    })
  }

  const handleRetry = () => {
    setError(null)
    setResult(false)
    setIsAnalyzing(false)
    setFile(null)
  }

  const handleUnlock = async () => {
    if (!user?.id) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      })
      return
    }

    setIsBuying(true)
    try {
      const response = await post<ApiResponse<any>>("/product-checkout/checkout", {
        name: "Desbloqueio de Relatório Individual",
        amount: 2990, // R$ 29,90 em centavos
        quantity: 1
      })

      if (response.success && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl
      }
    } catch (error) {
      console.error("Erro no checkout:", error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá! Vamos analisar seu INSS?
          </h1>
          <p className="text-gray-600 text-lg">
            Envie seu extrato (CNIS) e nossa Inteligência Artificial fará a análise do documento, identificando e informando eventuais inconsistências.
          </p>
        </div>

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
                      setResult(false)
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
                {isAnalyzing
                  ? "Processando..."
                  : "Analisar meu CNIS"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full min-h-[450px]">
            {!result && !isAnalyzing && !error && (
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
                  Ocorreu um problema ao ler seu documento. Tente enviar novamente ou use o arquivo original.
                </p>
                <button 
                  onClick={handleRetry}
                  className="border-2 border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] font-bold px-8 py-2 rounded-xl transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {result && (
              <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">
                    Resumo da sua vida
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-200">
                    <AlertCircle size={16} />
                    Encontramos 3 pontos de atenção
                  </div>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative">
                    <div className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                      Amostra Grátis
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Trabalho sem documento confirmado
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      A empresa <strong>Modelo A</strong> informou que você
                      trabalhou lá, mas o INSS precisa da sua Carteira de Trabalho
                      para ter certeza.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                    <div className="blur-sm opacity-50 select-none pointer-events-none">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Contrato sem data de saída
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Consta que você ainda está trabalhando na Comercio Falho
                        LTDA desde 2020. Se você já saiu de lá, precisaremos
                        avisar o INSS...
                      </p>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                        <Lock className="w-6 h-6 text-[#633B48]" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        2 Pendências Ocultas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
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

              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <button 
                  onClick={handleUnlock}
                  disabled={isBuying}
                  className="w-full py-5 rounded-xl bg-white hover:bg-gray-100 text-[#633B48] font-bold text-lg flex items-center justify-center transition-transform hover:scale-[1.02] shadow-md disabled:opacity-70"
                >
                  {isBuying ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Unlock className="w-5 h-5 mr-2" />
                  )}
                  Desbloquear Relatório (R$ 29,90)
                </button>

                <Link href="/cliente/advogados" className="w-full">
                  <button className="w-full py-5 rounded-xl bg-[#300117] hover:bg-[#1a000c] text-white border border-[#FFECF1]/20 font-bold text-lg flex items-center justify-center transition-transform hover:scale-[1.02] shadow-md">
                    Solicitar Advogado Parceiro{" "}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
