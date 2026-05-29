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

// Passo 1: dados pessoais
export const signupStep1Schema = z.object({
  nomeCompleto: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido"),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória"),
  numeroOab: z.string().optional(),
}).refine(
  (data) => {
    // Se não tem OAB, é comum — válido
    if (!data.numeroOab) return true
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
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido"),
  experiencia: z.string().optional(),
  descricao: z.string().optional(),
})

// Passo 3: senha
export const signupStep3Schema = z.object({
  senha: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmarSenha: z.string(),
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
