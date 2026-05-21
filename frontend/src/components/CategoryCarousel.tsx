'use client'

import { useRef, useState } from 'react'

interface Category {
  name: string
  slug: string
  description: string
  icon: React.ReactNode
}

const categories: Category[] = [
  {
    name: 'Anéis',
    slug: 'aneis',
    description: 'Delicados e únicos',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7"/>
        <circle cx="12" cy="12" r="3.5"/>
      </svg>
    ),
  },
  {
    name: 'Colares',
    slug: 'colares',
    description: 'Elegância ao colo',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5 Q12 9 19 5"/>
        <path d="M8.5 8 Q10 14 12 15 Q14 14 15.5 8"/>
        <circle cx="12" cy="17" r="2"/>
      </svg>
    ),
  },
  {
    name: 'Relógios',
    slug: 'relogios',
    description: 'Estilo no pulso',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7"/>
        <polyline points="12 8 12 12 15 13"/>
        <rect x="9" y="2" width="6" height="2.5" rx="1"/>
        <rect x="9" y="19.5" width="6" height="2.5" rx="1"/>
      </svg>
    ),
  },
  {
    name: 'Pulseiras',
    slug: 'pulseiras',
    description: 'Brilho no pulso',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Fragrâncias únicas',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="9" width="10" height="12" rx="2"/>
        <rect x="9" y="6" width="6" height="3" rx="1"/>
        <line x1="12" y1="3" x2="12" y2="6"/>
        <line x1="10.5" y1="4.5" x2="13.5" y2="4.5"/>
        <line x1="12" y1="13" x2="12" y2="16"/>
        <line x1="10.5" y1="14.5" x2="13.5" y2="14.5"/>
      </svg>
    ),
  },
  {
    name: 'Kits',
    slug: 'kits',
    description: 'Presentes especiais',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="1.5"/>
        <rect x="3" y="7" width="18" height="3" rx="1"/>
        <line x1="12" y1="7" x2="12" y2="21"/>
        <path d="M12 7 C11 5.5 8.5 5 8.5 7"/>
        <path d="M12 7 C13 5.5 15.5 5 15.5 7"/>
      </svg>
    ),
  },
]

interface Props {
  onCategorySelect?: (slug: string) => void
}

export function CategoryCarousel({ onCategorySelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a227]">Navegue</p>
          <h2 className="mt-1 text-2xl font-black sm:text-3xl" style={{ color: 'var(--c-text)' }}>
            Explore por categoria
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:opacity-30"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
            aria-label="Anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:opacity-30"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
            aria-label="Próximo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategorySelect?.(cat.slug)}
            className="group flex-none rounded-2xl border p-5 text-center transition hover:scale-[1.03] active:scale-95"
            style={{
              width: '152px',
              scrollSnapAlign: 'start',
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-glass)',
            } as React.CSSProperties}
          >
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110"
              style={{ backgroundColor: 'rgba(124, 58, 237, 0.10)', color: '#7c3aed' }}
            >
              {cat.icon}
            </div>
            <p className="font-bold text-sm" style={{ color: 'var(--c-text)' }}>{cat.name}</p>
            <p className="mt-1 text-[11px]" style={{ color: 'var(--c-dim)' }}>{cat.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
