import { Button } from "./ui/button"
import Link from "next/link"

export default function LoginForm() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="flex justify-center mb-8">
        <div className="w-40 h-16 flex items-center justify-center">
          <img src="/Logo.svg" alt="Logo" className="w-40" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Login</h1>

      <form className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          <span className="mr-2">G</span>
          Continuar com o Google
        </Button>

        <div className="text-center text-gray-500 text-sm">ou</div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">👤</span>
          <input
            type="email"
            placeholder="E-mail"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔒</span>
          <input
            type="password"
            placeholder="Senha"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent"
          />
        </div>

        <Button className="w-full bg-[#633B48] hover:bg-[#300117] text-white py-3 font-medium">Entrar</Button>

        <div className="flex flex-col justify-between items-center text-sm">
          <Link href="#" className="text-[#633B48] hover:text-[#300117]">
            Esqueci minha senha
          </Link>
          <Link href="/cadastro" className="text-gray-600 hover:text-gray-900">
            Sem conta? <span className="text-[#633B48]">criar conta</span>
          </Link>
        </div>


        <p className="text-xs text-gray-500 text-center mt-6">
          Ao clicar em "Criar conta", concordo com a{" "}
          <Link href="#" className="text-[#633B48] hover:text-[#300117]">
            política de privacidade
          </Link>{" "}
          da JuryScan.
        </p>
      </form>
    </div>
  )
}
