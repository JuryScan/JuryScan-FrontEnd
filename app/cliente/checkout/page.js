"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, QrCode, Lock, ShieldCheck, FileText, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = (e) => {
        e.preventDefault()
        setIsProcessing(true)
        
        setTimeout(() => {
            setIsProcessing(false)
            alert("Pagamento aprovado! O relatório completo foi desbloqueado.")
            router.push("/cliente/relatorio") 
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans flex flex-col items-center">
            
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

            <div className="w-full max-w-5xl px-6 mt-8">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalize seu pedido</h1>
                    <p className="text-gray-600">Escolha a forma de pagamento para liberar sua análise completa.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Método de Pagamento</h2>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button 
                                    onClick={() => setPaymentMethod("pix")}
                                    className={`py-4 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${paymentMethod === "pix" ? "border-[#633B48] bg-[#FFECF1]/50 text-[#633B48]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    <QrCode className="w-6 h-6 mb-2" />
                                    <span className="font-bold">PIX</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod("card")}
                                    className={`py-4 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${paymentMethod === "card" ? "border-[#633B48] bg-[#FFECF1]/50 text-[#633B48]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    <CreditCard className="w-6 h-6 mb-2" />
                                    <span className="font-bold">Cartão de Crédito</span>
                                </button>
                            </div>

                            {paymentMethod === "pix" && (
                                <div className="text-center py-6 animate-in fade-in duration-300">
                                    <div className="bg-gray-50 p-6 rounded-xl inline-block mb-4 border border-gray-200">
                                        <div className="w-48 h-48 bg-white border-8 border-white shadow-sm flex items-center justify-center">
                                            <QrCode className="w-32 h-32 text-gray-800" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 text-sm">Escaneie o QR Code ou copie o código abaixo:</p>
                                    <div className="flex bg-gray-100 rounded-lg p-1 max-w-sm mx-auto border border-gray-200">
                                        <input type="text" readOnly value="00020126580014br.gov.bcb.pix..." className="bg-transparent flex-1 text-xs text-gray-500 px-3 outline-none" />
                                        <button className="bg-white text-[#633B48] px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-gray-50 border border-gray-200">Copiar</button>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "card" && (
                                <form className="space-y-4 animate-in fade-in duration-300" onSubmit={handlePayment}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#633B48] focus:border-transparent outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                                            <input type="text" placeholder="MM/AA" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#633B48] focus:border-transparent outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                            <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#633B48] focus:border-transparent outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                                        <input type="text" placeholder="Como impresso no cartão" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#633B48] focus:border-transparent outline-none" />
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-[#0A1F30] rounded-2xl shadow-lg border border-[#14324a] p-6 text-white sticky top-24">
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
                                onClick={paymentMethod === "card" ? handlePayment : () => {
                                    setIsProcessing(true);
                                    setTimeout(() => { setIsProcessing(false); router.push("/cliente/dashboard"); }, 2000);
                                }}
                                disabled={isProcessing}
                                className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all disabled:opacity-70"
                            >
                                {isProcessing ? "Processando..." : paymentMethod === "pix" ? "Já fiz o pagamento" : "Pagar Agora"}
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