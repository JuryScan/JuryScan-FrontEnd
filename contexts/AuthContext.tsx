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
import type { ApiResponse, LoginResponse } from "@/lib/types"

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
  const [user, setUserState] = useState<UserData | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Inicializa o estado de autenticação ao montar o componente
  useEffect(() => {
    const storedToken = getToken()
    const storedUser = getUser()

    if (storedToken && storedUser) {
      setTokenState(storedToken)
      setUserState(storedUser)
    }
    
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const response = await get<ApiResponse<UserData>>("/auth/me")
      if (response.success && response.data) {
        setUserState(response.data)
        setUser(response.data)
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error)
      // Se falhar a busca do "me", talvez o token tenha expirado
      if ((error as any).status === 401) {
        logout()
      }
    }
  }, [])

  const login = useCallback(
    async (email: string, senha: string) => {
      setIsLoading(true)
      try {
        // Mapeia 'senha' do front para 'password' do back no login
        const response = await post<LoginResponse>("/auth/login", {
          email,
          password: senha,
        })

        if (response.token && response.user) {
          setTokenState(response.token)
          setUserState(response.user as UserData)
          
          setToken(response.token)
          setUser(response.user as UserData)
        } else {
          throw new Error("Resposta de login inválida")
        }
      } catch (error) {
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUserState(null)
    setTokenState(null)
    clearAuth()
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!token,
    isAdvogado: user?.tipoUsuario === "ADVOGADO",
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