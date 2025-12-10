"use client"

import { useState } from "react"
import { Upload, FileText, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_ANALYSIS_RESULT = {
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

export default function CnisUpload({ onAnalyze }) {
    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
    }

    const handleAnalyzeClick = () => {
        if (file) {
            // Envia o Mock direto para a página pai
            onAnalyze(MOCK_ANALYSIS_RESULT)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Upload PDF CNIS
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Envie o arquivo PDF do CNIS para extração automática e análise.
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {!file ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative flex-1 max-h-[400px]">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">Clique para selecionar o PDF</p>
                        <p className="text-sm text-gray-500 mt-2">Suporta apenas arquivos .PDF</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                        <div className="border border-green-200 bg-green-50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-100">
                                <FileText className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-lg break-all">{file.name}</span>
                            <span className="text-sm text-green-700 flex items-center gap-2 mt-3 bg-white px-3 py-1 rounded-full border border-green-200 shadow-sm">
                    <AlertCircle size={14} /> Arquivo pronto para análise
                </span>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Escolher outro arquivo
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
                <Button
                    className="w-full bg-[#334155] hover:bg-[#1e293b] text-white py-6 text-lg transition-all active:scale-[0.98]"
                    onClick={handleAnalyzeClick}
                    disabled={!file}
                >
                    <div className="flex items-center gap-3">
                        Analisar Documento
                    </div>
                </Button>
            </div>
        </div>
    )
}