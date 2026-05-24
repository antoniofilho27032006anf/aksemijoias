'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { CategoryBar } from './CategoryBar'
import { CATEGORIES } from '../data/categories'

interface NavbarProps {
  onSearch?: (term: string) => void
}

export function Navbar({ onSearch }: NavbarProps) {
  const { cart, openCart } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  function handleSearch(e: { preventDefault: () => void }) {
    e.preventDefault()
    const q = searchTerm.trim()
    if (onSearch) {
      onSearch(q)
      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/search?term=${encodeURIComponent(q)}&sort=bestseller`)
    }
    setMenuOpen(false)
  }

  function navigateTo(term: string) {
    setMenuOpen(false)
    setExpandedCat(null)
    router.push(`/search?term=${encodeURIComponent(term)}&sort=bestseller`)
  }

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">

      {/* Main nav row — 3-column grid keeps logo perfectly centered on all sizes */}
      <div className="grid grid-cols-3 items-center px-4 py-2.5 sm:px-6">

        {/* Left: hamburger + MENU */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-[#7C3D8E]"
          aria-label="Menu"
        >
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <rect width="22" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="7.5" width="15" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="15" width="22" height="2.5" rx="1.25" fill="currentColor"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest">MENU</span>
        </button>

        {/* Center: Logo */}
        <Link href="/" className="flex justify-center">
          <img
            src="/logo.png"
            alt="AK Semijóias"
            className="h-9 w-auto object-contain"
            style={{ maxWidth: '120px' }}
          />
        </Link>

        {/* Right: conta + carrinho */}
        <div className="flex items-center justify-end gap-3">

          <Link
            href={user ? '/account' : '/login'}
            className="flex flex-col items-center text-[#7C3D8E] transition hover:text-[#C4509B]"
            aria-label={user ? 'Minha conta' : 'Entrar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span className="text-[8px] font-bold uppercase tracking-wide leading-none mt-0.5">
              {user ? 'Conta' : 'Entrar'}
            </span>
          </Link>

          <button
            onClick={openCart}
            className="relative flex items-center gap-1 text-[#7C3D8E]"
            aria-label="Carrinho"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full text-[11px] font-black text-white"
              style={{ backgroundColor: '#C4509B' }}
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Search row */}
      <form onSubmit={handleSearch} className="flex border-t border-gray-100">
        <div className="relative flex flex-1 items-center">
          <svg
            className="absolute left-4 text-gray-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center border-l border-gray-100 bg-gray-50 px-4"
          aria-label="Buscar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </form>

      {/* Category bar strip */}
      <CategoryBar />

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 max-h-[80vh] overflow-y-auto border-t border-gray-100 bg-white shadow-xl">

          {/* Nav links */}
          <nav className="divide-y divide-gray-50 px-2">
            {[
              { href: '/', label: 'Loja' },
              { href: '/favorites', label: 'Favoritas' },
              { href: '/orders', label: 'Meus pedidos' },
              ...(user
                ? [{ href: '/account', label: 'Minha conta' }]
                : [{ href: '/login', label: 'Entrar' }]),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3.5 text-sm font-medium text-gray-700 transition hover:text-[#7C3D8E]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Categories section */}
          <div className="border-t border-gray-100 px-4 pt-3 pb-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Categorias
            </p>
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="border-b border-gray-50 last:border-0">

                {/* Category header */}
                <button
                  onClick={() => {
                    if (cat.sub.length === 0) {
                      navigateTo(cat.name)
                    } else {
                      setExpandedCat(expandedCat === cat.name ? null : cat.name)
                    }
                  }}
                  className="flex w-full items-center justify-between py-3.5 text-sm font-semibold text-gray-700 transition hover:text-[#7C3D8E]"
                >
                  {cat.name}
                  {cat.sub.length > 0 && (
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        transform: expandedCat === cat.name ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: '#7C3D8E',
                      }}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  )}
                </button>

                {/* Subcategories */}
                {expandedCat === cat.name && cat.sub.length > 0 && (
                  <div className="mb-2 flex flex-col gap-0.5 pl-3">
                    {cat.sub.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => navigateTo(sub.name)}
                        className="py-2 text-left text-xs font-medium text-gray-500 transition hover:text-[#C4509B]"
                      >
                        — {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Admin + logout */}
          {(user as any)?.role === 'ADMIN' && (
            <div className="border-t border-gray-100 px-2 py-2">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-bold text-[#7C3D8E]"
              >
                Painel Admin
              </Link>
            </div>
          )}
          {user && (
            <div className="border-t border-gray-100 px-2 py-2">
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="block w-full px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:text-red-600"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
