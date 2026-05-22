'use client'

import { useEffect, useState } from 'react'

const slides = [
  {
    bg: 'linear-gradient(135deg, #f5eaff 0%, #e8d4f5 50%, #f0e0ff 100%)',
    label: 'Nova coleção',
    title: 'Rommanel — mais que\nmomentos, história!',
    cta: 'Ver coleção',
    color: '#7C3D8E',
  },
  {
    bg: 'linear-gradient(135deg, #fff0f5 0%, #f5d4e8 50%, #ffe0ef 100%)',
    label: 'Brunna Semijoias',
    title: 'Beleza delicada\npara cada momento',
    cta: 'Explorar',
    color: '#C4509B',
  },
  {
    bg: 'linear-gradient(135deg, #fffae8 0%, #f5e8c4 50%, #fff3d0 100%)',
    label: 'Prata 925',
    title: 'Elegância que\nnão passa de moda',
    cta: 'Descobrir',
    color: '#8B6914',
  },
]

export function HeroBanner() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]

  return (
    <div
      className="relative overflow-hidden transition-all duration-700"
      style={{ background: slide.bg, minHeight: '260px' }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.35em]"
          style={{ color: slide.color }}
        >
          {slide.label}
        </p>
        <h2
          className="mt-3 text-2xl font-black leading-snug sm:text-3xl"
          style={{ color: slide.color, whiteSpace: 'pre-line' }}
        >
          {slide.title}
        </h2>
        <a
          href="#produtos"
          className="mt-6 rounded-full px-8 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: slide.color }}
        >
          {slide.cta}
        </a>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              height: '10px',
              width: active === i ? '24px' : '10px',
              backgroundColor: active === i ? slide.color : `${slide.color}55`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
