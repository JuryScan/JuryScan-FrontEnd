export default function StatsSection() {
  const stats = [
    {
      number: "1 Milhão",
      description: "De beneficiários atendidos em todo o Brasil",
    },
    {
      number: "4 anos",
      description: "Tempo médio de espera por um processo no INSS",
    },
    {
      number: "200 mil",
      description: "Processos analisados em nossa base",
    },
    {
      number: "3 meses",
      description: "Tempo médio para conclusão de processos analisados",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#633B48] mb-2">{stat.number}</div>
              <p className="text-gray-600 text-sm leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
