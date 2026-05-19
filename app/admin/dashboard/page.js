"use client"

import { useState } from "react"
import {
    Users, Upload, DollarSign, TrendingUp,
    ShieldCheck, ArrowUpRight, ArrowDownRight,
    UserCheck, BarChart3, Clock
} from "lucide-react"
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

const UPLOADS_DATA = [
    { mes: "Jan", uploads: 120 }, { mes: "Fev", uploads: 185 },
    { mes: "Mar", uploads: 210 }, { mes: "Abr", uploads: 175 },
    { mes: "Mai", uploads: 290 }, { mes: "Jun", uploads: 340 },
    { mes: "Jul", uploads: 410 }, { mes: "Ago", uploads: 390 },
    { mes: "Set", uploads: 480 }, { mes: "Out", uploads: 520 },
    { mes: "Nov", uploads: 610 }, { mes: "Dez", uploads: 700 },
]

const FATURAMENTO_DATA = [
    { mes: "Jan", valor: 4200  }, { mes: "Fev", valor: 6800  },
    { mes: "Mar", valor: 7500  }, { mes: "Abr", valor: 5900  },
    { mes: "Mai", valor: 9200  }, { mes: "Jun", valor: 11400 },
    { mes: "Jul", valor: 13200 }, { mes: "Ago", valor: 12800 },
    { mes: "Set", valor: 15600 }, { mes: "Out", valor: 17900 },
    { mes: "Nov", valor: 21200 }, { mes: "Dez", valor: 24500 },
]

const USUARIOS_PIE = [
    { name: "Advogados",       value: 648  },
    { name: "Cidadaos (Leigos)", value: 1204 },
    { name: "Escritorios",     value: 87   },
]

const PIE_COLORS = ["#633B48", "#C4899A", "#F2C4CE"]

const ATIVIDADE_RECENTE = [
    { id: 1, user: "Dra. Mariana Costa",    action: "Assinou plano Expert",       time: "ha 3 min",  type: "success" },
    { id: 2, user: "Joao Silva",            action: "Upload de CNIS realizado",   time: "ha 7 min",  type: "info"    },
    { id: 3, user: "Adv. Carlos Mendes",    action: "Cancelou assinatura",        time: "ha 12 min", type: "error"   },
    { id: 4, user: "Ana Beatriz",           action: "Novo cadastro realizado",    time: "ha 18 min", type: "success" },
    { id: 5, user: "Escritorio Lopes Cia",  action: "Assinou plano Visionario",   time: "ha 25 min", type: "success" },
    { id: 6, user: "Pedro Alves",           action: "Falha no pagamento",         time: "ha 31 min", type: "error"   },
]

const KPIS = [
    { icon: Users,      bg: "bg-blue-50",   color: "text-blue-600",  label: "Usuarios Ativos", value: "1.939",     change: "+12,4%", up: true  },
    { icon: DollarSign, bg: "bg-[#FFECF1]", color: "text-[#633B48]", label: "Faturamento",     value: "R$ 24.500", change: "+15,6%", up: true  },
    { icon: Upload,     bg: "bg-purple-50", color: "text-purple-600",label: "Uploads no Mes",  value: "700",       change: "+14,7%", up: true  },
    { icon: TrendingUp, bg: "bg-green-50",  color: "text-green-600", label: "Conversao",       value: "34,2%",     change: "-2,1%",  up: false },
]

function CustomTooltip({ active, payload, label, prefix }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
                <p className="font-semibold text-gray-700 mb-1">{label}</p>
                <p className="text-[#633B48] font-bold">{prefix}{payload[0].value.toLocaleString("pt-BR")}</p>
            </div>
        )
    }
    return null
}

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("uploads")

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl">

                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-[#FFECF1] text-[#633B48] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Acesso Restrito - Perfil ADMIN
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Geral do Sistema</h1>
                    <p className="text-gray-600 text-lg">Monitore a saude do negocio em tempo real.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {KPIS.map((kpi, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                            <div className={"w-10 h-10 " + kpi.bg + " " + kpi.color + " rounded-xl flex items-center justify-center mb-3"}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <p className="text-xs text-gray-500 font-medium mb-1">{kpi.label}</p>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{kpi.value}</h3>
                            <span className={"text-xs font-semibold flex items-center gap-0.5 mt-1 " + (kpi.up ? "text-green-600" : "text-red-500")}>
                                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.change}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#633B48]" />
                                Evolucao Anual
                            </h2>
                            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                                <button onClick={() => setActiveTab("uploads")} className={"px-3 py-1.5 text-xs font-semibold rounded-lg transition-all " + (activeTab === "uploads" ? "bg-white text-[#633B48] shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                                    Uploads
                                </button>
                                <button onClick={() => setActiveTab("faturamento")} className={"px-3 py-1.5 text-xs font-semibold rounded-lg transition-all " + (activeTab === "faturamento" ? "bg-white text-[#633B48] shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                                    Faturamento
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            {activeTab === "uploads" ? (
                                <BarChart data={UPLOADS_DATA} barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip prefix="" />} cursor={{ fill: "#f9f0f2" }} />
                                    <Bar dataKey="uploads" fill="#633B48" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            ) : (
                                <LineChart data={FATURAMENTO_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "R$" + (v / 1000).toFixed(0) + "k"} />
                                    <Tooltip content={<CustomTooltip prefix="R$ " />} />
                                    <Line type="monotone" dataKey="valor" stroke="#633B48" strokeWidth={2.5} dot={{ r: 4, fill: "#633B48", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <UserCheck className="w-5 h-5 text-[#633B48]" />
                            Usuarios por Perfil
                        </h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={USUARIOS_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                    {USUARIOS_PIE.map((_, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={v => v.toLocaleString("pt-BR")} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3 mt-4">
                            {USUARIOS_PIE.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                                        <span className="text-sm text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{item.value.toLocaleString("pt-BR")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#633B48]" />
                            Atividade Recente
                        </h2>
                        <button className="text-sm text-[#633B48] font-bold hover:underline">Ver logs completos</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {ATIVIDADE_RECENTE.map(item => (
                            <div key={item.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className={"w-2.5 h-2.5 rounded-full flex-shrink-0 " + (item.type === "success" ? "bg-green-500" : item.type === "error" ? "bg-red-400" : "bg-blue-400")} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-bold text-gray-900">{item.user}</span>
                                    <span className="text-sm text-gray-400 ml-2">{item.action}</span>
                                </div>
                                <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                                    <Clock className="w-3 h-3" /> {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}