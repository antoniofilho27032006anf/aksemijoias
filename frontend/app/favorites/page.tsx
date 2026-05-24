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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-3 pb-20 pt-5 sm:px-5">

        {/* Page header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
            <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
              Favoritos
            </h1>
          </div>
          {user && (
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold"
              style={{ backgroundColor: '#faf5ff', color: '#7C3D8E', border: '1px solid #e8d5f5' }}
            >
              {favorites.length} {favorites.length === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>

        {/* Content */}
        {!user ? (
          <EmptyState
            title="Faça login para ver seus favoritos"
            subtitle="Salve suas joias preferidas e encontre-as com facilidade."
            cta="Entrar agora"
            href="/login"
          />
        ) : favorites.length === 0 ? (
          <EmptyState
            title="Ainda não há favoritos"
            subtitle="Navegue pela loja e marque suas peças preferidas."
            cta="Ver produtos"
            href="/"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-xl border bg-white p-2.5"
                style={{ borderColor: '#e8d5f5' }}
              >
                {/* Thumbnail */}
                <Link href={`/product/${product.id}`} className="flex-none">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                </Link>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${product.id}`}>
                    <p className="truncate text-[13px] font-semibold text-gray-800 hover:text-[#7C3D8E] transition">
                      {product.name}
                    </p>
                  </Link>
                  <p className="mt-0.5 text-sm font-black" style={{ color: '#C4509B' }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-none items-center gap-1.5">
                  <Link
                    href={`/product/${product.id}`}
                    className="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-gray-50"
                    style={{ borderColor: '#e8d5f5', color: '#7C3D8E' }}
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-400"
                    aria-label="Remover favorito"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}

function EmptyState({ title, subtitle, cta, href }: { title: string; subtitle: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border py-14 text-center" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: '#f3e8ff' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4B0D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">{title}</p>
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
      >
        {cta}
      </Link>
    </div>
  )
}
