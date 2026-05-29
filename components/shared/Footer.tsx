import Link from "next/link"
import Image from "next/image"
import type { JSX } from "react"

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-64 h-32 flex items-center justify-center relative">
                <Image
                  src="/LogoBranca.svg"
                  alt="Logo JuryScan"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Advogados</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/servicos" className="hover:text-white">
                  Assinar um plano
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="hover:text-white">
                  Análise de CNIS
                </Link>
              </li>
              <li>
                <span>
                  Fazer o{" "}
                  <Link href="/cadastro" className="hover:text-white underline underline-offset-2">
                    Cadastro
                  </Link>{" "}
                  /{" "}
                  <Link href="/login" className="hover:text-white underline underline-offset-2">
                    Login
                  </Link>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Clientes</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/cliente/advogados" className="hover:text-white">
                  Advogados perto de você
                </Link>
              </li>
              <li>
                <Link href="/cliente/advogados" className="hover:text-white">
                  Ir para o mapa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-400">
            <div className="flex flex-wrap gap-6">
              <Link href="/sobre" className="hover:text-white">
                Sobre nós
              </Link>
              <Link href="/contato" className="hover:text-white">
                Entre em contato com a JuryScan
              </Link>
            </div>
            <div>© JuryScan 2026</div>
          </div>
        </div>
      </div>
    </footer>
  )
}