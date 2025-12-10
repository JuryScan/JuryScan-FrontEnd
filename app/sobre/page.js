import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        
        <img
          src="/Logo.svg"
          alt="Logo JuryScan"
          className="w-40 h-auto mb-8"
        />

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">
            Sobre o JuryScan
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            O JuryScan nasceu para transformar a forma como cidadãos e profissionais lidam com o CNIS — um documento essencial, mas frequentemente marcado por falhas, inconsistências e informações lançadas de forma incorreta. Problemas desse tipo podem atrasar benefícios previdenciários, gerar insegurança e exigir longos processos de correção, muitas vezes custando mais de R$ 2.000,00 e levando até seis meses para serem resolvidos.

            Diante desse cenário, desenvolvemos uma solução inteligente e automatizada capaz de identificar erros no CNIS com rapidez e precisão. Nossa ferramenta entrega relatórios claros, tanto em linguagem jurídica quanto em uma versão totalmente acessível para leigos, permitindo que problemas sejam corrigidos antes de se tornarem entraves legais. O JuryScan reduz o tempo de análise, aumenta a confiabilidade das informações e cria uma ponte eficiente entre cidadãos e advogados especializados.

            Mais do que tecnologia, oferecemos segurança, economia de tempo e democratização do acesso a serviços previdenciários. Para advogados, o JuryScan se torna um aliado estratégico, simplificando processos e otimizando atendimentos. Para o cidadão, representa mais clareza, autonomia e confiança no caminho até seus direitos.

            O projeto foi desenvolvido com o apoio da KeyCore, empresa de referência em desenvolvimento de software, IoT e consultoria estratégica. Sob a orientação do CEO Rogério Filho, contamos com direcionamento técnico e expectativas elevadas, que impulsionaram a criação de uma solução inovadora e realmente útil para o mercado jurídico e previdenciário.

            Somos o JuryScan: tecnologia e precisão trabalhando juntos para facilitar a vida de quem precisa.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
