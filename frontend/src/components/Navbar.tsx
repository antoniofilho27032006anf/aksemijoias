'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from 'lucide-react'

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
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    setDrawerOpen(false)
  }

  function navigateTo(term: string) {
    setDrawerOpen(false)
    setExpandedCat(null)
    router.push(`/search?term=${encodeURIComponent(term)}&sort=bestseller`)
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur" style={{ background: 'var(--c-nav-bg)', borderBottom: '1px solid var(--c-border)' }}>

      {/* Main row */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:py-3.5">

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="-ml-1 flex items-center justify-center rounded-full p-1.5 transition hover:bg-[var(--c-hover-soft)] lg:hidden"
          style={{ color: 'var(--color-brand)' }}
          aria-label="Abrir menu"
        >
          <Menu size={22} strokeWidth={1.6} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="AK Semijóias"
            className="h-8 w-auto object-contain lg:h-10"
            style={{ maxWidth: '140px' }}
          />
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="relative ml-4 hidden max-w-md flex-1 lg:block">
          <Search
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--c-vdim)' }}
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar joias, coleções..."
            className="w-full rounded-full border py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-brand)]"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-soft)', color: 'var(--c-text)' }}
          />
        </form>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-4 lg:gap-6">
          <Link
            href={user ? '/account' : '/login'}
            className="flex flex-col items-center gap-0.5 transition hover:text-[var(--color-brand-pink)]"
            style={{ color: 'var(--color-brand)' }}
            aria-label={user ? 'Minha conta' : 'Entrar'}
          >
            <User size={20} strokeWidth={1.6} />
            <span className="hidden text-[9px] font-bold uppercase tracking-widest leading-none lg:block">
              {user ? 'Conta' : 'Entrar'}
            </span>
          </Link>

          <button
            onClick={openCart}
            className="relative flex flex-col items-center gap-0.5 transition hover:text-[var(--color-brand-pink)]"
            style={{ color: 'var(--color-brand)' }}
            aria-label="Carrinho"
          >
            <span className="relative">
              <ShoppingBag size={20} strokeWidth={1.6} />
              <span
                className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black text-white"
                style={{ backgroundColor: 'var(--color-brand-pink)' }}
              >
                {totalItems}
              </span>
            </span>
            <span className="hidden text-[9px] font-bold uppercase tracking-widest leading-none lg:block">
              Sacola
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      <form onSubmit={handleSearch} className="px-4 pb-3 lg:hidden">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--c-vdim)' }}
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-brand)]"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-soft)', color: 'var(--c-text)' }}
          />
        </div>
      </form>

      {/* Category nav / subcategory dropdown — shared desktop + mobile */}
      <CategoryBar />

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="animate-slide-in-left fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col overflow-y-auto shadow-2xl lg:hidden"
          style={{ background: 'var(--c-bg)' }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b px-4 py-3.5" style={{ borderColor: 'var(--c-border)' }}>
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              <img src="/logo.png" alt="AK Semijóias" className="h-8 w-auto object-contain" style={{ maxWidth: '120px' }} />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--c-hover-soft)]"
              style={{ color: 'var(--color-brand)' }}
              aria-label="Fechar menu"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="px-4 py-3.5">
            <div className="relative">
              <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--c-vdim)' }} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-brand)]"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-soft)', color: 'var(--c-text)' }}
              />
            </div>
          </form>

          {/* Nav links */}
          <nav className="flex flex-col border-b px-4 pb-2" style={{ borderColor: 'var(--c-border)' }}>
            {[
              { href: '/', label: 'Início' },
              { href: '/favorites', label: 'Favoritas' },
              { href: '/orders', label: 'Meus pedidos' },
              ...(user
                ? [{ href: '/account', label: 'Minha conta' }]
                : [{ href: '/login', label: 'Entrar' }]),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="py-2.5 text-sm font-medium transition hover:text-[var(--color-brand)]"
                style={{ color: 'var(--c-text)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Categories accordion */}
          <div className="flex-1 px-4 pt-3 pb-1">
            <p className="mb-1 font-heading text-sm font-semibold tracking-wide" style={{ color: 'var(--color-brand)' }}>
              Categorias
            </p>
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="border-b last:border-0" style={{ borderColor: 'var(--c-border)' }}>
                <button
                  onClick={() => {
                    if (cat.sub.length === 0) {
                      navigateTo(cat.name)
                    } else {
                      setExpandedCat(expandedCat === cat.name ? null : cat.name)
                    }
                  }}
                  className="flex w-full items-center justify-between py-3 text-sm font-medium transition hover:text-[var(--color-brand)]"
                  style={{ color: 'var(--c-text)' }}
                >
                  {cat.name}
                  {cat.sub.length > 0 && (
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      className="transition-transform duration-200"
                      style={{
                        transform: expandedCat === cat.name ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: 'var(--color-brand)',
                      }}
                    />
                  )}
                </button>

                {expandedCat === cat.name && cat.sub.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5 pl-1 pb-2">
                    {cat.sub.map((sub) => (
                      <button key={sub.name} onClick={() => navigateTo(sub.name)} className="chip">
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Admin + logout */}
          {(user as any)?.role === 'ADMIN' && (
            <div className="border-t px-4 py-2" style={{ borderColor: 'var(--c-border)' }}>
              <Link
                href="/admin"
                onClick={() => setDrawerOpen(false)}
                className="block py-2.5 text-sm font-bold"
                style={{ color: 'var(--color-brand)' }}
              >
                Painel Admin
              </Link>
            </div>
          )}
          {user && (
            <div className="border-t px-4 py-2" style={{ borderColor: 'var(--c-border)' }}>
              <button
                onClick={() => { logout(); setDrawerOpen(false) }}
                className="block w-full py-2.5 text-left text-sm font-medium text-red-400 transition hover:text-red-600"
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
