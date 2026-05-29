"use client"

import { useState, type JSX } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Menu, X } from "lucide-react"

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/servicos", label: "Serviços" },
    { href: "/contato", label: "Contato" },
  ]

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative h-10">
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            className="flex items-center shrink-0 relative w-32 h-10"
            aria-label="Ir para a página inicial"
          >
            <Image
              src="/logo.svg"
              alt="JuryScan"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <nav
          className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2"
          aria-label="Navegação principal"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-gray-700 hover:text-[#633B48] font-medium transition-colors ${
                  isActive ? "text-[#633B48]" : ""
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 w-5 rounded-full bg-[#633B48] transition-all duration-300 ${
                    isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent font-medium"
            >
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button className="bg-[#633B48] hover:bg-[#300117] text-white font-medium border-none shadow-none">
              Cadastrar
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex flex-1 justify-end">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-[#633B48]"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-4 mt-4" aria-label="Menu mobile">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium transition-colors px-4 py-2 border-l-2 ${
                    isActive
                      ? "text-[#633B48] border-[#633B48] bg-[#FFF7F9]"
                      : "text-gray-700 border-transparent hover:text-[#633B48]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="flex flex-col space-y-3 px-4 pt-4 border-t border-gray-200">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent font-medium"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="w-full bg-[#633B48] hover:bg-[#300117] text-white font-medium">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
