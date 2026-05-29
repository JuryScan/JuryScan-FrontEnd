"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ShieldAlert, 
  Loader2, 
  Filter,
  History,
  User as UserIcon,
  Activity,
  ArrowRight,
  Clock,
  ExternalLink
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface AuditLog {
    id: string
    userId: string
    userName: string
    userEmail: string
    acao: string
    recurso: string
    dataCriacao: string
    ip: string
}

// MOCK LOGS PARA RNF10
const MOCK_LOGS: AuditLog[] = [
    {
        id: "1",
        userId: "101",
        userName: "Dr. Marcos Martins",
        userEmail: "marcos@adv.com.br",
        acao: "LOGIN",
        recurso: "Sistema Autenticação",
        dataCriacao: new Date().toISOString(),
        ip: "189.12.45.10"
    },
    {
        id: "2",
        userId: "202",
        userName: "João da Silva",
        userEmail: "joao@gmail.com",
        acao: "UPLOAD_CNIS",
        recurso: "Auditor IA",
        dataCriacao: new Date(Date.now() - 3600000).toISOString(),
        ip: "200.150.22.8"
    },
    {
        id: "3",
        userId: "101",
        userName: "Dr. Marcos Martins",
        userEmail: "marcos@adv.com.br",
        acao: "EXPORT_PDF",
        recurso: "Relatório Técnico",
        dataCriacao: new Date(Date.now() - 7200000).toISOString(),
        ip: "189.12.45.10"
    }
]

export default function AuditLogsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || user.tipoUsuario !== "ADMIN")) {
      router.push("/login")
    } else if (!authLoading) {
      // Simulação de busca
      setTimeout(() => {
        setLogs(MOCK_LOGS)
        setIsLoading(false)
      }, 800)
    }
  }, [user, authLoading, router])

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#633B48]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F30]">Logs de Atividade</h1>
          <p className="text-gray-500">Monitoramento global de ações e segurança do sistema (RNF10).</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 flex items-center gap-2 text-sm font-bold">
            <Activity className="size-4" />
            Auditoria Ativa
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input 
            type="text" 
            placeholder="Filtrar por usuário, ação ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#633B48] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Evento / Usuário</th>
                <th className="px-6 py-4">Recurso</th>
                <th className="px-6 py-4">Data / Hora</th>
                <th className="px-6 py-4">IP Origem</th>
                <th className="px-6 py-4 text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${
                        log.acao === "LOGIN" ? "bg-green-100 text-green-700" :
                        log.acao === "UPLOAD_CNIS" ? "bg-blue-100 text-blue-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {log.acao}
                      </span>
                      <p className="font-bold text-gray-900 text-sm">{log.userName}</p>
                      <p className="text-[10px] text-gray-400">{log.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                    {log.recurso}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="size-3" />
                        {new Date(log.dataCriacao).toLocaleString("pt-BR")}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                    {log.ip}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-[#633B48]">
                        <ExternalLink className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
