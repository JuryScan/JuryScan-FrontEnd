"use client"

import { useState, type JSX, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { AlertCircle } from "lucide-react"
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

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

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

    if (!recaptchaSiteKey) {
      setError("O reCAPTCHA não está configurado no ambiente.")
      return
    }

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
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex justify-center mb-8">
        <img src="/logo.svg" alt="JuryScan" className="w-40 object-contain" />
      </div>
      <h1 className="text-3xl font-bold text-center text-[#0A1F30] mb-6">Entrar</h1>

      <FormProvider {...methods}>
        <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <button
            type="button"
            className="hidden w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md text-[#A50064] font-semibold hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5 shrink-0"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.207 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.053 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.053 6.053 29.277 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.176 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.146 35.091 26.715 36 24 36c-5.186 0-9.627-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
              />
            </svg>

            <span>Continuar com o Google</span>
          </button>

          <div className="hidden text-center text-gray-400 text-sm py-2">ou</div>

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

          {error && (
            <div
              className={`p-4 rounded-lg border flex gap-3 animate-in fade-in duration-300 ${
                error.includes("incorretos")
                  ? "bg-amber-50 border-amber-300"
                  : "bg-red-50 border-red-300"
              }`}
              role="alert"
            >
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle
                  className={`w-5 h-5 ${
                    error.includes("incorretos")
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    error.includes("incorretos")
                      ? "text-amber-800"
                      : "text-red-800"
                  }`}
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center py-2">
            {recaptchaSiteKey ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={onRecaptchaChange}
              />
            ) : (
              <p className="text-sm text-amber-600 text-center">
                reCAPTCHA não configurado no ambiente.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !recaptchaToken || !recaptchaSiteKey}
            className="w-full bg-[#FFB6E1] hover:bg-[#ff9cd2] text-[#A50064] py-6 rounded-md font-bold text-lg border-none shadow-none mt-4 disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex justify-between items-center text-sm pt-2">
            <Link
              href="#"
              className="text-[#A50064] hover:underline font-medium"
            >
              Esqueci minha senha
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
  )
}