"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Star, ShieldCheck, MapPin, Briefcase, MessageCircle, CheckCircle2, Clock, Scale } from "lucide-react"

const LAWYER_DETAILS = {
    id: 1,
    name: "Dra. Ana Clara Fontes",
    oab: "OAB/PE 45.892",
    specialty: "Aposentadoria Especial & Revisões",
    location: "Recife, PE (Atende Online para todo o Brasil)",
    rating: 4.9,
    reviews: 128,
    image: "https://i.pravatar.cc/150?img=47",
    verified: true,
    experience: "8 anos",
    about: 'Especialista em Direito Previdenciário com foco em aposentadorias complexas, revisões de benefícios e auxílios negados pelo INSS. Minha missão é traduzir o "juridiquês" e lutar para que você receba cada centavo que é seu por direito, com total transparência.',
    services: [
        "Planejamento Previdenciário",
        "Aposentadoria por Tempo de Contribuição",
        "Aposentadoria Especial (Médicos, Enfermeiros, etc)",
        "Revisão da Vida Toda",
        "Auxílio-Doença e BPC/LOAS"
    ]
}

export default function PerfilAdvogadoPage() {
    const router = useRouter()

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
                                    src={LAWYER_DETAILS.image} 
                                    alt={LAWYER_DETAILS.name} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md z-10"
                                />
                                <div className="z-10 mt-2 sm:mt-4">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{LAWYER_DETAILS.name}</h1>
                                        {LAWYER_DETAILS.verified && (
                                            <ShieldCheck className="w-6 h-6 text-green-500 tooltip" title="Identidade Validada" />
                                        )}
                                    </div>
                                    <p className="text-[#633B48] font-semibold mb-3">{LAWYER_DETAILS.oab}</p>
                                    
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-yellow-700">{LAWYER_DETAILS.rating}</span>
                                            <span className="text-yellow-600">({LAWYER_DETAILS.reviews} avaliações)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {LAWYER_DETAILS.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#633B48]" />
                                Sobre a Profissional
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {LAWYER_DETAILS.about}
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-[#633B48]" />
                                Especialidades
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {LAWYER_DETAILS.services.map((service, index) => (
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
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Gostou da profissional?</h3>
                                <p className="text-sm text-gray-500">Envie uma mensagem e anexe seu relatório do INSS gratuitamente.</p>
                            </div>

                            <button className="w-full py-4 bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-md mb-4">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Solicitar Atendimento
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
                                <Clock className="w-4 h-4" />
                                Tempo de resposta: aprox. 2 horas
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Cliente" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="flex text-yellow-500">
                                            <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                                        </div>
                                        <p className="text-xs text-gray-500 italic">"Muito atenciosa e resolveu meu benefício rápido!"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}