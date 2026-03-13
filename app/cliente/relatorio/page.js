"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, AlertCircle, CheckCircle2, FileText, ArrowRight, ShieldAlert, Info, AlertTriangle } from "lucide-react"

export default function RelatorioDesbloqueadoPage() {
    const router = useRouter()
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = () => {
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            alert("Download do PDF iniciado com sucesso!")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans">
            
            <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Pagamento confirmado! Seu relatório completo foi desbloqueado.
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
                
                <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#633B48]"></div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold mb-3 uppercase tracking-wider">
                            <FileText className="w-3 h-3" /> Análise Concluída
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório do seu INSS</h1>
                        <p className="text-gray-600">
                            Nossa IA analisou seu documento e encontrou <strong>3 pendências</strong> que precisam da sua atenção.
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-b-2xl p-8 shadow-sm space-y-6">
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-yellow-900 mb-2">Trabalho sem documento confirmado</h3>
                                <p className="text-yellow-800 mb-4 leading-relaxed">
                                    A empresa <strong>Modelo A</strong> informou que você trabalhou lá, mas o INSS marcou esse período como pendente. Sem a comprovação, esse tempo pode não contar para a sua aposentadoria.
                                </p>
                                <div className="bg-white/60 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-900">
                                    <strong>O que fazer:</strong> Você precisará apresentar sua Carteira de Trabalho (CTPS) original ou a Ficha de Registro de Empregado para validar esse período.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <Info className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-blue-900 mb-2">Contrato sem data de saída</h3>
                                <p className="text-blue-800 mb-4 leading-relaxed">
                                    Consta que o seu vínculo com a empresa <strong>Comercio Falho LTDA</strong>, iniciado em 2020, ainda está em aberto. Se você já saiu dessa empresa, o INSS precisa ser avisado.
                                </p>
                                <div className="bg-white/60 p-4 rounded-lg border border-blue-200 text-sm text-blue-900">
                                    <strong>O que fazer:</strong> É necessário solicitar um "acerto de vínculo" enviando a página do seu contrato de trabalho com a data de demissão preenchida.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <ShieldAlert className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-red-900 mb-2">Meses pagos com valor muito baixo</h3>
                                <p className="text-red-800 mb-4 leading-relaxed">
                                    Na <strong>Consultoria X</strong>, identificamos que dois meses de 2023 foram recolhidos com um valor abaixo do salário mínimo exigido por lei.
                                </p>
                                <div className="bg-white/60 p-4 rounded-lg border border-red-200 text-sm text-red-900">
                                    <strong>O que fazer:</strong> Esses meses serão descartados da sua aposentadoria se não forem ajustados. É possível emitir uma guia complementar (DAS) para pagar a diferença e salvar esse tempo.
                                </div>
                            </div>
                        </div>
                    </div>

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
                            Você pode tentar resolver sozinho no Meu INSS, ou contratar um de nossos especialistas para fazer isso de forma rápida e segura.
                        </p>
                    </div>
                    <Link href="/cliente/advogados" className="w-full md:w-auto">
                        <button className="w-full md:w-auto px-8 py-5 rounded-xl bg-[#633B48] hover:bg-[#300117] border border-[#FFECF1]/20 text-white font-bold text-lg flex items-center justify-center transition-transform hover:scale-105">
                            Ver Advogados Parceiros <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    )
}