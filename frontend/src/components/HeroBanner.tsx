'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../services/api'

interface Slide {
  id: string
  imageUrl: string | null
  color: string
}

const FALLBACK_SLIDES: Slide[] = [
  { id: 'f1', imageUrl: null, color: '#7C3D8E' },
  { id: 'f2', imageUrl: null, color: '#C4509B' },
  { id: 'f3', imageUrl: null, color: '#8B6914' },
]

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

  function prev() {
    setActive((i) => (i - 1 + slides.length) % slides.length)
  }

  function next() {
    setActive((i) => (i + 1) % slides.length)
  }

  const slide = slides[active]

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-2xl bg-gray-100 sm:mx-5 sm:mt-4" style={{ aspectRatio: '16/6', minHeight: '160px' }}>
      <div className="relative h-full w-full">

        {/* Image or gradient */}
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt={`Banner ${active + 1}`}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
        ) : (
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{ background: `linear-gradient(135deg, ${slide.color}22 0%, ${slide.color}44 50%, ${slide.color}22 100%)` }}
          />
        )}

        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition hover:bg-white active:scale-95 sm:h-9 sm:w-9"
        >
          <ChevronLeft size={16} strokeWidth={2.5} style={{ color: 'var(--color-brand)' }} />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          aria-label="Próximo"
          className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition hover:bg-white active:scale-95 sm:h-9 sm:w-9"
        >
          <ChevronRight size={16} strokeWidth={2.5} style={{ color: 'var(--color-brand)' }} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                height: '6px',
                width: active === i ? '20px' : '6px',
                backgroundColor: active === i ? 'var(--color-brand)' : 'rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
