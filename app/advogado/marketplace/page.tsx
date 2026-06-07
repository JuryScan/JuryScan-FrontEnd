"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertTriangle, UserPlus, CheckCircle2, FileText, Loader2, Coins, Briefcase, User, RefreshCw, Mail, Phone, Calendar, BadgeCheck } from "lucide-react"
import { get, post } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import type { ApiResponse, PageResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface Lead {
  id: string
  nomeCliente?: string
  tituloAnalise?: string
  status?: string
  custoCreditos?: number
  dataCriacao?: string
  analiseId?: string
}

function formatDate(value?: string): string {
  if (!value) return ""
  const d = new Date(value)
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR")
}

// Modal "Ver Detalhes do Lead": busca os detalhes do lead (cliente + análise/CNIS analisado).
function LeadHistoryDialog({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchDetails = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get<ApiResponse<any>>(`/leads/${lead.id}/details`)
      if (res?.success) setDetails(res.data)
    } catch (e) {
      console.error("Erro ao buscar detalhes do lead:", e)
    } finally {
      setLoading(false)
    }
  }, [lead.id])

  const formatCPF = (cpf?: string) => {
    if (!cpf) return ""
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return ""
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return phone
  }

  const formatDate = (date?: string) => {
    if (!date) return ""
    try {
      return new Date(date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })
    } catch {
      return ""
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v && !details) fetchDetails()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 font-medium">
          <Briefcase className="h-4 w-4" /> Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#A50064]" />
            Perfil do Cliente — {details?.nomeCompleto || lead.nomeCliente || "Cliente"}
          </DialogTitle>
          <DialogDescription>Informações de contato e análise do lead adquirido</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#633B48]" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Card de Contato Principal */}
            <div className="rounded-xl bg-gradient-to-br from-[#FFECF1] to-[#FFE4ED] border border-[#FFD6E6] p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                  {details?.fotoUrl ? (
                    <img 
                      src={details.fotoUrl} 
                      alt={details?.nomeCompleto} 
                      className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-[#A50064] flex items-center justify-center text-white font-bold text-2xl border-2 border-white shadow-md">
                      {details?.nomeCompleto?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <Badge variant="secondary" className="text-xs">Perfil</Badge>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#0A1F30]">{details?.nomeCompleto || "Cliente"}</h3>
                  <p className="text-sm text-gray-600">Dados de contato do cliente</p>
                </div>

                <Badge variant="default" className="gap-1 bg-[#A50064]">
                  <BadgeCheck className="h-3 w-3" /> Verificado
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Email */}
                {details?.email && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-2.5">
                    <Mail className="h-4 w-4 text-[#A50064] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{details.email}</p>
                    </div>
                  </div>
                )}

                {/* Telefone */}
                {details?.telefone && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-2.5">
                    <Phone className="h-4 w-4 text-[#A50064] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-900">{formatPhoneNumber(details.telefone)}</p>
                    </div>
                  </div>
                )}

                {/* CPF */}
                {details?.cpf && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-2.5">
                    <BadgeCheck className="h-4 w-4 text-[#A50064] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">CPF</p>
                      <p className="text-sm font-medium text-gray-900">{formatCPF(details.cpf)}</p>
                    </div>
                  </div>
                )}

                {/* Data de Nascimento */}
                {details?.dataNascimento && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-2.5">
                    <Calendar className="h-4 w-4 text-[#A50064] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Data de Nascimento</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(details.dataNascimento)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informações da Análise */}
            <div className="rounded-lg border p-3">
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                Análise de CNIS
              </h4>
              <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFECF1] text-[#A50064]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {details?.analise?.titulo || lead.tituloAnalise || "Análise de CNIS"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {details?.analise?.descricao ? details.analise.descricao.substring(0, 60) : "Análise realizada"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Concluída
                </Badge>
              </div>
            </div>

            {/* Inconsistências Encontradas */}
            {Array.isArray(details?.analise?.falhas) && details.analise.falhas.length > 0 ? (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  Inconsistências encontradas ({details.analise.falhas.length})
                </h4>
                <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-2 list-disc pl-4">
                  {details.analise.falhas.map((f: any, i: number) => (
                    <li key={f.id || i} className="leading-snug">{f.titulo || f.descricao}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sem inconsistências encontradas nesta análise.</p>
            )}

            {/* Informações Adicionais */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
              <div>
                <p className="text-gray-500 mb-1">Data de Criação do Lead</p>
                <p className="font-medium text-gray-900">{formatDate(lead.dataCriacao)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Custo do Lead</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Coins className="h-3 w-3" /> {lead.custoCreditos || 1} crédito(s)
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function MarketplaceLeadsPage() {
  const { user, isAuthenticated } = useAuth()
  const [available, setAvailable] = useState<Lead[]>([])
  const [acquired, setAcquired] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [acquiringId, setAcquiringId] = useState<string | null>(null)
  const [confirmingLeadId, setConfirmingLeadId] = useState<string | null>(null)

  useEffect(() => {
    console.log(`[Marketplace] Página carregada. Usuário:`, { 
      id: user?.id, 
      email: user?.email, 
      tipoUsuario: user?.tipoUsuario,
      isAuthenticated 
    })
  }, [user, isAuthenticated])

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      console.log(`[Marketplace] Carregando leads...`)
      
      const [av, acq] = await Promise.all([
        get<ApiResponse<PageResponse<Lead>>>(`/leads/available?page=0&page_size=50`)
          .catch((e) => {
            console.error(`[Marketplace] Erro ao carregar leads disponíveis:`, e)
            return null
          }),
        get<ApiResponse<PageResponse<Lead>>>(`/leads/acquired?page=0&page_size=50`)
          .catch((e) => {
            console.error(`[Marketplace] Erro ao carregar leads adquiridos:`, e)
            return null
          }),
      ])
      
      console.log(`[Marketplace] Leads disponíveis:`, av)
      console.log(`[Marketplace] Leads adquiridos:`, acq)
      
      setAvailable(av?.success && av.data?.items ? av.data.items : [])
      setAcquired(acq?.success && acq.data?.items ? acq.data.items : [])
      
      // Se ambas as requisições falharam, mostrar erro
      if (!av && !acq) {
        console.error(`[Marketplace] Não foi possível carregar os leads`)
        toast({ 
          title: "Erro ao carregar leads",
          description: "Não foi possível conectar ao servidor.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleAcquire = async (id: string) => {
    setAcquiringId(id)
    try {
      console.log(`[Marketplace] Iniciando captura de lead: ${id}`)
      
      const res = await post<ApiResponse<any>>(`/leads/${id}/acquire`)
      
      console.log(`[Marketplace] Resposta da API:`, res)
      
      // Verificar se a resposta foi bem-sucedida
      if (res?.success === true) {
        console.log(`[Marketplace] Lead adquirido com sucesso`)
        toast({ 
          title: "Lead adquirido com sucesso!", 
          description: "O lead foi movido para 'Meus Leads'. Você pode visualizar os dados do cliente em 'Ver Histórico'.",
          variant: "default"
        })
        // Aguardar um pouco antes de recarregar para garantir que o backend processou
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchLeads()
      } else if (res?.success === false) {
        console.warn(`[Marketplace] API retornou sucesso=false:`, res.message)
        toast({ 
          title: "Não foi possível adquirir o lead",
          description: res.message || "O servidor retornou um erro desconhecido.",
          variant: "destructive"
        })
      } else {
        console.warn(`[Marketplace] Resposta inesperada:`, res)
        toast({ 
          title: "Resposta inesperada do servidor",
          description: "Não foi possível confirmar a aquisição do lead.",
          variant: "destructive"
        })
      }
    } catch (e: any) {
      console.error(`[Marketplace] Erro ao adquirir lead:`, e)
      
      // Mapear erros comuns para mensagens amigáveis
      let title = "Erro ao capturar lead"
      let description = "Não foi possível adquirir o lead."
      
      if (e?.status === 401) {
        title = "Autenticação expirada"
        description = "Sua sessão expirou. Faça login novamente."
      } else if (e?.status === 403) {
        title = "Permissão negada"
        description = "Você não tem permissão para adquirir leads."
      } else if (e?.status === 402) {
        title = "Créditos insuficientes"
        description = "Você não possui créditos suficientes para adquirir este lead. Recarregue sua carteira e tente novamente."
      } else if (e?.status === 404) {
        title = "Lead não encontrado"
        description = "Este lead não existe mais ou já foi adquirido por outro advogado."
      } else if (e?.status === 409) {
        title = "Conflito"
        description = "Este lead já foi adquirido. Atualize a página para ver a lista atualizada."
      } else if (e?.status === 500) {
        title = "Erro no servidor"
        description = "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      } else if (e?.message) {
        description = e.message
      }
      
      toast({ 
        title,
        description,
        variant: "destructive"
      })
    } finally {
      setAcquiringId(null)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold text-[#0A1F30]">Marketplace de Leads</h1>
          <p className="text-gray-500">
            Capture potenciais clientes da sua região com pré-análises automatizadas de CNIS realizadas pelo JuryScan.
          </p>
        </div>

        <Tabs defaultValue="disponiveis" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
            <TabsList>
              <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
              <TabsTrigger value="meus">Meus Leads</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="w-fit px-3 py-1 bg-white">
                {available.length} Disponíveis
              </Badge>

              <button
                onClick={fetchLeads}
                disabled={isLoading}
                className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Atualizar
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Carregando leads...</p>
            </div>
          ) : (
            <>
              <TabsContent value="disponiveis" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 outline-none">
                {available.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-gray-400">
                    <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Nenhum lead disponível no momento.</p>
                  </div>
                ) : (
                  available.map((lead) => (
                    <Card key={lead.id} className="flex flex-col justify-between border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold tracking-tight text-gray-900">
                              {lead.nomeCliente || "Cliente"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              {lead.tituloAnalise || "Análise de CNIS"}
                            </CardDescription>
                        </div>
                        <Badge variant="default" className="text-xs font-medium whitespace-nowrap">Lead Disponível</Badge>
                      </div>
                    </CardHeader>

                      <CardContent className="flex-grow">
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex items-center gap-2 text-sm text-amber-900">
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          Pré-análise de CNIS gerada pelo JuryScan disponível.
                        </div>
                      </CardContent>

                      <CardFooter className="border-t pt-4 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5" /> {lead.custoCreditos ?? 1} crédito(s)
                        </span>
                      <Button
                        size="sm"
                        onClick={() => setConfirmingLeadId(lead.id)}
                        disabled={acquiringId === lead.id}
                        className="gap-1.5 font-medium"
                      >
                        {acquiringId === lead.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                        Adquirir Lead
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="meus" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 outline-none">
              {acquired.length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-400">
                  <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Você ainda não capturou nenhum lead.</p>
                </div>
              ) : (
                acquired.map((lead) => (
                  <Card key={lead.id} className="flex flex-col justify-between border-blue-200 bg-blue-50/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold tracking-tight text-gray-900">
                            {lead.nomeCliente || "Cliente"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                            {lead.tituloAnalise || "Análise de CNIS"}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
                          {lead.status || "Capturado"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow text-sm text-gray-600">
                      Capturado em {formatDate(lead.dataCriacao) || "—"}.
                    </CardContent>

                    <CardFooter className="border-t pt-4 bg-gray-50/50 flex items-center justify-end">
                      <LeadHistoryDialog lead={lead} />
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </>
        )}
        </Tabs>

        {/* Modal de Confirmação de Aquisição de Lead */}
        <AlertDialog open={confirmingLeadId !== null} onOpenChange={(open) => !open && setConfirmingLeadId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja adquirir este lead?</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmingLeadId && available.find(l => l.id === confirmingLeadId) && (
                  <>
                    Você está prestes a adquirir o lead de <strong>{available.find(l => l.id === confirmingLeadId)?.nomeCliente}</strong>, que custará <strong>{available.find(l => l.id === confirmingLeadId)?.custoCreditos ?? 1} crédito(s)</strong>.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (confirmingLeadId) {
                    await handleAcquire(confirmingLeadId)
                    setConfirmingLeadId(null)
                  }
                }}
              >
                Confirmar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
