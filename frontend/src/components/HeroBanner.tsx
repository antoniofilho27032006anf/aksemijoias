'use client'

import { useEffect, useState } from 'react'
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
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '16/6', minHeight: '160px' }}>

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
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow-md transition hover:bg-white active:scale-95 sm:h-10 sm:w-10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Próximo"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow-md transition hover:bg-white active:scale-95 sm:h-10 sm:w-10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
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
              height: '8px',
              width: active === i ? '20px' : '8px',
              backgroundColor: active === i ? '#333' : 'rgba(0,0,0,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
