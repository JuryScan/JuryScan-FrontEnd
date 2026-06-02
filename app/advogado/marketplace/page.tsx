"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, UserPlus, CheckCircle2, FileText, Loader2, Coins, Briefcase, User } from "lucide-react"
import { get, post } from "@/lib/api"
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

// Modal "Ver Histórico": busca os detalhes do lead (cliente + análise/CNIS analisado).
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
          <Briefcase className="h-4 w-4" /> Ver Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Histórico de Análises — {details?.nomeCompleto || lead.nomeCliente || "Cliente"}</DialogTitle>
          <DialogDescription>CNIS analisado automaticamente pela IA do JuryScan.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#633B48]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFECF1] text-[#A50064]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {details?.analise?.titulo || lead.tituloAnalise || "Análise de CNIS"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {details?.email || ""}
                    {details?.telefone ? ` · ${details.telefone}` : ""}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Concluída
              </Badge>
            </div>

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
              <p className="text-sm text-slate-500">Sem detalhes de análise disponíveis para este lead.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function MarketplaceLeadsPage() {
  const [available, setAvailable] = useState<Lead[]>([])
  const [acquired, setAcquired] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [acquiringId, setAcquiringId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const [av, acq] = await Promise.all([
        get<ApiResponse<PageResponse<Lead>>>(`/leads/available?page=0&page_size=50`).catch(() => null),
        get<ApiResponse<PageResponse<Lead>>>(`/leads/acquired?page=0&page_size=50`).catch(() => null),
      ])
      setAvailable(av?.success && av.data?.items ? av.data.items : [])
      setAcquired(acq?.success && acq.data?.items ? acq.data.items : [])
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
      const res = await post<ApiResponse<any>>(`/leads/${id}/acquire`)
      if (res?.success) {
        toast({ title: "Lead adquirido!", description: "O lead foi movido para 'Meus Leads'." })
        await fetchLeads()
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message || "Não foi possível adquirir o lead.", variant: "destructive" })
    } finally {
      setAcquiringId(null)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Marketplace de Leads</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture potenciais clientes da sua região com pré-análises automatizadas de CNIS realizadas pelo JuryScan.
        </p>
      </div>

      <Tabs defaultValue="disponiveis" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
          <TabsList>
            <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
            <TabsTrigger value="meus">Meus Leads</TabsTrigger>
          </TabsList>

          <Badge variant="outline" className="w-fit px-3 py-1 bg-white dark:bg-slate-950">
            {available.length} Disponíveis
          </Badge>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Carregando leads...</p>
          </div>
        ) : (
          <>
            <TabsContent value="disponiveis" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 outline-none">
              {available.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum lead disponível na sua região no momento.</p>
                </div>
              ) : (
                available.map((lead) => (
                  <Card key={lead.id} className="flex flex-col justify-between border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                            {lead.nomeCliente || "Cliente"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            {lead.tituloAnalise || "Análise de CNIS"}
                          </CardDescription>
                        </div>
                        <Badge variant="default" className="text-xs font-medium whitespace-nowrap">Lead Disponível</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5 flex items-center gap-2 text-sm text-amber-900 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                        Pré-análise de CNIS gerada pelo JuryScan disponível.
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5" /> {lead.custoCreditos ?? 1} crédito(s)
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAcquire(lead.id)}
                        disabled={acquiringId === lead.id}
                        className="gap-1.5 font-medium"
                      >
                        {acquiringId === lead.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                        Capturar Lead
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="meus" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 outline-none">
              {acquired.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Você ainda não capturou nenhum lead.</p>
                </div>
              ) : (
                acquired.map((lead) => (
                  <Card key={lead.id} className="flex flex-col justify-between border-blue-200 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                            {lead.nomeCliente || "Cliente"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            {lead.tituloAnalise || "Análise de CNIS"}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
                          {lead.status || "Capturado"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow text-sm text-slate-600 dark:text-slate-300">
                      Capturado em {formatDate(lead.dataCriacao) || "—"}.
                    </CardContent>

                    <CardFooter className="border-t pt-4 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-end">
                      <LeadHistoryDialog lead={lead} />
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
