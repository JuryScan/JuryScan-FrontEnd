/**
 * Dados mock centralizados para desenvolvimento.
 * Facilita a substituição gradual por dados reais da API.
 */

import type { AnalysisResult, Testimonial } from "@/lib/types"

// ============================================================
// Análise CNIS
// ============================================================

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  status: "warning",
  summary: {
    clientName: "JOAO DA SILVA TESTE",
    totalIssues: 3,
    processedAt: new Date().toLocaleString("pt-BR"),
  },
  issues: [
    {
      id: "1",
      type: "extemporaneo",
      severity: "warning",
      title: "Vínculo Extemporâneo Detectado (PEXT)",
      description:
        "O vínculo 'EMPRESA MODELO A' (Seq 01) apresenta o indicador PEXT. Este período não conta para aposentadoria sem prova documental contemporânea.",
      recommendation:
        "Solicitar CTPS original, Ficha de Registro de Empregados ou extrato analítico do FGTS para comprovação do vínculo.",
    },
    {
      id: "2",
      type: "open_date",
      severity: "info",
      title: "Vínculo em Aberto",
      description:
        "O vínculo 'COMERCIO FALHO LTDA' (Seq 02) iniciou em 01/03/2020 e não possui data fim (ou indicador de encerramento) registrada.",
      recommendation:
        "Realizar acerto de vínculo (Atualização de Vínculos e Remunerações) com apresentação do termo de rescisão.",
    },
    {
      id: "3",
      type: "below_min",
      severity: "critical",
      title: "Contribuição Abaixo do Mínimo (PREC-MENOR-MIN)",
      description:
        "No vínculo 'CONSULTORIA X' (Seq 03), as competências 02/2023 e 04/2023 estão com recolhimento inferior ao limite mínimo legal.",
      recommendation:
        "Emitir DARF para complementação do valor (Art. 19-E do RPS) ou agrupar competências para aproveitamento do tempo de contribuição.",
    },
  ],
}

// ============================================================
// Depoimentos
// ============================================================

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marcos Martins",
    role: "Advogado",
    rating: 5,
    image: "/marcos.jpg",
    text: "A plataforma revolucionou minha prática jurídica. Consigo acompanhar processos de forma muito mais eficiente.",
  },
  {
    id: "2",
    name: "Ana Silva",
    role: "Advogada",
    rating: 5,
    image: "/ana.jpg",
    text: "Excelente ferramenta para análise de processos do INSS. Recomendo para todos os colegas advogados.",
  },
  {
    id: "3",
    name: "Carlos Santos",
    role: "Advogado",
    rating: 5,
    image: "/carlos.jpg",
    text: "Interface intuitiva e resultados precisos. Economizei muito tempo nos meus processos.",
  },
  {
    id: 4,
    name: "Julia Oliveira",
    role: "Advogada",
    rating: 5,
    image: "/julia.jpg",
    text: "Ferramenta indispensável para quem trabalha com direito previdenciário. Muito satisfeita!",
  },
  {
    id: 5,
    name: "Roberto Lima",
    role: "Advogado",
    rating: 5,
    image: "/roberto.jpg",
    text: "Suporte excelente e plataforma muito completa. Recomendo fortemente!",
  },
  {
    id: 6,
    name: "Patricia Costa",
    role: "Advogada",
    rating: 5,
    image: "/patricia.jpg",
    text: "Melhor investimento que fiz para meu escritório. Resultados impressionantes!",
  },
]
