"use client"

import { useState } from "react"
import { Upload, FileText, RefreshCw, AlertCircle } from "lucide-react"

const MOCK_ANALYSIS_RESULT = {
    status: "warning",
    summary: {
        clientName: "JOAO DA SILVA TESTE",
        totalIssues: 3,
        processedAt: new Date().toLocaleString('pt-BR')
    },
    issues: [
        {
            id: 1,
            type: "extemporaneo",
            severity: "warning",
            title: "Vínculo Extemporâneo Detectado (PEXT)",
            description: "O vínculo 'EMPRESA MODELO A' (Seq 01) apresenta o indicador PEXT. Este período não conta para aposentadoria sem prova documental contemporânea.",
            recommendation: "Solicitar CTPS original, Ficha de Registro de Empregados ou extrato analítico do FGTS para comprovação do vínculo."
        },
        {
            id: 2,
            type: "open_date",
            severity: "info",
            title: "Vínculo em Aberto",
            description: "O vínculo 'COMERCIO FALHO LTDA' (Seq 02) iniciou em 01/03/2020 e não possui data fim (ou indicador de encerramento) registrada.",
            recommendation: "Realizar acerto de vínculo (Atualização de Vínculos e Remunerações) com apresentação do termo de rescisão."
        },
        {
            id: 3,
            type: "below_min",
            severity: "critical",
            title: "Contribuição Abaixo do Mínimo (PREC-MENOR-MIN)",
            description: "No vínculo 'CONSULTORIA X' (Seq 03), as competências 02/2023 e 04/2023 estão com recolhimento inferior ao limite mínimo legal.",
            recommendation: "Emitir DARF para complementação do valor (Art. 19-E do RPS) ou agrupar competências para aproveitamento do tempo de contribuição."
        }
    ]
}

export default function CnisUpload({ onAnalyze }) {
    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) setFile(selectedFile)
    }

    const handleAnalyzeClick = () => {
        if (file) onAnalyze(MOCK_ANALYSIS_RESULT)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">
            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFECF1] flex items-center justify-center">
                    <FileText className="text-[#633B48] w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#0A1F30]">Upload CNIS</h2>
                    <p className="text-sm text-gray-500">Envie o PDF original do Meu INSS</p>
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-center">
                {!file ? (
                    <div className="border-2 border-dashed border-[#633B48]/30 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-[#FFECF1]/50 transition-colors cursor-pointer relative h-full min-h-[300px]">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-12 h-12 text-[#633B48] mb-4 opacity-80" />
                        <p className="text-lg font-bold text-[#0A1F30] mb-2">Selecione o arquivo PDF</p>
                        <p className="text-sm text-gray-500">Apenas arquivos .pdf são suportados</p>
                    </div>
                ) : (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-8 text-center h-full min-h-[300px] flex flex-col justify-center items-center">
                        <FileText className="w-16 h-16 text-green-500 mb-4" />
                        <p className="font-bold text-[#0A1F30] text-lg mb-1 break-all">{file.name}</p>
                        <span className="text-sm text-green-700 flex items-center gap-1 mt-2 mb-6 bg-white px-3 py-1 rounded-full border border-green-200 shadow-sm">
                            <AlertCircle size={14} /> Arquivo carregado
                        </span>
                        
                        <button 
                            onClick={() => setFile(null)}
                            className="px-4 py-2 flex items-center gap-2 rounded-md text-gray-500 border border-gray-300 hover:bg-white transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Trocar arquivo
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                    className="w-full bg-[#633B48] hover:bg-[#300117] text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleAnalyzeClick}
                    disabled={!file}
                >
                    Executar Auditoria IA
                </button>
            </div>
        </div>
    )
}