"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, FileText, MessageSquare, TrendingUp, Plus, ArrowRight, Search, Clock, CheckCircle2 } from "lucide-react"

const DASHBOARD_STATS = {
    activeClients: 42,
    newLeads: 5,
    analysesThisMonth: 18,
    conversionRate: "68%"
}

const RECENT_LEADS = [
    { id: 1, name: "Carlos Silva", status: "Novo", date: "Hoje, 09:30", message: "Gostaria de ajuda com as pendências do meu INSS..." },
    { id: 2, name: "Maria Oliveira", status: "Em negociação", date: "Ontem, 14:15", message: "Podemos agendar uma consulta para ver meu tempo especial?" },
    { id: 3, name: "João Mendonça", status: "Novo", date: "Ontem, 10:05", message: "Tenho vínculos que não constam no sistema." }
]

const RECENT_ANALYSES = [
    { id: 101, client: "Ana Beatriz", date: "12/03/2026", issues: 4, status: "Revisão" },
    { id: 102, client: "Fernando Costa", date: "10/03/2026", issues: 1, status: "Concluído" },
    { id: 103, client: "Roberto Almeida", date: "08/03/2026", issues: 3, status: "Aguardando Doc" },
]

export default function AdvogadoDashboardPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            {/* HEADER INTERNO DO ADVOGADO */}
            <div className="bg-[#0A1F30] text-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
                            <p className="text-gray-400">Bem-vindo de volta, Dr(a). Ana Clara. Aqui está o resumo do seu escritório hoje.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/advogado/auditoria">
                                <button className="bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">
                                    <Plus className="w-5 h-5" />
                                    Nova Auditoria CNIS
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
                

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Clientes Ativos</p>
                            <h3 className="text-2xl font-bold text-gray-900">{DASHBOARD_STATS.activeClients}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFECF1] text-[#A50064] rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Novos Leads (Marketplace)</p>
                            <h3 className="text-2xl font-bold text-gray-900">{DASHBOARD_STATS.newLeads}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Análises no Mês</p>
                            <h3 className="text-2xl font-bold text-gray-900">{DASHBOARD_STATS.analysesThisMonth}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Taxa de Conversão</p>
                            <h3 className="text-2xl font-bold text-gray-900">{DASHBOARD_STATS.conversionRate}</h3>
                        </div>
                    </div>
                </div>

                {/* DUAS COLUNAS PRINCIPAIS */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    
                    {/* COLUNA 1: NOVOS LEADS (Caixa de Entrada do Marketplace) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#633B48]" />
                                Solicitações de Atendimento
                            </h2>
                            <button className="text-sm text-[#633B48] font-bold hover:underline">Ver todos</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {RECENT_LEADS.map(lead => (
                                <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{lead.name}</h4>
                                            {lead.status === "Novo" && (
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Novo</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {lead.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 truncate">{lead.message}</p>
                                    <button className="text-sm font-bold text-[#633B48] flex items-center group-hover:underline">
                                        Responder <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#633B48]" />
                                Auditorias Recentes
                            </h2>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar cliente..." 
                                    className="pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#633B48]"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {RECENT_ANALYSES.map(analysis => (
                                <div key={analysis.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                            {analysis.client.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{analysis.client}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <span>Data: {analysis.date}</span>
                                                <span>•</span>
                                                <span className="text-orange-600 font-medium">{analysis.issues} pendências</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Link href="/advogado/auditoria">
                                        <button className="p-2 text-gray-400 hover:text-[#633B48] hover:bg-[#FFECF1] rounded-lg transition-colors tooltip" title="Abrir Relatório">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                            <button className="text-sm text-gray-600 font-medium hover:text-[#633B48]">Ver histórico completo</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}