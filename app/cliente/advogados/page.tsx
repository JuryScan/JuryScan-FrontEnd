"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Phone, Award, ShieldCheck, ArrowRight, Loader2, Mail } from "lucide-react"
import { get } from "@/lib/api"
import type { ApiResponse, PageResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import AvatarWithInitial from "@/components/AvatarWithInitial"

interface LawyerData {
  id: string
  nomeCompleto: string
  email: string
  telefone: string
  fotoUrl: string
  numeroOab: string
  descricao: string
  experiencia: string
  status: string
  emailVerificado: boolean
}



export default function MarketplaceAdvogados() {
    const searchParams = useSearchParams()
    const analysisId = searchParams.get("analysisId")
    const [allLawyers, setAllLawyers] = useState<LawyerData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Busca local dos advogados - filtra por nome ou número OAB
    const filteredLawyers = useMemo(() => {
        if (!searchTerm.trim()) return allLawyers
        
        const term = searchTerm.toLowerCase()
        return allLawyers.filter(lawyer =>
            lawyer.nomeCompleto.toLowerCase().includes(term) ||
            lawyer.numeroOab.toLowerCase().includes(term)
        )
    }, [allLawyers, searchTerm])

    // Carrega a lista completa de advogados uma única vez
    useEffect(() => {
        const fetchLawyers = async () => {
            setIsLoading(true)
            try {
                const response = await get<ApiResponse<PageResponse<LawyerData>>>(`/users/advogado/?page=0&page_size=100`)
                if (response?.success && response.data?.items) {
                    setAllLawyers(response.data.items)
                } else {
                    setAllLawyers([])
                }
            } catch (error) {
                console.error("Erro ao buscar advogados:", error)
                toast({
                    title: "Erro de conexão",
                    description: "Não foi possível carregar a lista de advogados.",
                    variant: "destructive"
                })
                setAllLawyers([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchLawyers()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl">
                
                <div className="mb-10 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Encontre seu Especialista</h1>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Conecte-se com advogados previdenciários cadastrados na JuryScan.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou número OAB..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:bg-white transition-colors"
                        />
                    </div>
                    {!isLoading && allLawyers.length > 0 && (
                        <p className="text-xs text-gray-500 mt-3 pl-1">
                            Mostrando <span className="font-bold text-gray-700">{filteredLawyers.length}</span> de <span className="font-bold text-gray-700">{allLawyers.length}</span> advogado(s)
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Carregando lista de advogados...</p>
                    </div>
                ) : filteredLawyers.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {allLawyers.length === 0 ? "Nenhum advogado encontrado" : "Nenhum resultado para sua busca"}
                        </h3>
                        <p className="text-gray-500">
                            {allLawyers.length === 0 
                                ? "Não há advogados cadastrados no sistema." 
                                : "Tente ajustar sua busca ou termos de pesquisa."}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLawyers.map((lawyer) => (
                            <div key={lawyer.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
                                    <div className="mb-4">
                                        <AvatarWithInitial
                                            name={lawyer.nomeCompleto}
                                            photoUrl={lawyer.fotoUrl}
                                            size="md"
                                            borderColor="border-[#FFECF1]"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{lawyer.nomeCompleto}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{lawyer.numeroOab}</p>
                                    {lawyer.emailVerificado && (
                                        <div className="mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            E-mail Verificado
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-grow flex flex-col gap-4">
                                    {lawyer.descricao && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Sobre</p>
                                            <p className="text-sm text-gray-700">{lawyer.descricao}</p>
                                        </div>
                                    )}
                                    
                                    {lawyer.experiencia && (
                                        <div className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Experiência</p>
                                                <p className="text-sm text-gray-800 font-medium">{lawyer.experiencia}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-[#633B48] flex-shrink-0" />
                                            <a href={`tel:${lawyer.telefone}`} className="text-[#633B48] font-medium hover:underline">
                                                {lawyer.telefone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-[#633B48] flex-shrink-0" />
                                            <a href={`mailto:${lawyer.email}`} className="text-[#633B48] font-medium hover:underline truncate">
                                                {lawyer.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <Link href={`/cliente/advogados/${lawyer.id}${analysisId ? `?analysisId=${analysisId}` : ""}`} className="w-full py-3 bg-white border-2 border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white rounded-xl font-bold flex items-center justify-center transition-colors group">
                                        Ver Perfil
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 bg-[#0A1F30] rounded-2xl p-8 text-center border border-[#14324a]">
                    <ShieldCheck className="w-12 h-12 text-[#FFB6E1] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Contratação 100% Segura</h4>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        A JuryScan retém o pagamento até que o advogado inicie o seu atendimento. Seus dados e seu dinheiro estão protegidos pela nossa plataforma.
                    </p>
                </div>

            </div>
        </div>
    )
}
