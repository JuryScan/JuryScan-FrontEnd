"use client"

import { useState } from "react"
import { Upload, FileText, ShieldCheck, ArrowRight, AlertCircle, Clock, Lock, Unlock } from "lucide-react"

export default function ClienteDashboardPage() {
    const [file, setFile] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) setFile(selectedFile)
    }

    const handleAnalyze = () => {
        if (!file) return
        setIsAnalyzing(true)
        
        // Simula o tempo de análise da IA
        setTimeout(() => {
            setIsAnalyzing(false)
            setResult(true) 
        }, 2500)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl">
                
                {/* Cabeçalho de Boas-vindas */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Olá! Vamos analisar seu INSS?</h1>
                    <p className="text-gray-600 text-lg">
                        Envie seu extrato (CNIS) e nossa Inteligência Artificial vai traduzir tudo de forma simples.
                    </p>
                </div>

                {/* CONTAINER DAS DUAS COLUNAS COM ALTURA IGUAL (items-stretch) */}
                <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-8">
                    
                    {/* COLUNA ESQUERDA: ÁREA DE UPLOAD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFECF1] flex items-center justify-center">
                                <FileText className="text-[#633B48] w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Seu Documento</h2>
                        </div>

                        <div className="flex-grow flex flex-col">
                            {!file ? (
                                <div className="border-2 border-dashed border-[#633B48]/30 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-[#FFECF1]/50 transition-colors cursor-pointer relative h-full min-h-[300px]">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-12 h-12 text-[#633B48] mb-4 opacity-80" />
                                    <p className="text-lg font-bold text-gray-900 mb-2">Toque para escolher o PDF</p>
                                    <p className="text-sm text-gray-500">Apenas o arquivo original do Meu INSS</p>
                                </div>
                            ) : (
                                <div className="border border-green-200 bg-green-50 rounded-xl p-8 text-center h-full min-h-[300px] flex flex-col justify-center items-center">
                                    <ShieldCheck className="w-16 h-16 text-green-500 mb-4" />
                                    <p className="font-bold text-gray-900 text-lg mb-1">Arquivo recebido!</p>
                                    <p className="text-sm text-gray-600 mb-6 truncate max-w-[250px]">{file.name}</p>
                                    <button 
                                        onClick={() => { setFile(null); setResult(null); }}
                                        className="px-4 py-2 rounded-md text-gray-500 border border-gray-300 hover:bg-white transition-colors"
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
                                {isAnalyzing ? "Nossa IA está lendo seu documento..." : "Traduzir meu CNIS"}
                            </button>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: RESULTADO TRADUZIDO */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full">
                        {!result && !isAnalyzing && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 min-h-[400px]">
                                <Clock className="w-16 h-16 text-gray-200 mb-4" />
                                <p className="text-lg font-medium text-gray-500">Sua análise aparecerá aqui</p>
                                <p className="text-sm mt-2">É rápido e seguro.</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center min-h-[400px]">
                                <div className="w-16 h-16 border-4 border-[#FFECF1] border-t-[#633B48] rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Analisando seu histórico...</h3>
                                <p className="text-gray-500">Procurando vínculos e oportunidades de correção.</p>
                            </div>
                        )}

                        {result && (
                            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h3 className="font-bold text-2xl text-gray-900 mb-2">Resumo da sua vida</h3>
                                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-200">
                                        <AlertCircle size={16} />
                                        Encontramos 3 pontos de atenção
                                    </div>
                                </div>

                                <div className="space-y-4 flex-grow">
                                    {/* PREVIEW GRATUITO */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative">
                                        <div className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                            Amostra Grátis
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            Trabalho sem documento confirmado
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-3">
                                            A empresa <strong>Modelo A</strong> informou que você trabalhou lá, mas o INSS precisa da sua Carteira de Trabalho para ter certeza.
                                        </p>
                                    </div>

                                    {/* ITEM BLOQUEADO */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                                        <div className="blur-sm opacity-50 select-none pointer-events-none">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Contrato sem data de saída
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-3">
                                                Consta que você ainda está trabalhando na Comercio Falho LTDA desde 2020. Se você já saiu de lá, precisaremos avisar o INSS...
                                            </p>
                                        </div>
                                        
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                                            <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                                                <Lock className="w-6 h-6 text-[#633B48]" />
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">2 Pendências Ocultas</span>
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
                                <h4 className="font-bold text-2xl md:text-3xl mb-3">Não perca dinheiro do INSS</h4>
                                <p className="text-[#FFECF1] text-base md:text-lg">
                                    Problemas ocultos podem reduzir o valor da sua aposentadoria ou atrasar a liberação. Escolha como quer resolver as pendências encontradas:
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                <button className="w-full py-5 rounded-xl bg-white hover:bg-gray-100 text-[#633B48] font-bold text-lg flex items-center justify-center transition-transform hover:scale-[1.02] shadow-md">
                                    <Unlock className="w-5 h-5 mr-2" /> 
                                    Desbloquear Relatório (R$ 29,90)
                                </button>
                                
                                <button className="w-full py-5 rounded-xl bg-[#300117] hover:bg-[#1a000c] text-white border border-[#FFECF1]/20 font-bold text-lg flex items-center justify-center transition-transform hover:scale-[1.02] shadow-md" link="/cliente/advogados">
                                    Contratar Advogado Parceiro <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}