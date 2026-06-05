/**
 * Tipos compartilhados para toda a aplicação.
 */

// ============================================================
// Autenticação
// ============================================================

export interface LoginCredentials {
  email: string
  password: string
  recaptchaToken: string
}

export interface User {
  id: string
  nomeCompleto: string
  email: string
  telefone: string
  emailRecuperacao: string
  dataNascimento: string
  cpf: string
  status: "ATIVO" | "INATIVO" | "BLOQUEADO"
  emailVerificado: boolean
  enderecoUrl: string
  tipoUsuario: "COMUM" | "ADVOGADO" | "ADMIN"
  descricao?: string
  numeroOab?: string
  experiencia?: string
  dataCriacao: string
  dataUltimaAtualizacao: string
}

export interface LoginResponse {
  token: string
  success: boolean
  message: string
  status: number
  user: User
}

// ============================================================
// Cadastro (Signup)
// ============================================================

export interface SignupComumPayload {
  nomeCompleto: string
  email: string
  telefone: string
  senha: string
  dataNascimento: string
  cpf: string
  recaptchaToken: string
}

export interface SignupAdvogadoPayload {
  nomeCompleto: string
  email: string
  telefone: string
  senha: string
  dataNascimento: string
  cpf: string
  descricao: string
  numeroOab: string
  experiencia: string
  recaptchaToken: string
}

export interface SignupComumResponse {
  success: boolean
  message: string
  data: {
    token: string
    userComum: User
  }
  status: number
}

export interface SignupAdvogadoResponse {
  success: boolean
  message: string
  data: {
    token: string
    userAdvogado: User
  }
  status: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  status: number
}

export interface PageResponse<T> {
  items: T[]
  page: number
  totalPages: number
  pageSize: number
  totalElements: number
}

// ============================================================
// Análise CNIS
// ============================================================

export type Severity = "ALTA" | "MEDIA" | "BAIXA" | "INFO"

export interface AnalysisIssue {
  severity?: string
  title?: string
  description?: string
  recommendation?: string
  type?: string
  id?: string
  titulo?: string
  severidade?: Severity
  descricao?: string
  sugestaoCorrecao?: string
  confianca?: number
}

export interface AnalysisSummary {
  clientName: string
  totalIssues: number
  processedAt: string
}

export interface AnalysisResult {
  status?: string
  id?: string
  titulo?: string
  descricaoGeral?: string
  dataCriacao?: string
  summary?: AnalysisSummary
  sumario?: string
  relatorioSumarioJuridico?: string
  issues?: AnalysisIssue[]
  falhas?: AnalysisIssue[]
}

// ============================================================
// Dashboard Advogado
// ============================================================

export interface Lead {
  id: number | string
  name: string
  status: string
  date: string
  message: string
}

export interface AuditRecord {
  id: number | string
  client: string
  date: string
  issues: number
  status: string
}

export interface DashboardStats {
  activeClients: number
  newLeads: number
  analysesThisMonth: number
  conversionRate: string
}

export interface IntelligenceStats {
  totalErrors: number
  avgAnalysisTime: string
  totalRecoverableValue: number
  monthlyData: {
    month: string
    analyses: number
    errors: number
  }[]
}

// ============================================================
// Formulários
// ============================================================

export interface SignupFormData {
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  email: string
  telefone: string
  senha: string
  confirmarSenha: string
  numeroOab: string
  experiencia: string
  descricao?: string
}

export type UserType = "comum" | "advogado"

// ============================================================
// Depoimentos
// ============================================================

export interface Testimonial {
  id: number | string
  name: string
  role: string
  image: string
  rating: number
  text: string
}

// ============================================================
// Marketplace
// ============================================================

export interface Lawyer {
  id: number | string
  nomeCompleto: string
  numeroOab: string
  especialidade: string
  localizacao: string
  rating: number
  reviews: number
  fotoUrl: string
  verificado: boolean
  distancia?: number
}
