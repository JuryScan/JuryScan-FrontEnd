"use client"

import { useState, type JSX, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { loginSchema, type LoginSchema } from "@/lib/schemas"
import { TextInput } from "./forms/TextInput"
import { PasswordInput } from "./forms/PasswordInput"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginForm(): JSX.Element {
  const router = useRouter()
  const { login, isAdvogado } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  })

  const { handleSubmit } = methods

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (token) setError("")
  }

  const onSubmit = async (data: LoginSchema) => {
    setError("")

    if (!recaptchaToken) {
      setError("Por favor, complete o reCAPTCHA.")
      return
    }

    setIsLoading(true)

    try {
      await login(data.email, data.senha, recaptchaToken)

      if (isAdvogado) {
        router.push("/advogado/dashboard")
      } else {
        router.push("/cliente/dashboard")
      }
    } catch (err: unknown) {
      // Reseta o reCAPTCHA em caso de erro
      recaptchaRef.current?.reset()
      setRecaptchaToken(null)

      const apiError = err as { status?: number; message?: string }
      if (apiError?.status === 401 || apiError?.status === 403) {
        setError("Email ou senha incorretos.")
      } else if (apiError?.message) {
        setError(apiError.message)
      } else {
        setError("Erro de conexão. Verifique sua internet.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <h1 className="text-[40px] font-bold text-[#0A1F30] mb-8">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 w-full text-center" role="alert">
            {error}
          </p>
        )}

        <FormProvider {...methods}>
          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md text-[#A50064] font-semibold hover:bg-gray-50 transition-colors"
            >
              Continuar com o Google
              <img src="/google-icon.svg" alt="" className="w-5 h-5" />
            </button>

            <div className="text-center text-gray-400 text-sm py-2">ou</div>

            <TextInput
              name="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
            />

            <PasswordInput
              name="senha"
              label="Senha"
              placeholder="Digite sua senha"
            />

            <div className="flex justify-center py-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={onRecaptchaChange}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !recaptchaToken}
              className="w-full bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] py-6 rounded-md font-bold text-lg border-none shadow-none mt-4 disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex justify-between items-center text-sm pt-2">
              <Link
                href="#"
                className="text-[#A50064] hover:underline font-medium"
              >
                Campanha / Esqueci minha senha
              </Link>
              <div className="text-gray-500">
                Sem conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-[#A50064] font-medium hover:underline"
                >
                  criar conta
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}