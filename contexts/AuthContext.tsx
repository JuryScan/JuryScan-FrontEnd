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
  isAuthenticated,
  isAdvogado,
  type UserData,
} from "@/lib/auth"
import { post } from "@/lib/api"

interface AuthContextType {
  user: UserData | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isAdvogado: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // MOCK: Usuário fictício para desenvolvimento sem back-end
  const [user, setUserState] = useState<UserData | null>({
    id: "mock-123",
    nomeCompleto: "Dr. Ana Clara (Mock)",
    email: "ana.clara@juryscan.com.br",
    role: "ADVOGADO",
    tipo: "advogado",
    cpf: "000.000.000-00",
  })
  const [token, setTokenState] = useState<string | null>("mock-token-secret")
  const [isLoading, setIsLoading] = useState(false)

  // Inicializa o estado de autenticação ao montar o componente
  useEffect(() => {
    // Mantém o estado mockado
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(async () => {
    // No-op em mock
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      // Simula login bem-sucedido
      console.log("Mock Login:", email)
      setTokenState("mock-token-secret")
      setUserState({
        id: "mock-123",
        nomeCompleto: "Dr. Ana Clara (Mock)",
        email: email,
        role: "ADVOGADO",
        tipo: "advogado",
      })
    },
    []
  )

  const logout = useCallback(() => {
    setUserState(null)
    setTokenState(null)
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!token,
    isAdvogado: user?.role === "ADVOGADO" || user?.tipo === "advogado",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para acessar o contexto de autentção.
 * Deve ser usado dentro de um AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}