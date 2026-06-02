/**
 * Schemas de validação com Zod para formulários.
 */

import { z } from "zod"

// ============================================================
// Login
// ============================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória"),
})

export type LoginSchema = z.infer<typeof loginSchema>

// ============================================================
// Cadastro (multi-step)
// ============================================================

// Helper para converter dd/mm/yyyy para Date válida
const parseDataBR = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.length < 8) return null
  const parts = dateStr.split("/")
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null
  if (year < 1900 || year > new Date().getFullYear()) return null
  
  const date = new Date(year, month - 1, day)
  return date.getDate() === day && date.getMonth() === month - 1 ? date : null
}

// Passo 1: dados pessoais
export const signupStep1Schema = z.object({
  nomeCompleto: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(
      (cpf) => cpf.replace(/\D/g, "").length === 11,
      "CPF deve ter 11 dígitos"
    ),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine(
      (date) => parseDataBR(date) !== null,
      "Data de nascimento inválida (use dd/mm/aaaa)"
    ),
  numeroOab: z.string().optional().catch(undefined),
}).refine(
  (data) => {
    // Se não tem OAB, é comum — válido
    if (!data.numeroOab || data.numeroOab.trim() === "") return true
    // Se tem OAB, deve ter pelo menos 5 caracteres
    return data.numeroOab.length >= 5
  },
  {
    message: "Número da OAB inválido",
    path: ["numeroOab"],
  }
)

// Passo 2: contato
export const signupStep2Schema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(
      (tel) => tel.replace(/\D/g, "").length >= 10,
      "Telefone deve ter pelo menos 10 dígitos"
    ),
  experiencia: z.string().optional().catch(undefined),
  descricao: z.string().optional().catch(undefined),
})

// Passo 3: senha
export const signupStep3Schema = z.object({
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmarSenha: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
})

export type SignupStep1Schema = z.infer<typeof signupStep1Schema>
export type SignupStep2Schema = z.infer<typeof signupStep2Schema>
export type SignupStep3Schema = z.infer<typeof signupStep3Schema>

// ============================================================
// Contato
// ============================================================

export const contactSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
})

export type ContactSchema = z.infer<typeof contactSchema>

// ============================================================
// Perfil e Configurações
// ============================================================

export const profileSchema = z.object({
  nomeCompleto: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  numeroOab: z.string().optional(),
  experiencia: z.string().optional(),
  descricao: z.string().optional(),
})

export type ProfileSchema = z.infer<typeof profileSchema>

export const addressSchema = z.object({
  tipoEndereco: z.enum(["RESIDENCIAL", "COMERCIAL"]),
  logradouro: z.string().min(5, "Logradouro muito curto"),
  bairro: z.string().min(2, "Bairro muito curto"),
  cidade: z.string().min(2, "Cidade muito curta"),
  estado: z.string().length(2, "Use a sigla (ex: PE)"),
  cep: z.string().min(8, "CEP inválido"),
})

export type AddressSchema = z.infer<typeof addressSchema>
