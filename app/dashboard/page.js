export default function DashboardHomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Bem-vindo ao painel</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Visão Geral</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Use o menu lateral para navegar entre clientes, análise de CNIS, finanças e configurações sem perder o shell.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Navegação persistente</h2>
          <p className="mt-2 text-sm text-muted-foreground">O shell permanece ativo enquanto você muda de rota dentro do dashboard.</p>
        </article>
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Layout adaptável</h2>
          <p className="mt-2 text-sm text-muted-foreground">O dashboard se ajusta em tablets e dispositivos móveis com um menu colapsável.</p>
        </article>
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Contexto global</h2>
          <p className="mt-2 text-sm text-muted-foreground">Usuário e navegação são gerenciados de forma global para o shell inteiro.</p>
        </article>
      </div>
    </section>
  )
}
