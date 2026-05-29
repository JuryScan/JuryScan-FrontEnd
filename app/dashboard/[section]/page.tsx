import React from 'react'

interface SectionMeta {
  title: string
  description: string
}

const sectionMeta: Record<string, SectionMeta> = {
  clientes: {
    title: 'Clientes',
    description: 'Gerencie sua carteira de clientes e acompanhe solicitações em andamento.',
  },
  'analisar-cnis': {
    title: 'Analisar CNIS',
    description: 'Envie arquivos CNIS para validação e análise de conformidade.',
  },
  financeiro: {
    title: 'Financeiro',
    description: 'Veja saldos, transações e relatórios financeiros.',
  },
  configuracoes: {
    title: 'Configurações',
    description: 'Ajuste preferências de conta, notificações e acesso.',
  },
}

interface SectionPageProps {
  params: {
    section: string
  }
}

export default function SectionPage({ params }: SectionPageProps) {
  const section = sectionMeta[params.section]

  if (!section) {
    return (
      <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A seção solicitada não está disponível. Use o menu lateral para retornar ao dashboard.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{section.title}</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">{section.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{section.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Conteúdo da seção</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta é a área de conteúdo para a seção {section.title}. Aqui você pode adicionar painéis, listas e ações específicas da página.
          </p>
        </article>
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Navegação fluida</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A navegação entre as rotas do dashboard preserva o shell e evita recarregamento completo da interface.
          </p>
        </article>
      </div>
    </section>
  )
}
