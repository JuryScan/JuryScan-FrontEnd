import Footer from "@/components/shared/Footer"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre - JuryScan",
  description: "Conheça a história e a missão do JuryScan.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/logo.svg"
          alt="Logo JuryScan"
          width={160}
          height={80}
          className="mb-8"
        />
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <div>
            <h2 className="text-gray-700 text-[15px] md:text-lg leading-8 md:leading-9 space-y-6 text-left max-w-4xl lg:max-w-5xl mx-auto">
              Sobre o JuryScan
            </h2>

            <div className="text-gray-700 text-base md:text-lg leading-8 space-y-6 text-left max-w-3xl xl:max-w-5xl mx-auto">
              <p>O JuryScan nasceu para transformar a forma como cidadãos e profissionais lidam com o CNIS — um documento essencial, mas frequentemente marcado por falhas, inconsistências e informações lançadas de forma incorreta. Problemas desse tipo podem atrasar benefícios previdenciários, gerar insegurança e exigir longos processos de correção, muitas vezes custando mais de R$ 2.000,00 e levando até seis meses para serem resolvidos.
              </p>
              <p>
                Diante desse cenário, desenvolvemos uma solução inteligente e automatizada capaz de identificar erros no CNIS com rapidez e precisão. Nossa ferramenta entrega relatórios claros, tanto em linguagem jurídica quanto em uma versão totalmente acessível para leigos, permitindo que problemas sejam corrigidos antes de se tornarem entraves legais.
              </p>
              <p>
                O JuryScan reduz o tempo de análise, aumenta a confiabilidade das informações e cria uma ponte eficiente entre cidadãos e advogados especializados. Mais do que tecnologia, oferecemos segurança, economia de tempo e democratização do acesso a serviços previdenciários.
              </p>
              <p>
                Para advogados, o JuryScan se torna um aliado estratégico, simplificando processos e otimizando atendimentos. Para o cidadão, representa mais clareza, autonomia e confiança no caminho até seus direitos.
              </p>
              <p>
                O projeto foi desenvolvido com o apoio da KeyCore, empresa de referência em desenvolvimento de software, IoT e consultoria estratégica. Sob a orientação do CEO Rogério Filho, contamos com direcionamento técnico e expectativas elevadas, que impulsionaram a criação de uma solução inovadora e realmente útil para o mercado jurídico e previdenciário.
              </p>

              <p className="text-gray-900 font-semibold pt-4 border-t border-gray-200">
                Somos o JuryScan: tecnologia e precisão trabalhando juntos para facilitar a vida de quem precisa.
              </p>
            </div>

          </div>
        </section>
      </main>

    </div>
  )
}
