'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { CATEGORIES } from '../data/categories'

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

  const activeSubs = open ? (CATEGORIES.find((c) => c.name === open)?.sub ?? []) : []

  return (
    <div ref={barRef} className="relative z-20">

      {/* Purple category strip */}
      <div
        className="flex overflow-x-auto"
        style={{ backgroundColor: '#7C3D8E', scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => {
          const isOpen = open === cat.name
          return (
            <button
              key={cat.name}
              onClick={() =>
                cat.sub.length === 0
                  ? navigate(cat.name)
                  : setOpen(isOpen ? null : cat.name)
              }
              className="flex flex-none items-center gap-0.5 whitespace-nowrap px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-widest transition"
              style={{
                color: '#fff',
                backgroundColor: isOpen ? 'rgba(0,0,0,0.20)' : 'transparent',
                borderBottom: isOpen ? '2px solid #fff' : '2px solid transparent',
              }}
            >
              {cat.name}
              {cat.sub.length > 0 && (
                <svg
                  width="7" height="7" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    opacity: 0.8,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Dropdown */}
      {open && activeSubs.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl">
          <div className="h-0.5 w-full" style={{ backgroundColor: '#7C3D8E' }} />

          <div className="p-2">
            <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.3em]" style={{ color: '#7C3D8E' }}>
              {open}
            </p>
            <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6">
              {activeSubs.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => navigate(sub.name)}
                  className="overflow-hidden rounded-md border px-2 py-1.5 text-left text-[8px] font-bold uppercase leading-tight tracking-wide transition-all duration-200 hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
                  style={{
                    borderColor: '#e8d8f5',
                    backgroundColor: '#faf5ff',
                    color: '#6B2F7D',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = '#7C3D8E'
                    el.style.borderColor = '#7C3D8E'
                    el.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = '#faf5ff'
                    el.style.borderColor = '#e8d8f5'
                    el.style.color = '#6B2F7D'
                  }}
                >
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
