"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, MapPin, FileText, Star, Loader2, ShieldCheck } from "lucide-react"
import { get } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"

export default function BuscadorClientesPage() {
    const router = useRouter()
    const [clientes, setClientes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await get<ApiResponse<any[]>>("/users/clientes")
                if (res.success) {
                    setClientes(res.data)
                }
            } catch (error) {
                console.error("Erro ao buscar clientes:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchClientes()
    }, [])

    const clientesFiltrados = clientes.filter((c) =>
        c.nomeCompleto?.toLowerCase().includes(search.toLowerCase()) ||
        c.descricao?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans">

            {/* Title */}
            <div className="max-w-5xl mx-auto px-6 mt-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Encontre seu Cliente</h1>
                    <p className="text-gray-600">Conecte-se com clientes que precisam de assistência previdenciária.</p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex gap-4 mb-6">
                    <div className="flex items-center flex-1 gap-3 bg-gray-50 rounded-xl px-4 border border-gray-200">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou necessidade..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 py-3 bg-transparent outline-none text-gray-700 text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                </div>

                {/* Lista de clientes */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="size-10 animate-spin text-[#633B48]" />
                    </div>
                ) : clientesFiltrados.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum cliente encontrado</h3>
                        <p className="text-gray-500 text-sm">Tente ajustar seus filtros ou termos de busca.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {clientesFiltrados.map((cliente) => (
                            <div
                                key={cliente.id}
                                onClick={() => router.push(`/advogado/buscador/${cliente.id}`)}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-start hover:border-[#633B48] hover:shadow-md transition-all cursor-pointer"
                            >
                                <img
                                    src={cliente.fotoUrl || "https://via.placeholder.com/80"}
                                    alt={cliente.nomeCompleto}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{cliente.nomeCompleto}</h3>
                                        {cliente.verificado && (
                                            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                        {cliente.descricao || "Cliente buscando assistência previdenciária."}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {cliente.localizacao || "Localização não informada"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            {cliente.relatorio ? "Relatório CNIS disponível" : "Sem relatório"}
                                        </div>
                                    </div>
                                </div>
                                <button className="flex-shrink-0 px-5 py-2 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-sm transition-all">
                                    Ver Perfil
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Banner segurança */}
                <div className="bg-[#0A1F30] rounded-2xl shadow-sm border border-[#14324a] p-8 text-white text-center mt-8">
                    <ShieldCheck className="w-10 h-10 text-[#FFB6E1] mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">Contratação 100% Segura</h3>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                        A JuryScan retém o pagamento até que o atendimento seja iniciado. Seus dados e os do cliente estão protegidos pela nossa plataforma.
                    </p>
                </div>
            </div>
        </div>
    )
}
