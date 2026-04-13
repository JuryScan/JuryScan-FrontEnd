"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CnisUpload from "@/components/CnisUpload"
import AnalysisResult from "@/components/AnalysisResult"
import { jsPDF } from "jspdf"

const MOCK_DATA = {
    status: "warning",
    summary: { clientName: "JOAO DA SILVA TESTE", totalIssues: 3, processedAt: "09/12/2025 14:30" },
    issues: [
        {
            id: 1, severity: "warning",
            title: "Vínculo Extemporâneo Detectado",
            description: "O vínculo 'EMPRESA MODELO A' (Seq 01) apresenta o indicador PEXT. Este período pode não contar para aposentadoria sem prova documental.",
            recommendation: "Solicitar Carteira de Trabalho (CTPS) ou Ficha de Registro."
        },
        {
            id: 2, severity: "info",
            title: "Vínculo em Aberto",
            description: "O vínculo 'COMERCIO FALHO LTDA' (Seq 02) iniciou em 01/03/2020 e não possui data fim registrada.",
            recommendation: "Verificar se o contrato está ativo ou se é necessário acerto de vínculo com a rescisão."
        },
        {
            id: 3, severity: "critical",
            title: "Contribuição Abaixo do Mínimo",
            description: "No vínculo 'CONSULTORIA X' (Seq 03), as competências 02/2023 e 04/2023 estão abaixo do salário mínimo (Indicador PREC-MENOR-MIN).",
            recommendation: "Estes meses não contam para carência/tempo. Necessário complementação via DAS."
        }
    ]
}

const SEVERITY_LABEL = { critical: "Crítico", warning: "Atenção", info: "Informativo" }

const SEVERITY_PDF = {
    critical: { text: [185, 28, 28],  bar: [220, 38, 38]  },
    warning:  { text: [180, 83, 9],   bar: [217, 119, 6]  },
    info:     { text: [7, 89, 133],   bar: [8, 145, 178]  },
}

const slugify = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")

