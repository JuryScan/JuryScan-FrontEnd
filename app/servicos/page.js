"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Shield, FileSearch, Calculator, FileText, Scale, BrainCircuit,
    ArrowRight, Check, Star, Lock
} from "lucide-react"

export default function ServicesPage() {

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
            description: "Descubra se existem pendências no seu INSS, mas sem detalhes técnicos.",
            target: "Curiosos e Iniciantes",
            features: [
                "Upload do CNIS",
                "Contagem de falhas encontradas",
                "Visualização resumida",
                "Sem relatório detalhado",
                "Sem acesso a advogados"
            ],
            cta: "Verificar Grátis",
            highlight: false,
            isFree: true
        },
        {
            name: "Advogado Starter",
            price: "R$ 0,00",
            period: "/mês",
            description: "Teste a potência da nossa IA antes de assinar.",
            target: "Advogados em Teste",
            features: [
                "Até 2 Análises por mês",
                "Visualização apenas em tela",
                "Identificação de vínculos",
                "Sem exportação em PDF",
                "Sem cálculos de RMI"
            ],
            cta: "Testar Ferramenta",
            highlight: false,
            isFree: true
        },
        {
            name: "Segurado Protegido",
            price: "R$ 19,90",
            period: "/mês",
            description: "Diagnóstico completo, explicação simples e conexão com advogados.",
            target: "Segurados Preocupados",
            features: [
                "Análise Profunda do CNIS",
                "Relatório 'Traduzido para Leigos'",
                "Explicação detalhada de cada erro",
                "Botão 'Contratar Advogado'",
                "Suporte via Chat"
            ],
            cta: "Quero me Proteger",
            highlight: false,
            isFree: false
        },
        {
            name: "Advogado Expert",
            price: "R$ 89,90",
            period: "/mês",
            description: "Produtividade máxima: elimine erros manuais e gere petições em segundos.",
            target: "Advogados Autônomos",
            features: [
                "50 Análises completas/mês",
                "Relatório Técnico em PDF",
                "Cálculo automático de tempo/RMI",
                "Detecção de indicadores complexos",
                "Suporte Prioritário"
            ],
            cta: "Assinar Agora",
            highlight: true,
            isFree: false
        },
        {
            name: "Escritório Visionário",
            price: "R$ 249,90",
            period: "/mês",
            description: "Gestão de equipe e recebimento de clientes prontos para fechar contrato.",
            target: "Bancas de Advocacia",
            features: [
                "Tudo do plano Expert",
                "Múltiplos usuários (até 5)",
                "Recebimento de Leads Qualificados",
                "Gestão de carteira de clientes",
                "Integração via API"
            ],
            cta: "Falar com Consultor",
            highlight: false,
            isFree: false
        },
        {
            name: "Plano Personalizado",
            price: "R$ xxx",
            period: "/mês",
            description: "Gestão de equipe e recebimento de clientes prontos para fechar contrato.",
            target: "Bancas de Advocacia",
            features: [
                "Tudo da forma que você escolher",
                "O plano perfeito para a sua empresa",
                "Da forma que ela merece"
            ],
            cta: "Falar com Consultor",
            highlight: false,
            isFree: false
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

            <Header />

            <main className="flex-grow">

                <section id="servicos" className="bg-white py-20 px-4 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            Tecnologia que impulsiona sua <span className="text-[#633B48]">Advocacia</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Ferramentas inteligentes para cidadãos e advogados. Escolha o perfil ideal para você.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Nossas Ferramentas</h2>
                            <p className="text-gray-500 mt-2">Soluções modulares para cada etapa do seu trabalho</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group"
                                >
                                    <div className="mb-6 bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-[#FFECF1] transition-colors">
                                        <service.icon className="w-10 h-10 text-[#633B48]" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#633B48] transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {service.description}
                                    </p>

                                    {service.active ? (
                                        <Link href={service.link}>
                                            <Button variant="outline" className="w-full border-[#633B48] text-[#633B48] hover:bg-[#633B48] hover:text-white group">
                                                Acessar Ferramenta <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="w-full bg-gray-100 text-gray-400 border-0">
                                            Em Breve
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-10 px-4 bg-[#633B48]/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#633B48]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#633B48]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-[1400px] mx-auto relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Planos que se adaptam a você</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Do teste grátis à gestão completa de escritório. Transparência total.
                            </p>
                        </div>

                        <div className="flex flex-nowrap overflow-x-auto xl:flex-wrap xl:justify-center gap-6 py-12 px-4 snap-x snap-mandatory scroll-smooth scrollbar-hide items-start">

                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`
                      snap-center flex-shrink-0 w-[300px] md:w-[320px] flex flex-col
                      rounded-2xl p-6 border transition-all duration-300 relative
                      ${plan.highlight
                                        ? 'bg-white border-[#633B48] shadow-2xl xl:scale-105 z-10'
                                        : 'bg-white/90 border-gray-200 hover:shadow-lg xl:mt-4'
                                    }
                      ${plan.isFree ? 'bg-gray-50/80 border-gray-200' : ''}
                    `}
                                >
                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#633B48] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md whitespace-nowrap z-20">
                                            <Star size={14} fill="white" /> Recomendado
                                        </div>
                                    )}

                                    {plan.isFree && (
                                        <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                            GRÁTIS
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${plan.isFree ? 'text-gray-500' : 'text-[#633B48]'}`}>
                            {plan.price}
                        </span>
                                            <span className="text-gray-400 text-xs">{plan.period}</span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 inline-block border border-gray-200">
                        {plan.target}
                      </span>
                                        <p className="text-gray-500 text-sm mt-3 leading-snug min-h-[40px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="flex-grow space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => {
                                            const isLimitation = feature.startsWith("Sem") || feature.startsWith("Visualização apenas");

                                            return (
                                                <div key={idx} className="flex items-start gap-2.5">
                                                    <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${isLimitation ? 'bg-gray-100' : 'bg-green-100'}`}>
                                                        {isLimitation ? (
                                                            <Lock className="w-3 h-3 text-gray-400" />
                                                        ) : (
                                                            <Check className="w-3 h-3 text-green-700" />
                                                        )}
                                                    </div>
                                                    <span className={`text-sm leading-snug ${isLimitation ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                                    {feature}
                                </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <Button
                                        className={`w-full py-5 text-base transition-transform active:scale-95 ${
                                            plan.highlight
                                                ? 'bg-[#633B48] hover:bg-[#300117] text-white shadow-lg'
                                                : plan.isFree
                                                    ? 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    : 'bg-white border-2 border-[#633B48] text-[#633B48] hover:bg-[#FFECF1]'
                                        }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </div>
                            ))}

                        </div>

                        <div className="xl:hidden text-center text-xs text-gray-400 mt-2 animate-pulse">
                            &larr; Deslize para ver todas as opções &rarr;
                        </div>
                    </div>
                </section>

                <section className="bg-[#1e293b] py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center text-white space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ainda com dúvidas sobre qual plano escolher?
                        </h2>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            Nossa equipe de especialistas está pronta para analisar o perfil do seu escritório e sugerir a melhor configuração.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/contato">
                                <Button className="bg-white text-[#1e293b] hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                                    Falar com Consultor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}