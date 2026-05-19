'use client'

import Link from 'next/link'

import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'
import { useAuth } from '../../src/contexts/AuthContext'
import { useFavorites } from '../../src/contexts/FavoritesContext'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        <section className="mt-12 rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Favoritos</p>
              <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">Sua seleção de joias preferidas</h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                Veja aqui as peças que você guardou com carinho. Toque em qualquer item para ver mais detalhes ou remova da sua lista quando quiser.
              </p>
            </div>

            <div className="rounded-full bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
              {favorites.length} produto(s) salvo(s)
            </div>
          </div>
        </section>

        <section className="mt-10">
          {!user ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
              <p className="text-2xl font-semibold text-slate-900">Faça login para salvar favoritos</p>
              <p className="mt-3 text-sm leading-7">Seu carrinho e favoritos ficam seguros em sua conta.</p>
              <Link
                href="/login"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Entrar agora
              </Link>
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
              <p className="text-2xl font-semibold text-slate-900">Ainda não há favoritos</p>
              <p className="mt-3 text-sm leading-7">Navegue pela loja e marque suas peças prediletas para encontrá-las com facilidade.</p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Voltar para a loja
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {favorites.map((product) => (
                <div key={product.id} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.14)] transition hover:-translate-y-1">
                  <img src={product.image} alt={product.name} className="h-72 w-full rounded-[1.5rem] object-cover" />
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
                      <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-pink-400">
                        Favorito
                      </span>
                    </div>
                    <p className="text-lg font-bold text-pink-500">R$ {product.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/product/${product.id}`}
                        className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        Ver detalhes
                      </Link>
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="rounded-full bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-400"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CartSidebar />
    </div>
  )
}
