"use client"

import { useState, type JSX } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  UserCheck,
  UserX
} from "lucide-react"
import { MOCK_RECENT_LEADS } from "@/lib/mocks"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

export default function ClientesLeadsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [leads, setLeads] = useState(MOCK_RECENT_LEADS)

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || lead.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    toast({
      title: "Status Atualizado",
      description: `O status do lead foi alterado para ${newStatus}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-green-100 text-green-700 border-green-200"
      case "Em negociação":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Aguardando":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F30] mb-2 flex items-center gap-3">
            <Users className="text-[#633B48]" />
            Gestão de Clientes & Leads
          </h1>
          <p className="text-gray-500">Acompanhe suas solicitações de atendimento e gerencie sua carteira.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#633B48] transition-all"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl flex items-center gap-2 border-gray-200">
                <Filter className="w-4 h-4" />
                {filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setFilterStatus("Todos")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Novo")}>Novos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Em negociação")}>Em negociação</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Não encontramos leads que correspondam aos seus filtros atuais.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FFECF1] rounded-2xl flex items-center justify-center text-[#A50064] text-2xl font-bold">
                    {lead.name.charAt(0)}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-[#0A1F30]">{lead.name}</h2>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recebido em {lead.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> email@exemplo.com
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> (81) 99999-9999
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        className="bg-[#633B48] hover:bg-[#300117] text-white rounded-xl font-bold gap-2 px-6"
                        onClick={() => toast({ title: "Em breve", description: "Chat direto será implementado em breve." })}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Responder
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-48">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(Number(lead.id), "Em negociação")}>
                            <Clock className="w-4 h-4 mr-2" /> Iniciar Atendimento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(Number(lead.id), "Concluído")} className="text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar como Fechado
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="w-4 h-4 mr-2" /> Recusar Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[#0A1F30] text-sm leading-relaxed italic">
                      "{lead.message}"
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600" title="CNIS Analisado">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600" title="Perfil Verificado">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <button className="text-sm font-bold text-[#633B48] flex items-center gap-1 hover:underline">
                      Ver histórico do cliente <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
