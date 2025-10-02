export default function AboutSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">A JuryScan é para Todos.</h2>

            <div className="flex gap-4 mb-6">
              <button className="px-6 py-2 bg-[#633B48] text-white rounded-lg font-medium">Advogados</button>
              <button className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Clientes</button>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Nossa plataforma oferece soluções completas para advogados que desejam otimizar seus processos e para
              clientes que buscam acompanhar seus casos de forma transparente e eficiente.
            </p>

            <button className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-3 rounded-lg font-medium">
              Saiba +
            </button>
          </div>

          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            <div className="text-gray-400 text-6xl">×</div>
          </div>
        </div>
      </div>
    </section>
  )
}
