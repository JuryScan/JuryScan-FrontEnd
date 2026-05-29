"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Award, ShieldCheck, ArrowRight, Filter, Loader2, MapPinned } from "lucide-react"
import { get } from "@/lib/api"
import type { Lawyer, ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function MarketplaceAdvogados() {
    const [lawyers, setLawyers] = useState<Lawyer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
    
    // Estados dos Filtros
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        cidade: "",
        estado: "",
        disponibilidade: false
    })

    // 1. Captura de Geolocalização (RNF05)
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    console.error("Erro ao obter localização:", error)
                    toast({
                        title: "Localização não disponível",
                        description: "Usaremos a busca padrão sem considerar proximidade.",
                    })
                }
            )
        }
    }, [])

    // 2. Chamada de API Dinâmica
    const fetchLawyers = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (coords) {
                params.append("lat", coords.lat.toString())
                params.append("lng", coords.lng.toString())
            }
            if (searchTerm) params.append("busca", searchTerm)
            if (filters.cidade) params.append("cidade", filters.cidade)
            if (filters.estado) params.append("estado", filters.estado)
            if (filters.disponibilidade) params.append("disponibilidade", "true")

            const response = await get<ApiResponse<Lawyer[]>>(`/users/advogados?${params.toString()}`)
            if (response.success) {
                setLawyers(response.data)
            }
        } catch (error) {
            console.error("Erro ao buscar advogados:", error)
            toast({
                title: "Erro de conexão",
                description: "Não foi possível carregar a lista de advogados.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }, [coords, searchTerm, filters])

    // Dispara a busca quando filtros ou localização mudam
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLawyers()
        }, 500) // Debounce para busca por texto

        return () => clearTimeout(timer)
    }, [fetchLawyers])

    const toggleFilter = (name: keyof typeof filters) => {
        setFilters(prev => ({
            ...prev,
            [name]: name === "disponibilidade" ? !prev.disponibilidade : prev[name]
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl">
                
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Encontre seu Especialista</h1>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Conecte-se com advogados previdenciários validados pela JuryScan.
                        </p>
                    </div>
                    {coords && (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#A50064] bg-[#FFECF1] px-3 py-1.5 rounded-full border border-[#FFB6E1]">
                            <MapPinned className="w-4 h-4" />
                            Ordenando por Proximidade
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Buscar por nome ou especialidade..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:bg-white transition-colors"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 border rounded-xl font-medium transition-colors ${
                                showFilters ? "bg-[#633B48] text-white border-[#633B48]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Filter className="w-5 h-5" /> Filtros
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado</label>
                                <select 
                                    value={filters.estado}
                                    onChange={(e) => setFilters(f => ({ ...f, estado: e.target.value }))}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="MG">Minas Gerais</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cidade</label>
                                <input 
                                    type="text"
                                    placeholder="Ex: Recife"
                                    value={filters.cidade}
                                    onChange={(e) => setFilters(f => ({ ...f, cidade: e.target.value }))}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-3 md:pt-6">
                                <button 
                                    onClick={() => toggleFilter("disponibilidade")}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold border transition-colors ${
                                        filters.disponibilidade 
                                        ? "bg-green-100 text-green-700 border-green-200" 
                                        : "bg-gray-50 text-gray-500 border-gray-200"
                                    }`}
                                >
                                    Disponível Agora
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Buscando especialistas...</p>
                    </div>
                ) : lawyers.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum advogado encontrado</h3>
                        <p className="text-gray-500">Tente ajustar seus filtros ou termos de busca.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lawyers.map((lawyer) => (
                            <div key={lawyer.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
                                    {lawyer.verificado && (
                                        <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-1.5 rounded-full" title="Identidade Validada">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                    )}
                                    <img 
                                        src={lawyer.fotoUrl || "https://via.placeholder.com/150"} 
                                        alt={lawyer.nomeCompleto} 
                                        className="w-24 h-24 rounded-full object-cover border-4 border-[#FFECF1] mb-4"
                                    />
                                    <h3 className="text-lg font-bold text-gray-900">{lawyer.nomeCompleto}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{lawyer.numeroOab}</p>
                                    
                                    <div className="flex items-center gap-1 mt-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-bold text-yellow-700">{lawyer.rating}</span>
                                        <span className="text-xs text-yellow-600">({lawyer.reviews} avaliações)</span>
                                    </div>
                                    
                                    {lawyer.distancia && (
                                        <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Aprox. {lawyer.distancia.toFixed(1)}km de você
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex-grow flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <Award className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Especialidade</p>
                                            <p className="text-sm text-gray-800 font-medium">{lawyer.especialidade}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Localização</p>
                                            <p className="text-sm text-gray-800 font-medium">{lawyer.localizacao}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <Link href={`/cliente/advogados/${lawyer.id}`} className="w-full py-3 bg-white border-2 border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white rounded-xl font-bold flex items-center justify-center transition-colors group">
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
