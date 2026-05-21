'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const slides = [
  {
    badge: 'Novo lançamento',
    title: 'Coleção Celestial',
    description: 'Peças com brilho lunar, design delicado e acabamento em ouro 18k para um toque sofisticado em qualquer look.',
    cta: 'Ver coleção',
    accent: '#7c3aed',
  },
  {
    badge: 'Mais vendidos',
    title: 'Anéis de Assinatura',
    description: 'Designs únicos com textura suave e acabamento premium em prata 925. Elegância que se adapta ao seu estilo.',
    cta: 'Explorar anéis',
    accent: '#c9a227',
  },
  {
    badge: 'Edição limitada',
    title: 'Brincos Românticos',
    description: 'Combinações leves e delicadas para ocasiões especiais e uso diário — porque você merece brilhar sempre.',
    cta: 'Descubra',
    accent: '#9333ea',
  },
]

export function BannerCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[activeSlide]

  return (
    <section className="mt-12 overflow-hidden rounded-2xl border border-[rgba(120,60,220,0.2)] bg-[#080514]">
      {/* Top gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-50" />

      <div className="relative grid gap-6 p-6 sm:grid-cols-[1fr,auto] sm:items-center sm:p-10">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${slide.accent}55, transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative space-y-4">
          <span
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{
              borderColor: `${slide.accent}40`,
              backgroundColor: `${slide.accent}12`,
              color: slide.accent === '#c9a227' ? '#e8c94a' : '#a78bfa',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: slide.accent === '#c9a227' ? '#e8c94a' : '#a78bfa' }} />
            {slide.badge}
          </span>

          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {slide.title}
          </h2>

          <p className="max-w-lg text-sm leading-relaxed text-[#8070a8] sm:text-base">
            {slide.description}
          </p>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#0a0612] transition hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
          >
            {slide.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Right card */}
        <div className="hidden sm:block">
          <div className="relative w-64 overflow-hidden rounded-2xl border border-[rgba(120,60,220,0.2)] bg-[rgba(12,8,28,0.9)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div
              className="absolute inset-0 opacity-15"
              style={{ background: `radial-gradient(circle at 50% 0%, ${slide.accent}, transparent 70%)` }}
            />
            <div className="relative space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a227]">Premium</p>
              <p className="text-lg font-bold leading-snug text-white">Brilho intenso, conforto leve</p>
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(120,60,220,0.3)] to-transparent" />
              <div className="space-y-1.5">
                {['Entrega rápida', 'Embalagem presente', 'Garantia de qualidade'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-[#7c6fa0]">
                    <span className="h-1 w-1 rounded-full bg-[#c9a227]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between border-t border-[rgba(120,60,220,0.1)] px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeSlide === index ? '28px' : '8px',
                background: activeSlide === index
                  ? 'linear-gradient(90deg, #c9a227, #e8c94a)'
                  : 'rgba(120,60,220,0.25)',
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
        <span className="text-xs text-[#5a4f7a]">{activeSlide + 1} / {slides.length}</span>
      </div>
    </section>
  )
}
