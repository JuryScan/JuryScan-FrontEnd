"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"
import Link from "next/link"
import {
    ArrowLeft, CreditCard, Smartphone, Lock, CheckCircle2,
    XCircle, Loader2, ShieldCheck, Copy, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
    const params = useSearchParams()
    const plan = params.get("plan") ?? "Advogado Expert"
    const price = params.get("price") ?? "R$ 89,90"

    const [method, setMethod] = useState("card")
    const [status, setStatus] = useState("idle")
    const [copied, setCopied] = useState(false)

    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    })

    function formatCardNumber(value) {
        return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19)
    }

    function formatExpiry(value) {
        return value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/, "$1/").slice(0, 5)
    }

    function handleChange(e) {
        const { name, value } = e.target
        if (name === "number") {
            setCard(prev => ({ ...prev, number: formatCardNumber(value) }))
        } else if (name === "expiry") {
            setCard(prev => ({ ...prev, expiry: formatExpiry(value) }))
        } else {
            setCard(prev => ({ ...prev, [name]: value }))
        }
    }

    function handlePayment() {
        if (method === "card") {
            if (!card.number || !card.name || !card.expiry || !card.cvv) {
                return
            }
        }
        setStatus("loading")
        setTimeout(() => {
            setStatus(Math.random() > 0.2 ? "success" : "error")
        }, 2200)
    }

    function handleCopyPix() {
        navigator.clipboard.writeText(pixCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const pixCode = `00020126580014br.gov.bcb.pix0136${plan.replace(/\s/g, "")}-${price.replace(/[^0-9]/g, "")}520400005303986540${price.replace(/[^0-9,]/g, "").replace(",", ".")}5802BR5925JuryScan6009Sao Paulo62070503***63041D3D`

    const isCardValid = card.number.length === 19 && card.name && card.expiry.length === 5 && card.cvv.length >= 3

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <header className="bg-white border-b border-gray-100 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/servicos" className="flex items-center gap-2 text-gray-500 hover:text-[#633B48] transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar aos planos
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Lock className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700 font-medium">Checkout Seguro</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-10 px-4">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

                    {/* LEFT — Resumo */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#633B48] mb-4">Resumo do pedido</p>

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{plan}</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Cobrança mensal · Cancele quando quiser</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="text-2xl font-bold text-[#633B48]">{price}</span>
                                    <span className="text-xs text-gray-400 block">/mês</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-5 pt-5 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{price}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Desconto</span>
                                    <span className="text-green-600">R$ 0,00</span>
                                </div>
                                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>{price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#633B48]/5 rounded-2xl border border-[#633B48]/10 p-5 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Garantia de 7 dias</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Se não estiver satisfeito, basta nos avisar e devolvemos 100% do valor pago, sem perguntas.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Pagamento */}
                    <div className="lg:col-span-3">

                        {status === "success" ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Pagamento aprovado!</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                                    Seu plano <strong className="text-gray-700">{plan}</strong> está ativo. Você receberá um e-mail com os detalhes em breve.
                                </p>
                                <Link href="/auditoria">
                                    <Button className="bg-[#633B48] hover:bg-[#300117] text-white mt-4 px-8 py-5">
                                        Acessar minha conta
                                    </Button>
                                </Link>
                            </div>
                        ) : status === "error" ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Pagamento recusado</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                                    Não conseguimos processar seu pagamento. Verifique os dados e tente novamente.
                                </p>
                                <Button
                                    onClick={() => setStatus("idle")}
                                    variant="outline"
                                    className="border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white mt-4 px-8 py-5"
                                >
                                    Tentar novamente
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                                <div className="flex border-b border-gray-100">
                                    <button
                                        onClick={() => setMethod("card")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${method === "card"
                                            ? "text-[#633B48] border-b-2 border-[#633B48] bg-[#633B48]/5"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Cartão de crédito
                                    </button>
                                    <button
                                        onClick={() => setMethod("pix")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${method === "pix"
                                            ? "text-[#633B48] border-b-2 border-[#633B48] bg-[#633B48]/5"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        PIX
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">

                                    {method === "card" && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Número do cartão</label>
                                                <input
                                                    name="number"
                                                    value={card.number}
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength={19}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#633B48]/30 focus:border-[#633B48] transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nome no cartão</label>
                                                <input
                                                    name="name"
                                                    value={card.name}
                                                    placeholder="Como aparece no cartão"
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#633B48]/30 focus:border-[#633B48] transition"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Validade</label>
                                                    <input
                                                        name="expiry"
                                                        value={card.expiry}
                                                        placeholder="MM/AA"
                                                        maxLength={5}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#633B48]/30 focus:border-[#633B48] transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">CVV</label>
                                                    <input
                                                        name="cvv"
                                                        value={card.cvv}
                                                        placeholder="•••"
                                                        maxLength={4}
                                                        type="password"
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#633B48]/30 focus:border-[#633B48] transition"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={!isCardValid || status === "loading"}
                                                className="w-full mt-2 bg-[#633B48] hover:bg-[#300117] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {status === "loading" ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Processando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4" />
                                                        Pagar {price}
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}

                                    {method === "pix" && (
                                        <div className="text-center space-y-4">
                                            <p className="text-sm text-gray-500">Escaneie o QR Code abaixo com o aplicativo do seu banco para pagar instantaneamente.</p>

                                            <div className="inline-flex p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <QRCodeCanvas value={pixCode} size={180} />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400 mb-2">Ou copie o código PIX</p>
                                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                                    <code className="text-xs text-gray-600 flex-1 truncate">{pixCode.slice(0, 40)}...</code>
                                                    <button
                                                        onClick={handleCopyPix}
                                                        className="flex-shrink-0 text-[#633B48] hover:text-[#300117] transition-colors"
                                                    >
                                                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={status === "loading"}
                                                className="w-full bg-[#633B48] hover:bg-[#300117] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {status === "loading" ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Verificando pagamento...
                                                    </>
                                                ) : "Já realizei o pagamento"}
                                            </button>
                                        </div>
                                    )}

                                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 pt-2">
                                        <Lock className="w-3 h-3" />
                                        Seus dados estão protegidos com criptografia SSL
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}