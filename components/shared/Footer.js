import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          <div>
            <div className="flex items-center mb-6">
              <div className="w-64 h-32 flex items-center justify-center">
                <img src="/LogoBranca.svg" alt="Logo" className="w-64 h-64" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Advogados</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Assinar um planos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Análise de CNIS
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Fazer o Cadastro / Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Clientes</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Advogados perto de você
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Ir para o mapa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Utilização</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Como utilizar a JuryScan [ PDF ]?
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  JuryScan para advogados [ PDF ]
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-400">
            <div className="flex flex-wrap gap-6">
              <Link href="#" className="hover:text-white">
                Mapa do site
              </Link>
              <Link href="#" className="hover:text-white">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-white">
                Entre em contato com a JuryScan
              </Link>
              <Link href="#" className="hover:text-white">
                Política de Cookies
              </Link>
              <Link href="#" className="hover:text-white">
                Termos de uso
              </Link>
            </div>
            <div>© JuryScan 2025</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
