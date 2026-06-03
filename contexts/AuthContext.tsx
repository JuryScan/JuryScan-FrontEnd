"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
  type UserData,
} from "@/lib/auth"
import { post, get } from "@/lib/api"
import type {
  ApiResponse,
  LoginResponse,
  SignupComumPayload,
  SignupAdvogadoPayload,
  SignupComumResponse,
  SignupAdvogadoResponse,
} from "@/lib/types"

// DEMO MODE - mude para false quando o backend estiver rodando
const DEMO_MODE = false

interface AuthContextType {
  user: UserData | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>
  signupComum: (payload: SignupComumPayload) => Promise<void>
  signupAdvogado: (payload: SignupAdvogadoPayload) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isAdvogado: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (DEMO_MODE) {
        setIsLoading(false)
        return
      }
      const storedToken = getToken()
      const storedUser = getUser()
      if (storedToken) {
        setTokenState(storedToken)
        if (storedUser) setUserState(storedUser)
        try {
          const response = await get<ApiResponse<UserData>>("/auth/me")
          if (response.success && response.data) {
            setUserState(response.data)
            setUser(response.data)
          }
        } catch (error) {
          logout()
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const refreshUser = useCallback(async () => {
    if (DEMO_MODE) return
    try {
      const response = await get<ApiResponse<UserData>>("/auth/me")
      if (response.success && response.data) {
        setUserState(response.data)
        setUser(response.data)
      }
    } catch (error) {
      if ((error as any).status === 401) logout()
    }
  }, [])

  const login = useCallback(async (email: string, senha: string, recaptchaToken: string) => {
    setIsLoading(true)
    try {
      if (DEMO_MODE) {
        const demoUser: UserData = email.includes("admin")
          ? { id: "demo-3", nomeCompleto: "Admin Demo", email, tipoUsuario: "ADMIN" } as any
          : email.includes("cliente")
          ? { id: "demo-2", nomeCompleto: "Cliente Demo", email, tipoUsuario: "COMUM" } as any
          : { id: "demo-1", nomeCompleto: "Dr. Demo Advogado", email, tipoUsuario: "ADVOGADO" } as any
        setTokenState("demo-token")
        setUserState(demoUser)
        setToken("demo-token")
        setUser(demoUser)
        return
      }
      const response = await post<LoginResponse>("/auth/login", {
        email, password: senha, recaptchaToken,
      })
      if (response.token && response.user) {
        setTokenState(response.token)
        setUserState(response.user as unknown as UserData)
        setToken(response.token)
        setUser(response.user as unknown as UserData)
      } else {
        throw new Error("Resposta de login inválida")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signupComum = useCallback(async (payload: SignupComumPayload) => {
    setIsLoading(true)
    try {
      if (DEMO_MODE) {
        const demoUser: UserData = {
          id: "demo-comum",
          nomeCompleto: payload.nomeCompleto,
          email: payload.email,
          tipoUsuario: "COMUM",
        } as any
        setTokenState("demo-token")
        setUserState(demoUser)
        setToken("demo-token")
        setUser(demoUser)
        return
      }
      const response = await post<SignupComumResponse>("/users/comum/register", payload)
      if (response.data?.token && response.data?.userComum) {
        setTokenState(response.data.token)
        setUserState(response.data.userComum as unknown as UserData)
        setToken(response.data.token)
        setUser(response.data.userComum as unknown as UserData)
      } else {
        throw new Error("Resposta de cadastro inválida")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signupAdvogado = useCallback(async (payload: SignupAdvogadoPayload) => {
    setIsLoading(true)
    try {
      if (DEMO_MODE) {
        const demoUser: UserData = {
          id: "demo-advogado",
          nomeCompleto: payload.nomeCompleto,
          email: payload.email,
          tipoUsuario: "ADVOGADO",
          numeroOab: payload.numeroOab,
          experiencia: payload.experiencia,
          descricao: payload.descricao,
        } as any
        setTokenState("demo-token")
        setUserState(demoUser)
        setToken("demo-token")
        setUser(demoUser)
        return
      }
      const response = await post<SignupAdvogadoResponse>("/users/advogado/register", payload)
      if (response.data?.token && response.data?.userAdvogado) {
        setTokenState(response.data.token)
        setUserState(response.data.userAdvogado as unknown as UserData)
        setToken(response.data.token)
        setUser(response.data.userAdvogado as unknown as UserData)
      } else {
        throw new Error("Resposta de cadastro inválida")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUserState(null)
    setTokenState(null)
    clearAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, login, signupComum, signupAdvogado, logout, refreshUser,
      isAuthenticated: !!token,
      isAdvogado: user?.tipoUsuario === "ADVOGADO",
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}