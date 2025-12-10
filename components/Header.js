"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <div className="w-32 h-6 pb-6 flex items-center justify-center">
          <img src="./Logo.svg" alt="Logo" className="w-40" />
        </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#inicio" className="text-gray-700 hover:text-[#633B48] transition-colors">
            Início
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-[#633B48] transition-colors">
            Sobre
          </Link>
          <Link href="/#servicos" className="text-gray-700 hover:text-[#633B48] transition-colors">
            Serviços
          </Link>
          <a href="mailto:contato@juryscan.com" className="text-gray-700 hover:text-[#633B48] transition-colors">
            Contato
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="outline" className="border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button className="bg-[#633B48] hover:bg-[#300117] text-white">Cadastrar</Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-[#633B48]"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-4 mt-4">
            <Link href="/#inicio" className="text-gray-700 hover:text-[#633B48] transition-colors px-4 py-2">
              Início
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-[#633B48] transition-colors px-4 py-2">
              Sobre
            </Link>
            <Link href="/#servicos" className="text-gray-700 hover:text-[#633B48] transition-colors px-4 py-2">
              Serviços
            </Link>
            <a href="https://mail.google.com/contato@juryscan.com" className="text-gray-700 hover:text-[#633B48] transition-colors px-4 py-2 block">
              Contato
            </a>
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="w-full bg-[#633B48] hover:bg-[#300117] text-white">Cadastrar</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
