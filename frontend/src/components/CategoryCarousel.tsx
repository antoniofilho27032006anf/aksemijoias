'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { CATEGORIES } from '../data/categories'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Brincos': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7 L10.5 13 Q9.5 18 12 19.5 Q14.5 18 13.5 13 Z"/>
    </svg>
  ),
  'Argolas': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="7" ry="8"/>
      <ellipse cx="12" cy="12" rx="3.5" ry="4.5"/>
    </svg>
  ),
  'Anéis': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  'Correntes': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  'Pulseiras': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  'Alianças': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5"/>
      <circle cx="15" cy="12" r="5"/>
    </svg>
  ),
  'Kits Brincos': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="11" rx="1.5"/>
      <rect x="3" y="7" width="18" height="3" rx="1"/>
      <line x1="12" y1="7" x2="12" y2="21"/>
      <path d="M12 7 C11 5.5 8.5 5 8.5 7"/>
      <path d="M12 7 C13 5.5 15.5 5 15.5 7"/>
    </svg>
  ),
}

interface Props {
  onCategorySelect?: (name: string) => void
}

export function CategoryCarousel({ onCategorySelect }: Props) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -170 : 170, behavior: 'smooth' })
  }

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  function navigate(name: string) {
    if (onCategorySelect) {
      onCategorySelect(name)
    } else {
      router.push(`/search?term=${encodeURIComponent(name)}&sort=bestseller`)
    }
  }

  return (
    <section className="mt-6 px-3 sm:px-5">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }} />
          <span className="font-heading text-base font-semibold tracking-wide" style={{ color: 'var(--color-brand)' }}>
            Categorias
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex h-7 w-7 items-center justify-center rounded-full border transition hover:border-[var(--color-brand)] hover:bg-[var(--c-hover-soft)] disabled:opacity-30"
            style={{ borderColor: 'var(--c-border)', color: 'var(--color-brand)' }}
            aria-label="Anterior"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex h-7 w-7 items-center justify-center rounded-full border transition hover:border-[var(--color-brand)] hover:bg-[var(--c-hover-soft)] disabled:opacity-30"
            style={{ borderColor: 'var(--c-border)', color: 'var(--color-brand)' }}
            aria-label="Próximo"
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-2.5 overflow-x-auto pb-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => navigate(cat.name)}
            className="group flex w-[72px] flex-none flex-col items-center justify-center gap-1.5 rounded-xl border bg-[var(--c-bg-soft)] py-3 text-center transition-all duration-200 hover:border-[var(--color-brand)] hover:shadow-md active:scale-95"
            style={{ scrollSnapAlign: 'start', borderColor: 'var(--c-border)' }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: 'var(--c-hover-soft)', color: 'var(--color-brand)' }}
            >
              {CATEGORY_ICONS[cat.name] ?? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="7"/>
                </svg>
              )}
            </div>
            <p className="px-1 text-[9px] font-semibold uppercase leading-tight tracking-wide" style={{ color: 'var(--color-brand)' }}>
              {cat.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
