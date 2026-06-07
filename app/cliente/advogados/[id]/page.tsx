"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
    ArrowLeft, ShieldCheck, MapPin, Briefcase, 
    CheckCircle2, Scale, Loader2, Mail, Phone 
} from "lucide-react"
import { get } from "@/lib/api"
import type { ApiResponse, Lawyer } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import AvatarWithInitial from "@/components/AvatarWithInitial"

export default function PerfilAdvogadoPage() {
    const router = useRouter()
    const params = useParams()
    const [lawyer, setLawyer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLawyer = async () => {
            if (!params.id) return
            try {
                const res = await get<ApiResponse<any>>(`/users/advogado/${params.id}`)
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
                                <div className="z-10">
                                    <AvatarWithInitial
                                        name={lawyer.nomeCompleto}
                                        photoUrl={lawyer.fotoUrl}
                                        size="lg"
                                        borderColor="border-white shadow-md"
                                    />
                                </div>
                                <div className="z-10 mt-2 sm:mt-4">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{lawyer.nomeCompleto}</h1>
                                        {lawyer.verificado && (
                                            <ShieldCheck className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-[#633B48] font-semibold mb-3">{lawyer.numeroOab}</p>
                                    
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        {lawyer.localizacao || "Atendimento Online"}
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
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 text-lg mb-6">Dados de Contato</h3>
                            
                            <div className="space-y-4">
                                <a 
                                    href={`mailto:${lawyer.email}`}
                                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group"
                                >
                                    <Mail className="w-5 h-5 text-[#633B48] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Email</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">{lawyer.email || "Não informado"}</p>
                                    </div>
                                </a>
                                
                                {lawyer.telefone && (
                                    <a 
                                        href={`tel:${lawyer.telefone}`}
                                        className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group"
                                    >
                                        <Phone className="w-5 h-5 text-[#633B48] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 font-medium">Telefone</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{lawyer.telefone}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
