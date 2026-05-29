import SignupForm from "@/components/SignupForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cadastro - JuryScan",
  description: "Crie sua conta na plataforma JuryScan.",
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 items-center justify-center p-8">
        <SignupForm />
      </div>
    </div>
  )
}