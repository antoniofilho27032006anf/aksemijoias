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
        className="flex items-center justify-start gap-1.5 overflow-x-auto px-2 py-1.5 sm:justify-center sm:px-4"
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
              className="flex flex-none items-center gap-0.5 whitespace-nowrap rounded-sm px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-widest transition-all duration-150"
              style={{
                color: '#fff',
                border: '1px solid',
                borderColor: isOpen ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.22)',
                backgroundColor: isOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
              }}
            >
              {cat.name}
              {cat.sub.length > 0 && (
                <svg
                  width="6" height="6" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    opacity: 0.75,
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
        <div
          className="absolute left-0 right-0 top-full z-50 bg-white"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.13)' }}
        >
          {/* Top accent */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(to right, #7C3D8E, #C4509B)' }} />

          <div className="mx-auto max-w-4xl px-4 py-3">

            {/* Header */}
            <div className="mb-2.5 flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: '#7C3D8E' }}>
                ◆ {open}
              </span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, #d4b8e8, transparent)' }} />
            </div>

            {/* Pill chips */}
            <div className="flex flex-wrap gap-1.5">
              {activeSubs.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => navigate(sub.name)}
                  className="group relative overflow-hidden rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-wide transition-all duration-150 active:scale-95"
                  style={{
                    borderColor: '#d4b8e8',
                    backgroundColor: '#faf5ff',
                    color: '#6B2F7D',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'linear-gradient(135deg, #7C3D8E, #C4509B)'
                    el.style.borderColor = '#7C3D8E'
                    el.style.color = '#fff'
                    el.style.boxShadow = '0 2px 8px rgba(124,61,142,0.30)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.background = '#faf5ff'
                    el.style.borderColor = '#d4b8e8'
                    el.style.color = '#6B2F7D'
                    el.style.boxShadow = 'none'
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
