import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  FileText,
  Download,
  Lock,
  FileX,
  RefreshCcw,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { AnalysisResult, Severity } from "@/lib/types"
import ProgressIndicator from "./ProgressIndicator"
import { Button } from "./ui/button"

interface AnalysisResultProps {
  result: AnalysisResult | null
  loading: boolean
  error?: "PASSWORD_PROTECTED" | "ILLEGIBLE" | "GENERIC" | null
  onRetry?: () => void
}

const ANALYSIS_STEPS = [
  { label: "Lendo documento...", value: 20 },
  { label: "Identificando vínculos...", value: 45 },
  { label: "Analisando inconsistências...", value: 70 },
  { label: "Gerando relatório técnico...", value: 90 },
]

interface SeverityStyles {
  bg: string
  border: string
  text: string
  icon: JSX.Element
}

function getSeverityStyles(severity: Severity): SeverityStyles {
  switch (severity) {
    case "ALTA":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-900",
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      }
    case "MEDIA":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-900",
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      }
    case "BAIXA":
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-900",
        icon: <Info className="w-6 h-6 text-blue-600" />,
      }
    case "INFO":
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-900",
        icon: <Info className="w-6 h-6 text-gray-600" />,
      }
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-900",
        icon: <Info className="w-6 h-6 text-gray-600" />,
      }
  }
}

export default function AnalysisResultComponent({
  result,
  loading,
  error,
  onRetry,
}: AnalysisResultProps): JSX.Element {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Lógica do Stepper Pseudo-Assíncrono
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (loading) {
      setStepIndex(0)
      setProgress(ANALYSIS_STEPS[0].value)

      interval = setInterval(() => {
        setStepIndex((prev) => {
          const next = prev + 1
          if (next < ANALYSIS_STEPS.length) {
            setProgress(ANALYSIS_STEPS[next].value)
            return next
          }
          return prev
        })
      }, 4000) // 4 segundos por etapa
    } else {
      if (result) setProgress(100)
    }

    return () => clearInterval(interval)
  }, [loading, result])

  // Componente de Erro Amigável
  const ErrorDisplay = () => {
    const errorConfigs = {
      PASSWORD_PROTECTED: {
        icon: <Lock className="w-12 h-12 text-red-500" />,
        title: "Arquivo Protegido",
        description: "O PDF enviado possui senha e não pode ser lido pela IA. Por favor, remova a proteção ou envie o arquivo original sem senha.",
      },
      ILLEGIBLE: {
        icon: <FileX className="w-12 h-12 text-orange-500" />,
        title: "Arquivo Ilegível",
        description: "Não conseguimos identificar o conteúdo do documento. Verifique se o arquivo é um CNIS original baixado do portal 'Meu INSS'.",
      },
      GENERIC: {
        icon: <AlertCircle className="w-12 h-12 text-gray-500" />,
        title: "Erro no Processamento",
        description: "Ocorreu uma falha inesperada durante a análise. Nossa equipe técnica já foi notificada.",
      },
    }

    const config = errorConfigs[error || "GENERIC"]

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
        <div className="mb-6 bg-red-50 p-6 rounded-full">
          {config.icon}
        </div>
        <h3 className="text-xl font-bold text-[#0A1F30] mb-2">{config.title}</h3>
        <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed">
          {config.description}
        </p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] font-bold px-8"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col min-h-[500px]">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-[#0A1F30] mb-6">
              Análise em Progresso
            </h3>
            <ProgressIndicator 
              value={progress} 
              label={ANALYSIS_STEPS[stepIndex]?.label || "Finalizando..."} 
            />
            <p className="mt-8 text-sm text-gray-400 italic">
              Este processo pode levar até 20 segundos dependendo da complexidade do documento.
            </p>
          </div>
        </div>
      ) : error ? (
        <ErrorDisplay />
      ) : !result ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="mb-4 bg-gray-50 p-6 rounded-full">
            <CheckCircle className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-lg font-bold text-[#0A1F30] mb-1">
            Auditoria Pendente
          </p>
          <p className="text-sm">Faça o upload do documento ao lado.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-2xl text-[#0A1F30] mb-1">
                {result.titulo || "Relatório Técnico"}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FileText size={16} /> Data da Análise:{" "}
                <span className="font-bold text-[#633B48]">
                  {result.dataCriacao ? new Date(result.dataCriacao).toLocaleDateString() : "N/A"}
                </span>
              </p>
            </div>
            {result.issues && (
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-bold border border-orange-200 flex items-center gap-2">
                <AlertTriangle size={16} />
                {result.issues.length} Inconsistências
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm italic">{result.descricaoGeral}</p>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            {result.issues && result.issues.length > 0 ? (
              result.issues.map((issue) => {
                const styles = getSeverityStyles(issue.severidade ?? "INFO")

                return (
                  <div
                    key={issue.id}
                    className={`${styles.bg} ${styles.border} border rounded-xl p-5`}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">{styles.icon}</div>
                      <div className="w-full">
                        <h4
                          className={`font-bold ${styles.text} text-lg mb-2`}
                        >
                          {issue.titulo}
                        </h4>
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                          {issue.descricao}
                        </p>
                        <div className="bg-white/80 rounded-lg p-3 text-sm font-medium border border-black/5 text-[#0A1F30]">
                          <strong className="text-[#633B48]">
                            Ação Recomendada:
                          </strong>{" "}
                          {issue.sugestaoCorrecao}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-10 text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-20" />
                <p>Nenhuma inconsistência grave foi detectada neste documento.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              className="w-full py-4 border-2 border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              aria-label="Exportar laudo técnico em PDF"
            >
              <Download className="w-5 h-5" />
              Exportar Laudo em PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
