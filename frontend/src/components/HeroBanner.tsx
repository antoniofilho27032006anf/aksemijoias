'use client'

import { useEffect, useState } from 'react'
import { api } from '../services/api'

const FALLBACK_SLIDES = [
  { id: 'f1', label: 'Nova coleção',    title: 'Rommanel — mais que\nMomentos, história!', cta: 'Ver coleção', color: '#7C3D8E', imageUrl: null },
  { id: 'f2', label: 'Brunna Semijoias', title: 'Beleza delicada\npara cada momento',      cta: 'Explorar',    color: '#C4509B', imageUrl: null },
  { id: 'f3', label: 'Prata 925',        title: 'Elegância que\nnão passa de moda',         cta: 'Descobrir',   color: '#8B6914', imageUrl: null },
]

const GRADIENT_MAP: Record<string, string> = {
  '#7C3D8E': 'linear-gradient(135deg, #f5eaff 0%, #e8d4f5 50%, #f0e0ff 100%)',
  '#C4509B': 'linear-gradient(135deg, #fff0f5 0%, #f5d4e8 50%, #ffe0ef 100%)',
  '#8B6914': 'linear-gradient(135deg, #fffae8 0%, #f5e8c4 50%, #fff3d0 100%)',
}

function getBg(color: string) {
  return GRADIENT_MAP[color] ?? `linear-gradient(135deg, #f5eaff 0%, #e8d4f5 50%, #f0e0ff 100%)`
}

interface Slide {
  id: string
  label: string
  title: string
  cta: string
  color: string
  imageUrl: string | null
}

export function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES)
  const [active, setActive] = useState(0)

  useEffect(() => {
    api.get('/banners')
      .then((r) => { if (r.data.length > 0) setSlides(r.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const slide = slides[active]

  return (
    <div
      className="relative overflow-hidden transition-all duration-700"
      style={{
        minHeight: '260px',
        background: slide.imageUrl ? undefined : getBg(slide.color),
      }}
    >
      {/* Full-image background */}
      {slide.imageUrl && (
        <>
          <img
            src={slide.imageUrl}
            alt={slide.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${slide.color}55 0%, ${slide.color}22 50%, ${slide.color}88 100%)` }}
          />
        </>
      )}

      <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.35em]"
          style={{ color: slide.imageUrl ? '#fff' : slide.color }}
        >
          {slide.label}
        </p>
        <h2
          className="mt-3 text-2xl font-black leading-snug sm:text-3xl"
          style={{
            color: slide.imageUrl ? '#fff' : slide.color,
            whiteSpace: 'pre-line',
            textShadow: slide.imageUrl ? '0 2px 12px rgba(0,0,0,0.5)' : 'none',
          }}
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
            key={s.id}
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
