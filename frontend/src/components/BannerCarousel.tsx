'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const slides = [
  {
    title: 'Coleção Celestial',
    description: 'Peças com brilho lunar, perfeitas para um toque sofisticado em qualquer look.',
    cta: 'Ver coleção',
    badge: 'Novo lançamento',
    variant: 'from-violet-500 via-fuchsia-500 to-pink-500'
  },
  {
    title: 'Anéis de assinatura',
    description: 'Designs delicados com textura suave e acabamento premium em prata 925.',
    cta: 'Explorar anéis',
    badge: 'Mais vendidos',
    variant: 'from-pink-500 via-purple-500 to-slate-900'
  },
  {
    title: 'Brincos Românticos',
    description: 'Combinações leves para ocasiões especiais e uso diário.',
    cta: 'Descubra',
    badge: 'Edição limitada',
    variant: 'from-fuchsia-500 via-violet-500 to-slate-900'
  }
]

export function BannerCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(145,92,255,0.14)]">
      <div className="relative flex min-h-[280px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4 text-white">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-pink-200">
            {slides[activeSlide].badge}
          </span>
          <h2 className="text-4xl font-black leading-tight sm:text-5xl">{slides[activeSlide].title}</h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {slides[activeSlide].description}
          </p>
          <Link
            href="/search"
            className="inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95"
          >
            {slides[activeSlide].cta}
          </Link>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[2rem] bg-gradient-to-br to-slate-950 from-slate-900 p-4 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]">
          <div className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${slides[activeSlide].variant} opacity-70 blur-2xl`} />
          <div className="relative grid h-full place-items-center gap-8 p-4 text-white">
            <div className="grid gap-3">
              <span className="text-sm uppercase tracking-[0.35em] text-pink-200">Premium</span>
              <p className="text-3xl font-bold sm:text-4xl">Brilho Intenso, Conforto Leve</p>
            </div>
            <div className="grid gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.20)]">
              <p className="font-medium text-white">Experiência de compra</p>
              <p className="text-slate-400">Entrega rápida, atendimento personalizado e embalagens para presente.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`h-2 w-8 rounded-full transition ${activeSlide === index ? 'bg-white' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
