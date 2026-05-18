'use client'

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const { cart, openCart } = useCart()
  const { user, logout } = useAuth()

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="sticky top-0 z-30 mx-auto w-full max-w-[1320px] px-6 py-5 backdrop-blur-xl sm:px-10">
      <div className="glass-card flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[#0b0410]/70 px-6 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-violet-400 to-white">
            AKsemijoias
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Peças femininas, leves e cheias de charme.</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-300 md:text-base">

  <a
    href="#produtos"
    className="transition hover:text-white"
  >
    Coleções
  </a>

  <a
    href="#"
    className="transition hover:text-white"
  >
    Favoritas
  </a>

  <a
    href="#"
    className="transition hover:text-white"
  >
    Contato
  </a>

  {user ? (

    <div className="flex items-center gap-3">

      <span className="text-pink-200">
        Olá, {user.name}
      </span>

      <button
        onClick={logout}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Sair
      </button>

    </div>

  ) : (

    <a
      href="/login"
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      Login
    </a>

  )}

  <button
    onClick={openCart}
    className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90"
  >
    🛒 Carrinho ({totalItems})
  </button>

</nav>
      </div>
    </header>
  )
}
