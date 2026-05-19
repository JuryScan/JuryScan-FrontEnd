"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
    ArrowLeft, Star, ShieldCheck, MapPin, Briefcase, 
    MessageCircle, CheckCircle2, Clock, Scale, Loader2 
} from "lucide-react"
import { get, post } from "@/lib/api"
import type { ApiResponse, Lawyer } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function PerfilAdvogadoPage() {
    const router = useRouter()
    const params = useParams()
    const [lawyer, setLawyer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSendingLead, setIsSendingLead] = useState(false)

    useEffect(() => {
        const fetchLawyer = async () => {
            if (!params.id) return
            try {
                const res = await get<ApiResponse<any>>(`/users/advogados/${params.id}`)
                if (res.success) {
                    setLawyer(res.data)
                }
            } catch (error) {
                console.error("Erro ao buscar advogado:", error)
                toast({ title: "Erro", description: "Não foi possível carregar o perfil.", variant: "destructive" })
            } finally {
                setIsLoading(false)
            }
        }
        fetchLawyer()
    }, [params.id])

    const handleSolicitarAtendimento = async () => {
        setIsSendingLead(true)
        try {
            // Simulação de criação de Lead/Chat
            await post(`/leads`, { lawyerId: params.id })
            toast({ 
                title: "Solicitação Enviada!", 
                description: "O advogado recebeu seu interesse e entrará em contato em breve.",
                variant: "default" 
            })
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao enviar solicitação.", variant: "destructive" })
        } finally {
            setIsSendingLead(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="size-12 animate-spin text-[#633B48]" />
            </div>
        )
    }

    if (!lawyer) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advogado não encontrado</h2>
                <button onClick={() => router.back()} className="text-[#633B48] font-bold">Voltar</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans">
            
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-[#633B48] transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para a lista
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    
                    <div className="md:col-span-2 space-y-6">
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#FFECF1] to-white"></div>
                            
                            <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                                <img 
                                    src={lawyer.fotoUrl || "https://via.placeholder.com/150"} 
                                    alt={lawyer.nomeCompleto} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md z-10"
                                />
                                <div className="z-10 mt-2 sm:mt-4">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{lawyer.nomeCompleto}</h1>
                                        {lawyer.verificado && (
                                            <ShieldCheck className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-[#633B48] font-semibold mb-3">{lawyer.numeroOab}</p>
                                    
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-yellow-700">{lawyer.rating || "5.0"}</span>
                                            <span className="text-yellow-600">({lawyer.reviews || "0"} avaliações)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {lawyer.localizacao || "Atendimento Online"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#633B48]" />
                                Sobre o(a) Profissional
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {lawyer.descricao || "Este profissional ainda não adicionou uma descrição detalhada."}
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-[#633B48]" />
                                Especialidades
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {(lawyer.servicos || ["Direito Previdenciário", "Cálculos CNIS"]).map((service: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0A1F30] rounded-2xl shadow-sm border border-[#14324a] p-8 text-white">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#FFB6E1]" />
                                Como funciona a contratação?
                            </h2>
                            <ul className="space-y-4 text-sm text-gray-300">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#14324a] flex items-center justify-center flex-shrink-0 font-bold text-[#FFB6E1]">1</div>
                                    <p>Você solicita o atendimento enviando seu relatório gerado pela nossa IA.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#14324a] flex items-center justify-center flex-shrink-0 font-bold text-[#FFB6E1]">2</div>
                                    <p>O advogado analisa o caso e envia uma proposta de honorários pelo chat.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#14324a] flex items-center justify-center flex-shrink-0 font-bold text-[#FFB6E1]">3</div>
                                    <p>O pagamento inicial fica retido e protegido pela JuryScan até o serviço começar.</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Gostou do profissional?</h3>
                                <p className="text-sm text-gray-500">Envie uma mensagem e anexe seu relatório do INSS gratuitamente.</p>
                            </div>

                            <button 
                                onClick={handleSolicitarAtendimento}
                                disabled={isSendingLead}
                                className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-md mb-4 disabled:opacity-70"
                            >
                                {isSendingLead ? <Loader2 className="size-6 animate-spin" /> : (
                                    <>
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Solicitar Atendimento
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
                                <Clock className="w-4 h-4" />
                                Tempo de resposta: aprox. 2 horas
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
