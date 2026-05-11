import LoginForm from "@/components/LoginForm"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login - JuryScan",
  description: "Acesse sua conta JuryScan.",
}

export default function LoginPage() {
  return (
    <div className="z-10 flex items-center justify-center min-h-screen">
      <Suspense fallback={<div className="animate-pulse bg-gray-100 h-[600px] w-[400px] rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
