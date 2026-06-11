'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { CATEGORIES, type MainCategory } from '../data/categories'

export function CategoryBar() {
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function navigate(term: string) {
    setOpen(null)
    router.push(`/search?term=${encodeURIComponent(term)}&sort=bestseller`)
  }

  function handleToggle(cat: MainCategory) {
    if (cat.sub.length === 0) {
      navigate(cat.name)
    } else {
      setOpen((o) => (o === cat.name ? null : cat.name))
    }
  }

  const activeSubs = open ? (CATEGORIES.find((c) => c.name === open)?.sub ?? []) : []

  return (
    <div
      ref={barRef}
      className="relative z-20 border-b"
      style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg)' }}
      onMouseLeave={() => setOpen(null)}
    >
      {/* Category nav row — horizontal scroll on mobile, centered on desktop */}
      <nav
        className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 lg:justify-center lg:gap-2 lg:px-6"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        <Link
          href="/"
          className="flex-none whitespace-nowrap border-b-2 border-transparent px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-[var(--color-brand)] lg:px-3"
          style={{ color: 'var(--c-muted)' }}
        >
          Início
        </Link>

        {CATEGORIES.map((cat) => {
          const isOpen = open === cat.name
          return (
            <button
              key={cat.name}
              onMouseEnter={() => cat.sub.length > 0 && setOpen(cat.name)}
              onClick={() => handleToggle(cat)}
              className="flex flex-none items-center gap-1 whitespace-nowrap border-b-2 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-[var(--color-brand)] lg:px-3"
              style={{
                color: isOpen ? 'var(--color-brand)' : 'var(--c-muted)',
                borderColor: isOpen ? 'var(--color-brand)' : 'transparent',
              }}
            >
              {cat.name}
              {cat.sub.length > 0 && (
                <ChevronDown
                  size={12}
                  strokeWidth={2.5}
                  className="transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Subcategory dropdown panel */}
      {open && activeSubs.length > 0 && (
        <div
          className="animate-fade-in absolute inset-x-0 top-full z-50 border-t shadow-lg"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-soft)' }}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="font-heading text-lg font-semibold tracking-wide" style={{ color: 'var(--color-brand)' }}>
                {open}
              </span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--c-border-mid), transparent)' }} />
            </div>

            <div className="flex flex-wrap gap-2">
              {activeSubs.map((sub) => (
                <button key={sub.name} onClick={() => navigate(sub.name)} className="chip">
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
