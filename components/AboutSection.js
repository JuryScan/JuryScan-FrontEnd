"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function AboutSection() {
  const [tab, setTab] = useState('adv') // 'adv' | 'client'

  const content = {
    adv: {
      title: 'A JuryScan é para Todos',
      lead:
          'Nossa plataforma oferece soluções completas para advogados que desejam otimizar seus processos e para clientes que buscam acompanhar seus casos de forma transparente e eficiente.',
      img: '/lawyer.jpg',
      alt: 'Advogados',
    },
    client: {
      title: 'A JuryScan é para Todos',
      lead:
          'Com a JuryScan, clientes acompanham seus processos em tempo real, recebem atualizações e se comunicam facilmente com seus advogados poupando tempo para aprojeitar da melhor maneira com aqueles que amam.',
      img: '/happyFamily.jpg',
      alt: 'Clientes',
    },
  }

  const activeClass = (value) =>
      value === tab
          ? 'px-6 py-2 bg-[#633B48] text-white rounded-lg font-medium'
          : 'px-6 py-2 text-gray-600 hover:text-gray-900 rounded-lg font-medium'

  return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{content[tab].title}</h2>

              <div className="flex gap-4 mb-6">
                <button
                    type="button"
                    aria-pressed={tab === 'adv'}
                    onClick={() => setTab('adv')}
                    className={activeClass('adv')}
                >
                  Advogados
                </button>

                <button
                    type="button"
                    aria-pressed={tab === 'client'}
                    onClick={() => setTab('client')}
                    className={activeClass('client')}
                >
                  Clientes
                </button>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">{content[tab].lead}</p>
            </div>

            <div className="h-80">
              <div className="relative h-full rounded-lg overflow-hidden bg-gray-200">
                <Image
                    src={content[tab].img}
                    alt={content[tab].alt}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}