const buildHTML = (result) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<title>Relatório CNIS — ${result.summary.clientName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'IBM Plex Sans',sans-serif;background:#f1f5f9;color:#1e293b;padding:40px 20px}
  .wrap{max-width:860px;margin:0 auto;background:#fff;border-radius:16px;padding:48px;box-shadow:0 4px 24px rgba(0,0,0,.06)}
  .top{display:flex;justify-content:space-between;border-bottom:2px solid #1e3a8a;padding-bottom:24px;margin-bottom:36px}
  .brand{font-size:22px;font-weight:600;color:#1e3a8a} .brand small{display:block;font-size:13px;font-weight:400;color:#64748b}
  .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:40px}
  .meta label{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px}
  .meta span{font-size:15px;font-weight:500}
  h2{font-size:13px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:20px}
  .issue{border-radius:10px;padding:24px;margin-bottom:20px;border:1px solid #e2e8f0;border-left:4px solid}
  .issue.critical{border-left-color:#dc2626} .issue.warning{border-left-color:#d97706} .issue.info{border-left-color:#0891b2}
  .head{display:flex;justify-content:space-between;margin-bottom:16px}
  .title{font-size:16px;font-weight:600;color:#0f172a}
  .badge{font-size:11px;font-weight:600;padding:4px 12px;border-radius:9999px;margin-left:12px}
  .badge.critical{background:#fee2e2;color:#991b1b} .badge.warning{background:#fef3c7;color:#92400e} .badge.info{background:#e0f2fe;color:#075985}
  .lbl{font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
  p{font-size:14px;line-height:1.7;color:#334155}
  hr{border:none;border-top:1px solid #f1f5f9;margin:16px 0}
  footer{margin-top:48px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
</style></head><body><div class="wrap">
  <div class="top">
    <div class="brand">JuryyScan<small>Auditoria Previdenciária</small></div>
    <div style="text-align:right;font-size:12px;color:#64748b">Relatório de Análise de CNIS<br>Emitido em ${new Date().toLocaleString("pt-BR")}</div>
  </div>
  <div class="meta">
    <div><label>Cliente</label><span>${result.summary.clientName}</span></div>
    <div><label>Processado em</label><span>${result.summary.processedAt}</span></div>
    <div><label>Pendências</label><span>${result.summary.totalIssues} problemas</span></div>
  </div>
  <h2>Problemas identificados</h2>
  ${result.issues.map((issue, i) => `
  <div class="issue ${issue.severity}">
    <div class="head"><div class="title">${i + 1}. ${issue.title}</div>
    <span class="badge ${issue.severity}">${SEVERITY_LABEL[issue.severity]}</span></div>
    <div class="lbl">Explicação para o cliente</div><p>${issue.description}</p><hr>
    <div class="lbl">Recomendação técnica</div><p>${issue.recommendation}</p>
  </div>`).join("")}
  <footer>Gerado pelo JuryyScan • ${new Date().toLocaleString("pt-BR")}</footer>
</div></body></html>`

const buildPDF = (result) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const m = 18
    const usable = W - m * 2
    let y = 20

    const addPage = (needed = 20) => {
        if (y + needed > H - 18) { doc.addPage(); y = 20 }
    }

    const txt = (text, size, style, color) => {
        doc.setFontSize(size)
        doc.setFont("helvetica", style || "normal")
        if (color) doc.setTextColor(color[0], color[1], color[2])
    }

    doc.setFillColor(30, 58, 138)
    doc.rect(0, 0, W, 28, "F")
    txt("", 16, "bold", [255, 255, 255])
    doc.text("JuryyScan", m, 13)
    txt("", 10, "normal")
    doc.text("Auditoria Previdenciária — Relatório de Análise de CNIS", m, 21)
    y = 38

    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(m, y, usable, 26, 3, 3, "FD")
    const third = usable / 3
    txt("", 9, "bold", [148, 163, 184])
    doc.text("CLIENTE", m + 6, y + 7)
    doc.text("PROCESSADO EM", m + third + 6, y + 7)
    doc.text("PENDÊNCIAS", m + third * 2 + 6, y + 7)
    txt("", 11, "bold", [15, 23, 42])
    doc.text(doc.splitTextToSize(result.summary.clientName, third - 8)[0], m + 6, y + 17)
    doc.text(result.summary.processedAt, m + third + 6, y + 17)
    doc.text(`${result.summary.totalIssues} problemas`, m + third * 2 + 6, y + 17)
    y += 34

    txt("", 9, "bold", [71, 85, 105])
    doc.text("PROBLEMAS IDENTIFICADOS", m, y)
    y += 10

    result.issues.forEach((issue, i) => {
        const s = SEVERITY_PDF[issue.severity] || SEVERITY_PDF.info
        addPage(60)
        const startY = y

        txt("", 12, "bold", [15, 23, 42])
        const titleLines = doc.splitTextToSize(`${i + 1}. ${issue.title}`, usable - 42)
        addPage(titleLines.length * 6 + 4)
        doc.text(titleLines, m + 6, y)

        txt("", 9, "bold", s.text)
        doc.text(SEVERITY_LABEL[issue.severity].toUpperCase(), W - m - 2, y, { align: "right" })
        y += titleLines.length * 5.5 + 8

        txt("", 8, "bold", [100, 116, 139])
        doc.text("PARA O CLIENTE", m + 6, y)
        y += 5

        txt("", 10, "normal", [51, 65, 85])
        const descLines = doc.splitTextToSize(issue.description, usable - 12)
        addPage(descLines.length * 5 + 12)
        doc.text(descLines, m + 6, y)
        y += descLines.length * 4.6 + 8

        doc.setDrawColor(226, 232, 240)
        doc.line(m + 6, y - 2, W - m, y - 2)

        txt("", 8, "bold", [100, 116, 139])
        doc.text("RECOMENDAÇÃO TÉCNICA", m + 6, y + 4)
        y += 9

        txt("", 10, "normal", [51, 65, 85])
        const recLines = doc.splitTextToSize(issue.recommendation, usable - 12)
        addPage(recLines.length * 5 + 16)
        doc.text(recLines, m + 6, y)
        y += recLines.length * 4.6 + 16

        const cardH = y - startY - 8
        doc.setFillColor(s.bar[0], s.bar[1], s.bar[2])
        doc.rect(m, startY - 2, 3, cardH, "F")
        doc.setFillColor(248, 250, 252)
        doc.setDrawColor(226, 232, 240)
        doc.roundedRect(m, startY - 2, usable, cardH, 2, 2, "D")
    })

    const total = doc.internal.getNumberOfPages()
    for (let p = 1; p <= total; p++) {
        doc.setPage(p)
        doc.setFillColor(248, 250, 252)
        doc.rect(0, H - 14, W, 14, "F")
        doc.setDrawColor(226, 232, 240)
        doc.line(0, H - 14, W, H - 14)
        txt("", 9, "normal", [148, 163, 184])
        doc.text(`Página ${p} de ${total}  •  JuryyScan  •  Gerado em ${new Date().toLocaleDateString("pt-BR")}`, W / 2, H - 5, { align: "center" })
    }

    return doc
}

const download = (blob, filename) => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}

export default function AuditorPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleAnalyze = (file) => {
        if (!file) return
        setIsLoading(true)
        setResult(null)
        setTimeout(() => { setIsLoading(false); setResult(MOCK_DATA) }, 2000)
    }

    const exportHTML = () => {
        if (!result) return
        download(new Blob([buildHTML(result)], { type: "text/html;charset=utf-8" }), `relatorio-cnis-${slugify(result.summary.clientName)}.html`)
        showToast("HTML exportado!")
    }

    const exportPDF = () => {
        if (!result) return
        try {
            buildPDF(result).save(`relatorio-cnis-${slugify(result.summary.clientName)}.pdf`)
            showToast("PDF gerado!")
        } catch (err) {
            console.error(err)
            showToast("Erro ao gerar PDF.", "error")
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <CnisUpload onAnalyze={handleAnalyze} />
                        <AnalysisResult result={result} loading={isLoading} />
                    </div>

                    {result && (
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={exportHTML} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                </svg>
                                Exportar HTML
                            </button>
                            <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Baixar PDF
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {toast && (
                <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#dc2626" : "#1e3a8a", color: "white", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                    {toast.msg}
                </div>
            )}
        </div>
    )
}