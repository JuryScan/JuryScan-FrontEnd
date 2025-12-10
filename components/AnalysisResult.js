import { CheckCircle, AlertTriangle, AlertCircle, Info, FileText } from "lucide-react"

export default function AnalysisResult({ result, loading }) {

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case "critical":
                return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: <AlertCircle className="w-5 h-5 text-red-600" /> }
            case "warning":
                return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", icon: <AlertTriangle className="w-5 h-5 text-yellow-600" /> }
            case "info":
                return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: <Info className="w-5 h-5 text-blue-600" /> }
            default:
                return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800", icon: <Info className="w-5 h-5 text-gray-600" /> }
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full min-h-[500px] flex flex-col">

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 animate-pulse gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <p className="text-sm">Analisando vínculos e indicadores...</p>
                </div>
            ) : !result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <div className="mb-4 bg-gray-50 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-500">
                        Aguardando arquivo para análise
                    </p>
                    <p className="text-sm">Faça o upload ao lado para começar</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">Relatório de Análise</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <FileText size={14}/> Segurado: {result.summary.clientName}
                                </p>
                            </div>
                            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                                {result.summary.totalIssues} Pendências
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {result.issues.map((issue) => {
                            const styles = getSeverityStyles(issue.severity)

                            return (
                                <div key={issue.id} className={`${styles.bg} ${styles.border} border rounded-lg p-4 transition-all hover:shadow-md`}>
                                    <div className="flex gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            {styles.icon}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold ${styles.text} text-sm mb-1`}>
                                                {issue.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                                {issue.description}
                                            </p>
                                            <div className="bg-white/60 rounded p-2 text-xs text-gray-700 font-medium border border-black/5">
                                                💡 Sugestão: {issue.recommendation}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <button className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 underline">
                            Baixar relatório completo em PDF
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}