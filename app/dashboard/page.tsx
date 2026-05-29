"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) { router.replace("/login"); return }
    if (user.tipoUsuario === "ADMIN") router.replace("/admin/dashboard")
    else if (user.tipoUsuario === "ADVOGADO") router.replace("/advogado/dashboard")
    else router.replace("/cliente/dashboard")
  }, [user, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#633B48]" />
    </div>
  )
}
