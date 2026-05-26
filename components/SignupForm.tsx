"use client"

import { useState, type JSX, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { post } from "@/lib/api"
import {
  signupStep1Schema,
  signupStep2Schema,
  signupStep3Schema,
  type SignupStep1Schema,
  type SignupStep2Schema,
  type SignupStep3Schema,
} from "@/lib/schemas"
import type { UserType } from "@/lib/types"
import { TextInput } from "./forms/TextInput"
import { CpfCnpjInput } from "./forms/CpfCnpjInput"
import { DateInput } from "./forms/DateInput"
import { PasswordInput } from "./forms/PasswordInput"
import ReCAPTCHA from "react-google-recaptcha"

interface FormData {
  // Step 1
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  numeroOab?: string
  // Step 2
  email: string
  telefone: string
  experiencia?: string
  descricao?: string
  // Step 3
  senha: string
  confirmarSenha: string
}

export default function SignupForm(): JSX.Element {
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<UserType>("comum")
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const step1 = useForm<SignupStep1Schema>({
    resolver: zodResolver(signupStep1Schema),
    defaultValues: {
      nomeCompleto: "",
      cpf: "",
      dataNascimento: "",
      numeroOab: "",
    },
    mode: "onBlur",
  })

  const step2 = useForm<SignupStep2Schema>({
    resolver: zodResolver(signupStep2Schema),
    defaultValues: {
      email: "",
      telefone: "",
      experiencia: "",
      descricao: "",
    },
    mode: "onBlur",
  })

  const step3 = useForm<SignupStep3Schema>({
    resolver: zodResolver(signupStep3Schema),
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    },
    mode: "onBlur",
  })

  const handleNext = async () => {
    setError("")

    let isValid = false

    if (step === 1) {
      isValid = await step1.trigger()
    } else if (step === 2) {
      isValid = await step2.trigger()
    }

    if (isValid && step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleTabChange = (type: UserType) => {
    setUserType(type)
    setStep(1)
    step1.reset()
    step2.reset()
    step3.reset()
    setError("")
    setRecaptchaToken(null)
  }

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (token) setError("")
  }

  const onSubmit = async (data: FormData) => {
    setError("")

    if (!recaptchaToken) {
      setError("Por favor, complete o reCAPTCHA.")
      return
    }

    setIsLoading(true)

    try {
      const dataIso = data.dataNascimento
        ? new Date(data.dataNascimento).toISOString()
        : new Date().toISOString()

      const basePayload = {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        telefone: data.telefone,
        senha: data.senha,
        dataNascimento: dataIso,
        cpf: data.cpf.replace(/\D/g, ""),
        recaptchaToken,
      }

      let endpoint = "/users/comum/register"
      const finalPayload = {
        ...basePayload,
        ...(userType === "advogado"
          ? {
              numeroOab: data.numeroOab,
              experiencia: data.experiencia,
              descricao: data.descricao,
            }
          : {}),
      }

      if (userType === "advogado") {
        endpoint = "/users/advogado/register"
      }

      await post(endpoint, finalPayload)

      router.push("/login")
    } catch (err: unknown) {
      // Reseta o reCAPTCHA em caso de erro
      recaptchaRef.current?.reset()
      setRecaptchaToken(null)

      const apiError = err as { name?: string; message?: string }
      if (apiError?.name === "ApiError") {
        setError(apiError.message ?? "Erro desconhecido.")
      } else {
        setError("Erro de conexão. Verifique sua internet.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Combina todos os steps em um único submit
  const handleFinalSubmit = async () => {
    const isValid = await step3.trigger()
    if (!isValid) return

    const allData: FormData = {
      ...step1.getValues(),
      ...step2.getValues(),
      ...step3.getValues(),
    }

    await onSubmit(allData)
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
      <div className="flex justify-center mb-8">
        <img src="/logo.svg" alt="JuryScan" className="w-40 object-contain" />
      </div>

      <h1 className="text-3xl font-bold text-center text-[#0A1F30] mb-2">
        Criar Conta
      </h1>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Selecione seu perfil e preencha as informações abaixo.
      </p>

      <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
        <button
          type="button"
          onClick={() => handleTabChange("comum")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "comum"
              ? "bg-white text-[#A50064] shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sou Cliente
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("advogado")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "advogado"
              ? "bg-white text-[#A50064] shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sou Advogado
        </button>
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-8">
        <div
          className={`w-8 h-8 ${
            step >= 1
              ? "bg-[#FFB6E1] text-[#A50064]"
              : "bg-gray-100 text-gray-400"
          } rounded-full flex items-center justify-center font-bold text-sm transition-colors`}
        >
          {step > 1 ? "✓" : "1"}
        </div>
        <div
          className={`w-8 h-8 ${
            step >= 2
              ? "bg-[#FFB6E1] text-[#A50064]"
              : "bg-gray-100 text-gray-400"
          } rounded-full flex items-center justify-center font-bold text-sm transition-colors`}
        >
          {step > 2 ? "✓" : "2"}
        </div>
        <div
          className={`w-8 h-8 ${
            step >= 3
              ? "bg-[#FFB6E1] text-[#A50064]"
              : "bg-gray-100 text-gray-400"
          } rounded-full flex items-center justify-center font-bold text-sm transition-colors`}
        >
          3
        </div>
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <FormProvider {...step1}>
            <TextInput
              name="nomeCompleto"
              label="Nome Completo"
              placeholder="Digite seu nome completo"
            />

            <CpfCnpjInput
              name="cpf"
              label="CPF"
            />

            <DateInput
              name="dataNascimento"
              label="Data de Nascimento"
            />

            {userType === "advogado" && (
              <TextInput
                name="numeroOab"
                label="Número da OAB"
                placeholder="000000/UF"
              />
            )}
          </FormProvider>
        )}

        {step === 2 && (
          <FormProvider {...step2}>
            <TextInput
              name="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
            />

            <TextInput
              name="telefone"
              label="Telefone"
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
            />

            {userType === "advogado" && (
              <>
                <TextInput
                  name="experiencia"
                  label="Experiência"
                  placeholder="Ex: 5 anos"
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="descricao" className="font-medium text-sm text-[#0A1F30]">
                    Descrição Profissional
                  </label>
                  <textarea
                    {...step2.register("descricao")}
                    id="descricao"
                    placeholder="Breve descrição profissional..."
                    rows={3}
                    className="input-base resize-none"
                  />
                </div>
              </>
            )}
          </FormProvider>
        )}

        {step === 3 && (
          <FormProvider {...step3}>
            <PasswordInput
              name="senha"
              label="Senha"
              placeholder="Digite sua senha"
            />

            <PasswordInput
              name="confirmarSenha"
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
            />

            <div className="bg-[#FFECF1] border border-[#FFB6E1] rounded-lg p-3 mt-2 mb-4">
              <p className="text-xs text-[#A50064] text-center">
                Mínimo 8 caracteres com letras e números.
              </p>
            </div>

            <div className="flex justify-center py-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={onRecaptchaChange}
              />
            </div>
          </FormProvider>
        )}

        <div className="flex justify-between pt-4 gap-4">
          <Button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            variant="outline"
            className="flex-1 py-6 border-gray-300 text-gray-700 disabled:opacity-50"
          >
            Voltar
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 py-6 bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] font-bold border-none shadow-none"
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading || !recaptchaToken}
              className="flex-1 py-6 bg-[#A50064] hover:bg-[#7a004a] text-white font-bold border-none shadow-none transition-colors disabled:opacity-70"
            >
              {isLoading ? "Criando..." : "Finalizar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
