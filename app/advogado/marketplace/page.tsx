"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, MapPin, AlertTriangle, UserPlus, CheckCircle2 } from "lucide-react"

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
  const router = useRouter()
  const [oportunidades] = useState(MOCK_OPORTUNIDADES)
  const [leadsAceitos, setLeadsAceitos] = useState<string[]>([])

  const handleCapturarLead = (id: string) => {
    setLeadsAceitos((prev) => [...prev, id])
  }

  const handleDesfazerCaptura = (id: string) => {
    setLeadsAceitos((prev) => prev.filter((leadId) => leadId !== id))
  }

  const handleVerHistorico = () => {
    router.push("/advogado/historico")
  }

  const renderCards = (listaFiltrada: typeof MOCK_OPORTUNIDADES) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" style={{ alignItems: "stretch" }}>
      {listaFiltrada.map((item) => {
        const foiAceito = leadsAceitos.includes(item.id)
        const ehDoEscritorio = item.type === "office_client"

        return (
          <div key={item.id} className="flex">
            <Card className="w-full flex flex-col border-gray-200 bg-white hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold tracking-tight text-[#0A1F30]">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs text-[#633B48]">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.city}, {item.state}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`text-xs font-medium whitespace-nowrap text-white ${
                      ehDoEscritorio ? "bg-[#633B48]" : "bg-green-600"
                    }`}
                  >
                    {ehDoEscritorio ? "Do Meu Escritório" : "Disponível"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow">
                <p className="text-sm leading-relaxed text-[#0A1F30]">
                  {item.description}
                </p>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Auditoria CNIS Prévia ({item.inconsistencies.length})
                  </h4>
                  <ul className="text-xs text-amber-900 space-y-2 list-disc pl-4">
                    {item.inconsistencies.map((inc, i) => (
                      <li key={i} className="leading-snug">{inc}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-4 bg-white flex items-center justify-between text-xs text-[#633B48] rounded-b-lg border-t mt-auto">
                {ehDoEscritorio ? (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Ativo
                  </span>
                ) : (
                  <span>{item.createdAt}</span>
                )}

                {ehDoEscritorio ? (
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleVerHistorico}
                    className="w-[180px] justify-center gap-1.5 font-medium bg-transparent text-[#633B48] border-2 border-[#633B48] hover:bg-[#633B48] hover:text-white transition-colors duration-300"
                  >
                    <Briefcase className="h-4 w-4 shrink-0" />
                    Ver Histórico
                  </Button>
                ) : foiAceito ? (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => handleDesfazerCaptura(item.id)}
                    className="w-[180px] justify-center gap-1.5 font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Lead Capturado
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => handleCapturarLead(item.id)}
                    className="w-[180px] justify-center gap-1.5 font-medium text-white bg-[#633B48] hover:bg-[#4A2C38] transition-colors duration-300 hover:scale-[1.02]"
                  >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    Capturar Lead
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#162D3F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace de Leads</h1>
          <p className="text-gray-400">Monitore novos potenciais clientes na sua região com pré-auditorias automatizadas de CNIS realizadas pelo JuryScan.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="todas" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
            <TabsList>
              <TabsTrigger value="todas">Todas as Oportunidades</TabsTrigger>
              <TabsTrigger value="novos">Novos Leads</TabsTrigger>
              <TabsTrigger value="meus">Meus Clientes</TabsTrigger>
            </TabsList>

            <Badge variant="outline" className="w-fit px-3 py-1 bg-white text-[#633B48] border-[#633B48] font-medium">
              {oportunidades.filter(o => o.type === "platform_lead" && !leadsAceitos.includes(o.id)).length} Disponíveis na Região
            </Badge>
          </div>

          <TabsContent value="todas" className="outline-none">
            {renderCards(oportunidades)}
          </TabsContent>

          <TabsContent value="novos" className="outline-none">
            {renderCards(oportunidades.filter(o => o.type === "platform_lead"))}
          </TabsContent>

          <TabsContent value="meus" className="outline-none">
            {renderCards(oportunidades.filter(o => o.type === "office_client"))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}