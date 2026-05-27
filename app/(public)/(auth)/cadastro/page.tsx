import SignupForm from "@/components/SignupForm"
import Footer from "@/components/shared/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cadastro - JuryScan",
  description: "Crie sua conta na plataforma JuryScan.",
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
