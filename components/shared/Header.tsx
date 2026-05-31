"use client"

import { useState, type JSX } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Menu, X, LogOut, Wallet, LayoutDashboard } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"

interface HeaderProps {
  mockUser?: {
    name?: string
    nome?: string
    initials?: string
    iniciais?: string
    credits?: number
    creditos?: number
    isAdvogado?: boolean
  }
}

export default function Header({ mockUser }: HeaderProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const user = mockUser ? {
    name: mockUser.nome || mockUser.name || "Usuário",
    initials: mockUser.iniciais || mockUser.initials || "U",
    credits: mockUser.creditos ?? mockUser.credits ?? 0,
    rotaBase: mockUser.isAdvogado ? "/advogado" : "/cliente"
  } : null

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/plans", label: "Planos" },
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
                className={`relative text-gray-700 hover:text-[#633B48] font-medium transition-colors ${isActive ? "text-[#633B48]" : ""
                  }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 w-5 rounded-full bg-[#633B48] transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-xs bg-[#FFF7F9] text-[#633B48] px-3 py-1.5 rounded-full font-semibold border border-[#FFECF1]">
                {user.credits} créditos
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none hover:opacity-85 transition text-left cursor-pointer">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarFallback className="bg-[#633B48] text-white text-xs font-bold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 mt-2 bg-white p-1 border border-gray-200 rounded-xl shadow-lg z-50">
                  <DropdownMenuItem asChild className="px-3 py-2.5 text-sm text-gray-707 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Link href={`${user.rotaBase}/dashboard`} className="w-full flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      <span>Início do Painel</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">

                    <Link href="/wallet" className="w-full flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-500" />
                      <span>Minha Carteira</span>
                    </Link>
                  </DropdownMenuItem>

                  <div className="h-px bg-gray-100 my-1" />

                  <DropdownMenuItem className="px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-2 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
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
            </>
          )}
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
                  className={`font-medium transition-colors px-4 py-2 border-l-2 ${isActive
                    ? "text-[#633B48] border-[#633B48] bg-[#FFF7F9]"
                    : "text-gray-700 border-transparent hover:text-[#633B48]"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="flex flex-col space-y-3 px-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#633B48] text-white text-xs font-bold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.credits} créditos</p>
                    </div>
                  </div>
                  <Link href={`${user.rotaBase}/dashboard`} onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                    Início do Painel
                  </Link>

                  <Link href="/wallet" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                    Minha Carteira
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-2 py-1.5 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 rounded">
                    <LogOut className="h-4 w-4" /> Sair
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent font-medium"
                    >
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#633B48] hover:bg-[#300117] text-white font-medium">
                      Cadastrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}