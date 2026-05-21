'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { cart, openCart } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = searchTerm.trim()
    router.push(`/search?term=${encodeURIComponent(term)}&sort=bestseller`)
    setIsOpen(false)
  }

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-2xl transition-colors duration-300"
      style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-nav-bg)' }}
    >
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Logo + hamburger */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span
              className="text-2xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #c9a227 60%, #f0c040 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AK Semij&oacute;ias &amp; Tals
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: 'var(--c-dim)' }}>
              J&oacute;ias Banhadas a Ouro 18K
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((state) => !state)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:scale-105 md:hidden"
            style={{ borderColor: 'var(--c-border-mid)', backgroundColor: 'var(--c-glass)', color: '#a78bfa' }}
            aria-label="Abrir menu"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="6" width="12" height="2" rx="1" fill="currentColor"/>
              <rect y="12" width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: '/', label: 'Loja' },
            { href: '/favorites', label: 'Favoritas' },
            { href: '/orders', label: 'Pedidos' },
            { href: '/search', label: 'Buscar' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition hover:text-[#e8c94a]"
              style={{ color: 'var(--c-muted)' }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/account"
              className="rounded-lg px-3 py-2 text-sm font-medium transition hover:text-[#e8c94a]"
              style={{ color: 'var(--c-muted)' }}
            >
              Minha conta
            </Link>
          ) : null}
          {(user as any)?.role === 'ADMIN' ? (
            <Link
              href="/admin"
              className="rounded-lg border px-3 py-2 text-sm font-semibold text-[#e8c94a] transition"
              style={{ borderColor: 'var(--c-border-gold)', backgroundColor: 'rgba(201,162,39,0.08)' }}
            >
              Admin
            </Link>
          ) : null}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — desktop only */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-[#0a0612] transition hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#06040c] px-1 text-xs font-black text-[#e8c94a]">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs" style={{ color: 'var(--c-muted)' }}>
                Ol&aacute;, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="rounded-xl border px-3 py-2 text-xs font-semibold transition hover:text-[#e8c94a]"
                style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl border px-4 py-2 text-xs font-semibold transition hover:text-[#e8c94a] md:inline-flex"
              style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen ? (
        <div
          className="mx-4 mb-4 overflow-hidden rounded-2xl border shadow-[0_32px_80px_rgba(0,0,0,0.6)] md:hidden"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass-deep)' }}
        >
          <form
            onSubmit={handleSearch}
            className="flex gap-2 border-b p-4"
            style={{ borderColor: 'var(--c-border)' }}
          >
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar joias..."
              className="min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm text-white outline-none"
              style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input)' }}
            />
            <button
              type="submit"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#0a0612]"
              style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
            >
              Ir
            </button>
          </form>

          <nav className="flex flex-col p-2">
            {[
              { href: '/', label: 'Loja' },
              { href: '/favorites', label: 'Favoritas' },
              { href: '/orders', label: 'Meus pedidos' },
              { href: '/search', label: 'Buscar produtos' },
              ...(user ? [{ href: '/account', label: 'Minha conta' }] : [{ href: '/login', label: 'Entrar' }]),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:text-[#e8c94a]"
                style={{ color: 'var(--c-muted)' }}
              >
                {link.label}
              </Link>
            ))}
            {(user as any)?.role === 'ADMIN' ? (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="mx-2 my-1 rounded-xl border px-4 py-3 text-sm font-semibold text-[#e8c94a]"
                style={{ borderColor: 'var(--c-border-gold)', backgroundColor: 'rgba(201,162,39,0.08)' }}
              >
                Painel Admin
              </Link>
            ) : null}
            {user ? (
              <button
                onClick={() => { logout(); setIsOpen(false) }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:text-red-400"
                style={{ color: 'var(--c-dim)' }}
              >
                Sair
              </button>
            ) : null}
          </nav>

          {/* Theme toggle — mobile menu footer */}
          <div
            className="flex items-center justify-between border-t px-4 py-3"
            style={{ borderColor: 'var(--c-border)' }}
          >
            <span className="text-xs" style={{ color: 'var(--c-dim)' }}>Tema</span>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  )
}
