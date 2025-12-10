"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Send, MessageSquare, CheckCircle } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">

                <section className="bg-[#633B48] py-16 px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Fale com a JuryScan
                    </h1>
                    <p className="text-white/80 max-w-xl mx-auto text-lg">
                        Tem alguma dúvida sobre nossas ferramentas ou quer sugerir uma melhoria? Estamos prontos para te ouvir.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        <div className="space-y-8">

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <Mail className="w-8 h-8 text-[#633B48] mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                                    <p className="text-sm text-gray-500">contato@juryscan.com.br</p>
                                    <p className="text-sm text-gray-500">suporte@juryscan.com.br</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <MapPin className="w-8 h-8 text-[#633B48] mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-1">Localização</h3>
                                    <p className="text-sm text-gray-500">Recife - PE</p>
                                    <p className="text-sm text-gray-500">Brasil</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <MessageSquare className="w-6 h-6 text-[#633B48]" />
                                    <h2 className="text-xl font-bold text-gray-900">Perguntas Frequentes</h2>
                                </div>

                                <div className="space-y-4">
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-[#633B48]">
                                            <span>O sistema é gratuito?</span>
                                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                                        </summary>
                                        <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                                            Oferecemos um plano gratuito limitado para testes e planos profissionais para escritórios com alta demanda.
                                        </p>
                                    </details>
                                    <div className="h-px bg-gray-100"></div>

                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-[#633B48]">
                                            <span>Como funciona o Auditor CNIS?</span>
                                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                                        </summary>
                                        <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                                            Basta fazer o upload do PDF do extrato previdenciário e nossa IA identifica automaticamente pendências e vínculos.
                                        </p>
                                    </details>
                                </div>
                            </div>

                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            {isSuccess ? (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto mb-8">
                                        Obrigado pelo contato. Nossa equipe retornará em até 24 horas úteis.
                                    </p>
                                    <Button
                                        onClick={() => setIsSuccess(false)}
                                        variant="outline"
                                        className="border-[#633B48] text-[#633B48] hover:bg-[#FFECF1]"
                                    >
                                        Enviar nova mensagem
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</label>
                                                <input
                                                    required
                                                    id="name"
                                                    type="text"
                                                    placeholder="Seu nome completo"
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</label>
                                                <input
                                                    required
                                                    id="email"
                                                    type="email"
                                                    placeholder="seu@email.com"
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-gray-700">Assunto</label>
                                            <select
                                                id="subject"
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48] bg-white"
                                            >
                                                <option>Suporte Técnico</option>
                                                <option>Dúvidas Comerciais</option>
                                                <option>Parcerias</option>
                                                <option>Outros</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-gray-700">Mensagem</label>
                                            <textarea
                                                required
                                                id="message"
                                                rows="5"
                                                placeholder="Como podemos ajudar?"
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48]/20 focus:border-[#633B48] resize-none"
                                            ></textarea>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#633B48] hover:bg-[#300117] text-white py-6 text-lg"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Enviando...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Enviar Mensagem <Send className="w-4 h-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}