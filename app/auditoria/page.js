"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CnisUpload from "@/components/CnisUpload"
import AnalysisResult from "@/components/AnalysisResult"
import { Shield } from "lucide-react"

const MOCK_DATA = {
    status: "warning",
    summary: {
        clientName: "JOAO DA SILVA TESTE",
        totalIssues: 3,
        processedAt: "09/12/2025 14:30"
    },
    issues: [
        {
            id: 1,
            type: "extemporaneo",
            severity: "warning",
            title: "Vínculo Extemporâneo Detectado",
            description: "O vínculo 'EMPRESA MODELO A' (Seq 01) apresenta o indicador PEXT. Este período pode não contar para aposentadoria sem prova documental.",
            recommendation: "Solicitar Carteira de Trabalho (CTPS) ou Ficha de Registro."
        },
        {
            id: 2,
            type: "open_date",
            severity: "info",
            title: "Vínculo em Aberto",
            description: "O vínculo 'COMERCIO FALHO LTDA' (Seq 02) iniciou em 01/03/2020 e não possui data fim registrada.",
            recommendation: "Verificar se o contrato está ativo ou se é necessário acerto de vínculo com a rescisão."
        },
        {
            id: 3,
            type: "below_min",
            severity: "critical",
            title: "Contribuição Abaixo do Mínimo",
            description: "No vínculo 'CONSULTORIA X' (Seq 03), as competências 02/2023 e 04/2023 estão abaixo do salário mínimo (Indicador PREC-MENOR-MIN).",
            recommendation: "Estes meses não contam para carência/tempo. Necessário complementação via DAS."
        }
    ]
}

export default function AuditorPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)

    const handleAnalyze = async (file) => {
        if (!file) return

        setIsLoading(true)
        setAnalysisResult(null)

        setTimeout(() => {
            setIsLoading(false)
            setAnalysisResult(MOCK_DATA)
        }, 2000)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow py-8 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <div className="h-full">
                            <CnisUpload onAnalyze={handleAnalyze} />
                        </div>

                        <div className="h-full">
                            <AnalysisResult result={analysisResult} loading={isLoading} />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}