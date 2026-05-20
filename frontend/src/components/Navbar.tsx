'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

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
    <header className="sticky top-0 z-30 bg-[#09040d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-violet-400 to-white">
              AKsemijoias
            </h1>
            <p className="mt-1 text-sm text-slate-300">Peças femininas, leves e cheias de charme.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((state) => !state)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/" className="transition hover:text-white text-slate-200">
            Loja
          </Link>
          <Link href="/favorites" className="transition hover:text-white text-slate-200">
            Favoritas
          </Link>
          <Link href="/checkout" className="transition hover:text-white text-slate-200">
            Checkout
          </Link>
          <Link href="/orders" className="transition hover:text-white text-slate-200">
            Meus pedidos
          </Link>
          <Link href="/search" className="transition hover:text-white text-slate-200">
            Buscar
          </Link>
          {user ? (
            <Link href="/account" className="transition hover:text-white text-slate-200">
              Minha conta
            </Link>
          ) : null}
          {(user as any)?.role === 'ADMIN' ? (
            <Link href="/admin" className="rounded-full bg-pink-500/20 px-4 py-2 text-sm font-semibold text-pink-300 transition hover:bg-pink-500/30">
              Painel Admin
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90"
          >
            🛒 {totalItems}
          </button>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-pink-200">Olá, {user.name}</span>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="mx-auto mt-2 max-w-[1320px] rounded-[2rem] border border-white/10 bg-slate-950/95 px-6 py-5 shadow-[0_40px_120px_rgba(0,0,0,0.4)] md:hidden">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar joias..."
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
            />
            <button className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95">
              Buscar
            </button>
          </form>

          <nav className="mt-5 flex flex-col gap-3 text-sm text-slate-200">
            <Link href="/" className="rounded-full px-4 py-3 transition hover:bg-white/5">Loja</Link>
            <Link href="/favorites" className="rounded-full px-4 py-3 transition hover:bg-white/5">Favoritas</Link>
            <Link href="/checkout" className="rounded-full px-4 py-3 transition hover:bg-white/5">Checkout</Link>
            <Link href="/orders" className="rounded-full px-4 py-3 transition hover:bg-white/5">Meus pedidos</Link>
            <Link href="/search" className="rounded-full px-4 py-3 transition hover:bg-white/5">Buscar</Link>
            {user ? (
              <Link href="/account" className="rounded-full px-4 py-3 transition hover:bg-white/5">Minha conta</Link>
            ) : (
              <Link href="/login" className="rounded-full px-4 py-3 transition hover:bg-white/5">Login</Link>
            )}
            {(user as any)?.role === 'ADMIN' ? (
              <Link href="/admin" className="rounded-full bg-pink-500/20 px-4 py-3 font-semibold text-pink-300 transition hover:bg-pink-500/30">Painel Admin</Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
