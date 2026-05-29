"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ShieldAlert, 
  UserMinus, 
  UserCheck, 
  ChevronRight, 
  Mail, 
  CreditCard,
  Loader2,
  Filter
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, patch, post } from "@/lib/api"
import type { ApiResponse, User } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function UserManagementPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

  // 1. Guarda de Rotas (RBAC)
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.tipoUsuario !== "ADMIN")) {
      router.push("/login")
    } else if (!authLoading) {
      fetchUsers()
    }
  }, [currentUser, authLoading, router])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API - No futuro substituir por GET /admin/users
      const response = await get<ApiResponse<User[]>>("/users")
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast({ title: "Erro", description: "Falha ao carregar lista de usuários.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Ação de Banir/Desativar
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "ATIVO" ? "BLOQUEADO" : "ATIVO"
    setIsActionLoading(user.id ?? null)
    
    try {
      // Endpoint sugerido: PATCH /admin/users/{id}/status
      const response = await patch<ApiResponse<any>>(`/users/${user.id}`, { status: newStatus })
      
      if (response.success) {
        toast({ 
          title: "Status Atualizado", 
          description: `Usuário ${user.nomeCompleto} está agora ${newStatus}.` 
        })
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao atualizar status.", variant: "destructive" })
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleUpdatePlan = (user: User) => {
    toast({ title: "Ação de Plano", description: `Abrir modal para alterar plano de ${user.nomeCompleto}` })
  }

  const filteredUsers = users.filter(u => 
    u.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.cpf && u.cpf.includes(searchTerm))
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
          <h1 className="text-3xl font-bold text-[#0A1F30]">Gerenciamento de Usuários</h1>
          <p className="text-gray-500">Administre contas, altere planos e monitore o status dos membros.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg border border-orange-200 flex items-center gap-2 text-sm font-bold">
                <ShieldAlert className="size-4" />
                Painel Administrativo
            </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, e-mail ou CPF..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#633B48] transition-all"
          />
        </div>
        <Button variant="outline" className="rounded-xl flex gap-2 h-auto py-3">
          <Filter className="size-4" /> Filtros Avançados
        </Button>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                    Nenhum usuário encontrado para esta busca.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-[#633B48] font-bold">
                          {u.nomeCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.nomeCompleto}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="size-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.tipoUsuario === "ADVOGADO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {u.tipoUsuario}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        u.status === "ATIVO" ? "text-green-600" : "text-red-500"
                      }`}>
                        <div className={`size-1.5 rounded-full ${u.status === "ATIVO" ? "bg-green-600" : "bg-red-500"}`} />
                        {u.status || "ATIVO"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleUpdatePlan(u)}
                          variant="ghost" 
                          size="sm"
                          className="text-[#633B48] hover:bg-[#FFECF1] font-bold"
                          title="Alterar Plano"
                        >
                          <CreditCard className="size-4" />
                        </Button>
                        <Button 
                          onClick={() => handleToggleStatus(u)}
                          disabled={isActionLoading === u.id}
                          variant="ghost" 
                          size="sm"
                          className={`${u.status === "ATIVO" ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"} font-bold`}
                          title={u.status === "ATIVO" ? "Banir/Desativar" : "Reativar Conta"}
                        >
                          {isActionLoading === u.id ? <Loader2 className="size-4 animate-spin" /> : (u.status === "ATIVO" ? <UserMinus className="size-4" /> : <UserCheck className="size-4" />)}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
