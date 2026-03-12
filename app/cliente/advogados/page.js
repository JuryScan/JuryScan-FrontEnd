"use client"

import { useState } from "react"
import { Search, MapPin, Star, Award, ShieldCheck, ArrowRight, Filter } from "lucide-react"

// Dados falsos para simular os advogados cadastrados na plataforma
const MOCK_LAWYERS = [
    {
        id: 1,
        name: "Dra. Ana Clara Fontes",
        oab: "OAB/PE 45.892",
        specialty: "Aposentadoria Especial & Revisões",
        location: "Recife, PE (Atende Online)",
        rating: 4.9,
        reviews: 128,
        image: "https://i.pravatar.cc/150?img=47",
        verified: true,
    },
    {
        id: 2,
        name: "Dr. Roberto Medeiros",
        oab: "OAB/SP 112.450",
        specialty: "Benefícios Assistenciais (BPC/LOAS)",
        location: "São Paulo, SP (Atende Online)",
        rating: 4.8,
        reviews: 94,
        image: "https://i.pravatar.cc/150?img=11",
        verified: true,
    },
    {
        id: 3,
        name: "Dra. Patrícia Silveira",
        oab: "OAB/RJ 88.310",
        specialty: "Cálculos Previdenciários & CNIS",
        location: "Rio de Janeiro, RJ",
        rating: 5.0,
        reviews: 215,
        image: "https://i.pravatar.cc/150?img=32",
        verified: true,
    }
]

export default function MarketplaceAdvogados() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl">
                
                {/* CABEÇALHO */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Encontre seu Especialista</h1>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Conecte-se com advogados previdenciários validados pela JuryScan para resolver suas pendências no INSS.
                    </p>
                </div>

                {/* BARRA DE BUSCA E FILTROS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
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
                    <button className="w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                        <Filter className="w-5 h-5" /> Filtros
                    </button>
                </div>

                {/* LISTA DE ADVOGADOS */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_LAWYERS.map((lawyer) => (
                        <div key={lawyer.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            
                            {/* Card Header (Foto e Nome) */}
                            <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
                                {lawyer.verified && (
                                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-1.5 rounded-full tooltip" title="Identidade Validada">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                )}
                                <img 
                                    src={lawyer.image} 
                                    alt={lawyer.name} 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-[#FFECF1] mb-4"
                                />
                                <h3 className="text-lg font-bold text-gray-900">{lawyer.name}</h3>
                                <p className="text-sm text-gray-500 font-medium">{lawyer.oab}</p>
                                
                                <div className="flex items-center gap-1 mt-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-yellow-700">{lawyer.rating}</span>
                                    <span className="text-xs text-yellow-600">({lawyer.reviews} avaliações)</span>
                                </div>
                            </div>

                            {/* Card Body (Informações) */}
                            <div className="p-6 flex-grow flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Especialidade</p>
                                        <p className="text-sm text-gray-800 font-medium">{lawyer.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Localização</p>
                                        <p className="text-sm text-gray-800 font-medium">{lawyer.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer (Botão de Ação) */}
                            <div className="p-6 pt-0 mt-auto">
                                <button className="w-full py-3 bg-white border-2 border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white rounded-xl font-bold flex items-center justify-center transition-colors group">
                                    Ver Perfil
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BANNER INFERIOR - SEGURANÇA */}
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