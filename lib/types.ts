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

export interface LoginResponse {
  token: string
}

export interface User {
  id?: string
  nomeCompleto?: string
  email?: string
  role?: string
  tipo?: string
  cpf?: string
  telefone?: string
  dataNascimento?: string
  [key: string]: unknown
}

export interface UserAdvogado extends User {
  numeroOab?: string
  experiencia?: string
  descricao?: string
}

// ============================================================
// Análise CNIS
// ============================================================

export type Severity = "critical" | "warning" | "info" | "neutral"

export interface AnalysisIssue {
  id: number
  type: string
  severity: Severity
  title: string
  description: string
  recommendation: string
}

export interface AnalysisSummary {
  clientName: string
  totalIssues: number
  processedAt: string
}

export interface AnalysisResult {
  status: Severity
  summary: AnalysisSummary
  issues: AnalysisIssue[]
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
// Utilitários
// ============================================================

export type StepIndicator = 1 | 2 | 3
