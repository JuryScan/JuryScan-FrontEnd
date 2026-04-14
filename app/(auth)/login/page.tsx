import LoginForm from "@/components/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - JuryScan",
  description: "Acesse sua conta JuryScan.",
}

export default function LoginPage() {
  return (
    <div className="z-10 flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  )
}
