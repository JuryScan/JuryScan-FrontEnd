# Changelog — Estabilização do Front-end

**Branch:** `fix/build-develop-stable` (a partir de `develop`)
**Objetivo:** corrigir os problemas de build e os bugs estruturais do front-end
para subir uma versão estável da `develop` e poder mergear na `main` (deploy).

**Status do build:** ✅ `npm run build` passa (exit 0) — compilação +
type-check + lint sem erros, e todas as 26 rotas são geradas.

**Resumo:** 24 arquivos alterados (+88 / −126), em 10 commits.

---

## 1. Build / Tipagem (destrava o `next build`)

- **`app/wallet/page.tsx`** — removida a prop `cliente` passada ao `WalletPanel`
  (o componente não recebe props; já gerencia esse dado internamente). Era um
  dos erros que quebravam o type-check.
- **`components/BalanceCard.tsx`** — tipadas as props `credits` e `value`
  (antes eram `implicit any`).
- **`components/WalletPanel.tsx`** — normalizados os genéricos `useState<T>()`
  (estavam escritos com espaços, `useState < T > ()`, frágil em TSX).
- **`components/forms/*`** — adicionado `"use client"` nos 9 componentes que
  usam hooks (TextInput, SelectInput, TextAreaInput, CpfCnpjInput, CurrencyInput,
  CheckBoxInput, RadioInput, ToggleInput, PasswordInput). Evita crash caso sejam
  importados por um Server Component.

## 2. Estrutura de páginas / layout

- **`app/(public)/(auth)/cadastro/page.tsx`** — removidos o `<Header>` e o
  `<Footer>` duplicados (o layout `(public)` já os renderiza) e o card externo
  redundante (o `SignupForm` já tem o seu próprio card).
- **`app/(public)/(marketing)/sobre/page.tsx`** — removido o `import` de `Footer`
  sem uso (renderizá-lo duplicaria o rodapé do layout); título promovido de
  `<h2>` para `<h1>` com tipografia adequada e larguras unificadas (texto
  inalterado).
- **`app/(public)/page.tsx`** — removido o `Drawer` morto (nunca era aberto;
  não havia gatilho).

## 3. Navegação e links

- **`components/shared/Footer.tsx`** — corrigidos os links quebrados:
  - `/mapa` (2x) → `/cliente/advogados`;
  - removidos os links de **Política de Privacidade** (`/privacidade`) e
    **Termos de uso** (`/termos`) — páginas que ainda não existem;
  - removida a coluna **Utilização** (apontava para 2 PDFs inexistentes em
    `public/docs/`); grade ajustada de 4 para 3 colunas.
- **`app/cliente/advogados/page.tsx`** — o botão **"Ver Perfil"** agora navega
  para `/cliente/advogados/[id]` (antes não fazia nada).
- **`components/AdminShell.tsx`** — removidos os itens de menu **Transações**
  (`/admin/transacoes`) e **Configurações** (`/admin/configuracoes`), que não
  têm página.
- **`components/DashboardShell.tsx`** — menu da sidebar agora é **por papel**:
  advogado mantém o conjunto completo; cliente lista só Dashboard, Advogados e
  Relatórios (evita 404 em rotas de cliente inexistentes).

## 4. Formulários

- **`components/forms/PasswordInput.tsx`** — ícones do mostrar/ocultar senha
  trocados de emoji (🙈/👁️) por `Eye`/`EyeOff` (lucide-react); removido o
  `tabIndex={-1}`, deixando o botão acessível por teclado.
- **`components/forms/TextInput.tsx`** — substituído `react-input-mask` (usa
  `findDOMNode`, sem `forwardRef`, quebra o ref do react-hook-form no React 18)
  por `PatternFormat` do `react-number-format`. As máscaras `9` (dígito) são
  convertidas para `#` automaticamente. `register()` passou a ser chamado uma
  única vez.

## 5. Home

- **`components/ExperimentSection.tsx`** — o CTA **"Experimente Agora"** agora
  redireciona para `/cadastro?email=...` (antes só fazia `console.log` e exibia
  sucesso falso).
- **`app/(public)/(auth)/cadastro/page.tsx`** e **`components/SignupForm.tsx`** —
  o cadastro lê `searchParams.email` e pré-preenche o campo de e-mail (etapa 2).
- **`app/advogado/historico/page.tsx`** — removido `setIsLoading(true)` morto no
  `finally`.

## 6. Autenticação (tipos)

- **`contexts/AuthContext.tsx`** — `tipoUsuario` do cliente demo `"CLIENTE"` →
  `"COMUM"` (alinha com a union de tipos `"COMUM" | "ADVOGADO" | "ADMIN"`).

---

## Decisões de produto

- **Planos (`/servicos`):** mantidos visíveis. Houve um commit que os
  desabilitava via flag, mas a decisão foi **revertida** — manter uma página
  existente e funcional não prejudica o projeto.

## Pendências / próximos passos (não incluídos nesta branch)

- Criar as páginas **/privacidade** e **/termos** e os **PDFs** de manual, e
  então reativar os links no footer.
- Implementar o fluxo de **recuperação de senha** ("Esqueci minha senha" no
  login ainda aponta para `#`).
- Remover `react-input-mask` do `package.json` (não é mais usado).
- **Integrações** com o back-end (login, cadastro, análise de CNIS, contato) —
  hoje em modo demo/mock (`DEMO_MODE = true`, `NEXT_PUBLIC_API_URL` indefinida).
- Definir `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` para habilitar o login.

---

## Commits

| Hash | Descrição |
|------|-----------|
| `7ecf769` | fix: corrige build e bugs estruturais do front-end |
| `141ab23` | fix(footer): corrige links quebrados para rotas/arquivos inexistentes |
| `da7ddb3` | style(sobre): melhora hierarquia e tipografia do título |
| `28d9d63` | fix(auth): alinha tipoUsuario do cliente demo para "COMUM" |
| `0b937e0` | revert(servicos): reexibe a seção de planos em /servicos |
| `da0ef45` | fix(navegacao): remove links de sidebar para rotas inexistentes |
| `86d8823` | fix(forms): substitui react-input-mask por react-number-format |
| `37d6b77` | fix(auth-ui): padroniza layout das telas de login e cadastro |
| `16c5367` | feat(home): CTA "Experimente Agora" leva ao cadastro com e-mail |
