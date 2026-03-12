"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 shadow-sm w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative h-10">

                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center shrink-0" aria-label="Ir para a página inicial">
                        <img 
                            src="/logo.svg" 
                            alt="JuryScan" 
                            className="h-8 md:h-10 w-auto object-contain shrink-0" 
                        />
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors">
                        Início
                    </Link>
                    <Link href="/sobre" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors">
                        Sobre
                    </Link>
                    <Link href="/servicos" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors">
                        Serviços
                    </Link>
                    <Link href="/contato" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors">
                        Contato
                    </Link>
                </nav>

                {/* Bloco 3: Botões alinhados à direita */}
                <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
                    <Link href="/login">
                        <Button variant="outline" className="border-[#633B48] text-[#633B48] hover:bg-[#FFECF1] bg-transparent font-medium">
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
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                    <nav className="flex flex-col space-y-4 mt-4">
                        <Link href="/" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors px-4 py-2">
                            Início
                        </Link>
                        <Link href="/sobre" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors px-4 py-2">
                            Sobre
                        </Link>
                        <Link href="/servicos" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors px-4 py-2">
                            Serviços
                        </Link>
                        <Link href="/contato" className="text-gray-700 hover:text-[#633B48] font-medium transition-colors px-4 py-2">
                            Contato
                        </Link>
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