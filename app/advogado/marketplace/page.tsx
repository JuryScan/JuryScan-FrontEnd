"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, MapPin, AlertTriangle, UserPlus, CheckCircle2 } from "lucide-react"

// Simulação de dados baseada nas necessidades de auditoria de CNIS do JuryScan
const MOCK_OPORTUNIDADES = [
  {
    id: "lead-1",
    name: "Carlos Alberto Silva",
    city: "Recife",
    state: "PE",
    createdAt: "Há 12 min",
    type: "platform_lead",
    inconsistencies: [
      "Indicador ACI_REG sem data de encerramento",
      "Recolhimento abaixo do salário mínimo (Competência 2024)",
      "Vínculos concomitantes pendentes de unificação"
    ],
    description: "Possui 15 anos de contribuição em regime CLT, mas identificou que três contratos antigos não constam no extrato do CNIS extraído do Meu INSS."
  },
  {
    id: "lead-2",
    name: "Mariana Souza Santos",
    city: "Olinda",
    state: "PE",
    createdAt: "Há 2 horas",
    type: "platform_lead",
    inconsistencies: [
      "Período especial (Insalubridade) sem conversão",
      "Divergência de NIT/CPF no cadastro do Extrato Previdenciário"
    ],
    description: "Enfermeira buscando realizar a conversão de tempo especial para comum para fins de aposentadoria por tempo de contribuição."
  },
  {
    id: "client-1",
    name: "Roberto de Oliveira",
    city: "Jaboatão dos Guararapes",
    state: "PE",
    createdAt: "Ativo",
    type: "office_client",
    inconsistencies: [
      "Contribuição facultativa pendente de validação pela agência"
    ],
    description: "Processo de planejamento previdenciário e auditoria de vínculos já iniciado pelo escritório."
  }
]

export default function MarketplaceLeadsPage() {
  const [oportunidades, setOportunidades] = useState(MOCK_OPORTUNIDADES)
  const [leadsAceitos, setLeadsAceitos] = useState<string[]>([])

  const handleCapturarLead = (id: string) => {
    // Integração futura: chamada para API ou Server Action para vincular o lead ao ID do advogado
    setLeadsAceitos((prev) => [...prev, id])
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Marketplace de Leads
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitore novos potenciais clientes na sua região com pré-auditorias automatizadas de CNIS realizadas pelo JuryScan.
        </p>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
          <TabsList>
            <TabsTrigger value="todas">Todas as Oportunidades</TabsTrigger>
            <TabsTrigger value="novos">Novos Leads</TabsTrigger>
            <TabsTrigger value="meus">Meus Clientes</TabsTrigger>
          </TabsList>
          
          <Badge variant="outline" className="w-fit px-3 py-1 bg-white dark:bg-slate-950">
            {oportunidades.filter(o => o.type === "platform_lead" && !leadsAceitos.includes(o.id)).length} Disponíveis na Região
          </Badge>
        </div>

        {["todas", "novos", "meus"].map((aba) => {
          // Filtragem de acordo com a aba selecionada
          const listaFiltrada = oportunidades.filter((item) => {
            if (aba === "novos") return item.type === "platform_lead"
            if (aba === "meus") return item.type === "office_client"
            return true
          })

          return (
            <TabsContent key={aba} value={aba} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 outline-none">
              {listaFiltrada.map((item) => {
                const foiAceito = leadsAceitos.includes(item.id)
                const ehDoEscritorio = item.type === "office_client"

                return (
                  <Card key={item.id} className={`flex flex-col justify-between transition-all ${
                    ehDoEscritorio 
                      ? "border-blue-200 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/5" 
                      : "border-slate-200 dark:border-slate-800"
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {item.city}, {item.state}
                          </CardDescription>
                        </div>
                        <Badge variant={ehDoEscritorio ? "secondary" : "default"} className="text-xs font-medium whitespace-nowrap">
                          {ehDoEscritorio ? "Do Meu Escritório" : "Lead Disponível"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-grow">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Box com o resumo gerado pelo motor de IA do JuryScan */}
                      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5">
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                          Auditoria CNIS Prvia ({item.inconsistencies.length})
                        </h4>
                        <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-2 list-disc pl-4">
                          {item.inconsistencies.map((inc, i) => (
                            <li key={i} className="leading-snug">{inc}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span>{item.createdAt}</span>
                      
                      {ehDoEscritorio ? (
                        <Button size="sm" variant="outline" className="gap-1.5 font-medium">
                          <Briefcase className="h-4 w-4" /> Ver Histórico
                        </Button>
                      ) : foiAceito ? (
                        <Button size="sm" disabled className="bg-emerald-600 hover:bg-emerald-600 disabled:opacity-100 text-white gap-1.5 font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Lead Capturado
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleCapturarLead(item.id)} className="gap-1.5 font-medium">
                          <UserPlus className="h-4 w-4" /> Capturar Lead
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}