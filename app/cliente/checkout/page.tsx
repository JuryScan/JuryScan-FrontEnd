"use client"
 
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, ShieldCheck, FileText, CheckCircle2 } from "lucide-react"
 
export default function CheckoutPage() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
 
    const handlePayment = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            alert("Pagamento aprovado! O relatório completo foi desbloqueado.")
            router.push("/cliente/relatorio")
        }, 2000)
    }
 
    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans flex flex-col items-center">
 
            {/* Header */}
            <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-[#633B48] transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar
                    </button>
                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <Lock className="w-4 h-4" />
                        Ambiente Seguro
                    </div>
                </div>
            </div>
 
            {/* Title */}
            <div className="w-full max-w-5xl px-6 mt-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalize seu pedido</h1>
                    <p className="text-gray-600">Confirme os detalhes abaixo para liberar sua análise completa.</p>
                </div>
 
                {/* Order Summary Centered */}
                <div className="flex justify-center">
                    <div className="w-full max-w-sm">
                        <div className="bg-[#0A1F30] rounded-2xl shadow-lg border border-[#14324a] p-6 text-white">
                            <h3 className="font-bold text-xl mb-6 border-b border-[#14324a] pb-4">Resumo do Pedido</h3>
 
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#14324a] p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-[#FFB6E1]" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Desbloqueio de Relatório CNIS</p>
                                        <p className="text-xs text-gray-400 mt-1">Acesso imediato às pendências ocultas</p>
                                    </div>
                                </div>
                                <span className="font-bold">R$ 29,90</span>
                            </div>
 
                            <div className="border-t border-[#14324a] pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-[#FFB6E1]">R$ 29,90</span>
                                </div>
                            </div>
 
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all disabled:opacity-70"
                            >
                                {isProcessing ? "Processando..." : "Pagar Agora"}
                            </button>
 
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <ShieldCheck className="w-4 h-4 text-green-400" /> Transação criptografada
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Acesso liberado na hora
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}