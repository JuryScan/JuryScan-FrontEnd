/**
 * Tipos compartilhados para toda a aplicação.
 */

// ============================================================
// Autenticação
// ============================================================

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  nomeCompleto: string
  email: string
  telefone?: string
  cpf?: string
  dataNascimento?: string
  tipoUsuario?: "COMUM" | "ADVOGADO" | "ADMIN"
  status?: string
  numeroOab?: string
  experiencia?: string
  descricao?: string
  [key: string]: unknown
}

export interface LoginResponse {
  token: string
  success: boolean
  message: string
  status: number
  user: User
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

export interface UserAdvogado extends User {
  numeroOab?: string
  experiencia?: string
  descricao?: string
}

// ============================================================
// Análise CNIS
// ============================================================

export type Severity = "ALTA" | "MEDIA" | "BAIXA" | "INFO"

export interface AnalysisIssue {
  id: string
  titulo: string
  severidade: Severity
  descricao: string
  sugestaoCorrecao: string
  confianca?: number
}

export interface AnalysisSummary {
  clientName: string
  totalIssues: number
  processedAt: string
}

export interface AnalysisResult {
  id: string
  titulo: string
  descricaoGeral: string
  dataCriacao: string
  summary?: AnalysisSummary
  issues?: AnalysisIssue[]
}

// ============================================================
// Dashboard Advogado
// ============================================================

export interface Lead {
  id: number
  name: string
  status: string
  date: string
  message: string
}

export interface AuditRecord {
  id: number
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
  descricao: string
}

export type UserType = "comum" | "advogado"

// ============================================================
// Depoimentos
// ============================================================

export interface Testimonial {
  id: number
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
  id: number
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
