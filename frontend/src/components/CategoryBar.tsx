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

  return (
    <div ref={barRef} className="relative z-20 border-b border-gray-100 bg-white">

      {/* Category tabs strip */}
      <div
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => {
          const isOpen = open === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => {
                if (cat.sub.length === 0) {
                  navigate(cat.name)
                } else {
                  setOpen(isOpen ? null : cat.name)
                }
              }}
              className="flex flex-none items-center gap-1 whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-wider transition"
              style={{
                color: isOpen ? '#7C3D8E' : '#555',
                borderBottom: isOpen ? '2px solid #7C3D8E' : '2px solid transparent',
              }}
            >
              {cat.name}
              {cat.sub.length > 0 && (
                <svg
                  width="9" height="9" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
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
      {open && (() => {
        const subs = CATEGORIES.find((c) => c.name === open)?.sub ?? []
        if (subs.length === 0) return null
        return (
          <div className="absolute left-0 right-0 top-full border-t border-gray-100 bg-white shadow-xl">
            <div className="flex flex-wrap gap-2 px-5 py-4">
              {subs.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => navigate(sub.name)}
                  className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition hover:bg-[#7C3D8E] hover:text-white"
                  style={{ borderColor: '#C4B0D4', color: '#7C3D8E' }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
