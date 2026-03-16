import { CheckCircle, AlertTriangle, AlertCircle, Info, FileText, Download } from "lucide-react"

export default function AnalysisResult({ result, loading }) {

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case "critical":
                return { bg: "bg-red-50", border: "border-red-200", text: "text-red-900", icon: <AlertCircle className="w-6 h-6 text-red-600" /> }
            case "warning":
                return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-900", icon: <AlertTriangle className="w-6 h-6 text-yellow-600" /> }
            case "info":
                return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: <Info className="w-6 h-6 text-blue-600" /> }
            default:
                return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-900", icon: <Info className="w-6 h-6 text-gray-600" /> }
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                    <div className="w-16 h-16 border-4 border-[#FFECF1] border-t-[#633B48] rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Processando CNIS...</h3>
                    <p className="text-sm">Cruzando dados com indicadores do INSS.</p>
                </div>
            ) : !result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
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
                            <h3 className="font-bold text-2xl text-[#0A1F30] mb-1">Relatório Técnico</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FileText size={16}/> Segurado: <span className="font-bold text-[#633B48]">{result.summary.clientName}</span>
                            </p>
                        </div>
                        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-bold border border-orange-200 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {result.summary.totalIssues} Inconsistências
                        </div>
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {result.issues.map((issue) => {
                            const styles = getSeverityStyles(issue.severity)

                            return (
                                <div key={issue.id} className={`${styles.bg} ${styles.border} border rounded-xl p-5`}>
                                    <div className="flex gap-4">
                                        <div className="mt-1 flex-shrink-0">
                                            {styles.icon}
                                        </div>
                                        <div className="w-full">
                                            <h4 className={`font-bold ${styles.text} text-lg mb-2`}>
                                                {issue.title}
                                            </h4>
                                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                                {issue.description}
                                            </p>
                                            <div className="bg-white/80 rounded-lg p-3 text-sm font-medium border border-black/5 text-[#0A1F30]">
                                                <strong className="text-[#633B48]">Ação Recomendada:</strong> {issue.recommendation}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button className="w-full py-4 border-2 border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" />
                            Exportar Laudo em PDF
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}