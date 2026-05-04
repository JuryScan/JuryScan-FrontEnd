"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Shield, FileSearch, FileText, Scale, BrainCircuit,
    ArrowRight, Check, Star, Lock
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ServicesPage() {
    const router = useRouter()

    const services = [
        {
            icon: Shield,
            title: "Auditor CNIS",
            description: "Nossa IA analisa o extrato previdenciário em segundos, identificando vínculos extemporâneos e falhas.",
            link: "/auditor",
            active: true
        },
        {
            icon: FileSearch,
            title: "Análise de Processos",
            description: "Leitura automática de peças processuais com extração de dados relevantes para agilizar a triagem.",
            link: "#",
            active: false
        },
        {
            icon: BrainCircuit,
            title: "JuryScan IA",
            description: "Assistente virtual jurídico treinado para responder dúvidas sobre jurisprudência.",
            link: "#",
            active: false
        },
        {
            icon: FileText,
            title: "Gestão Documental",
            description: "Organize, classifique e armazene documentos dos seus clientes de forma segura na nuvem.",
            link: "#",
            active: false
        },
        {
            icon: Scale,
            title: "Consultoria Jurídica",
            description: "Conecte-se com especialistas parceiros para resolver casos complexos.",
            link: "#",
            active: false
        }
    ]

    const plans = [
        {
            name: "Cidadão Básico",
            price: "R$ 0,00",
            period: "/sempre",
            description: "Descubra se existem pendências no seu INSS.",
            target: "Curiosos e Iniciantes",
            features: ["Upload do CNIS", "Contagem de falhas", "Visualização resumida"],
            cta: "Verificar Grátis",
            highlight: false,
            isFree: true
        },
        {
            name: "Segurado Protegido",
            price: "R$ 19,90",
            period: "/mês",
            description: "Diagnóstico completo e suporte.",
            target: "Segurados",
            features: ["Análise completa", "Relatório detalhado"],
            cta: "Quero me Proteger",
            highlight: false,
            isFree: false
        },
        {
            name: "Advogado Expert",
            price: "R$ 89,90",
            period: "/mês",
            description: "Produtividade máxima.",
            target: "Advogados",
            features: ["50 análises", "Relatório PDF"],
            cta: "Assinar Agora",
            highlight: true,
            isFree: false
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <Header />

            <main className="flex-grow">

                <section className="py-20 px-4 text-center">
                    <h1 className="text-4xl font-bold">Planos</h1>
                </section>

                <section className="py-10 px-4">
                    <div className="max-w-6xl mx-auto flex gap-6 flex-wrap justify-center">

                        {plans.map((plan, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow w-[300px]">

                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <p className="text-xl">{plan.price}</p>

                                <Button
                                    onClick={() => {
                                        if (plan.isFree) {
                                            router.push("/auditor")
                                        } else {
                                            router.push(`/checkout?plan=${plan.name}&price=${plan.price}`)
                                        }
                                    }}
                                    className="w-full mt-4"
                                >
                                    {plan.cta}
                                </Button>

                            </div>
                        ))}

                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}