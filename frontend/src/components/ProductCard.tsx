'use client'

import Link from 'next/link'

import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  stock
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorited = isFavorite(id)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(120,60,220,0.18)] bg-[#0a0618] shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(201,162,39,0.3)] hover:shadow-[0_16px_60px_rgba(124,58,237,0.15)]">
      {/* Gold top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-60" />

      {/* Favorite button */}
      <button
        onClick={() => favorited ? removeFavorite(id) : addFavorite({ id, name, image, price })}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(120,60,220,0.25)] bg-[rgba(6,4,12,0.75)] backdrop-blur-sm transition hover:border-[rgba(201,162,39,0.5)] hover:scale-110"
        aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={favorited ? '#c9a227' : 'none'} stroke={favorited ? '#c9a227' : '#7c6fa0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Stock badge */}
      {stock === 0 && (
        <div className="absolute left-3 top-3 z-10 rounded-lg bg-[rgba(180,30,30,0.85)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          Esgotado
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${id}`} className="block overflow-hidden">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-104 sm:h-52"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-transparent to-transparent opacity-60" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-sm font-semibold leading-snug text-white transition hover:text-[#e8c94a] sm:text-base">
            {name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#7c6fa0] sm:text-[13px]">
          {description}
        </p>

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <span
              className="text-lg font-black sm:text-xl"
              style={{
                background: 'linear-gradient(135deg, #c9a227 0%, #f0c040 60%, #c9a227 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#5a4f7a]">
              {stock > 0 ? `${stock} em estoque` : 'Indisponível'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => addToCart({ id, name, price, image })}
            disabled={stock === 0}
            className="w-full rounded-xl py-2.5 text-xs font-bold text-[#0a0612] transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
          >
            {stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível'}
          </button>
          <Link
            href={`/product/${id}`}
            className="flex justify-center rounded-xl border border-[rgba(120,60,220,0.28)] bg-[rgba(120,60,220,0.06)] py-2.5 text-xs font-semibold text-[#a78bfa] transition hover:border-[rgba(120,60,220,0.5)] hover:bg-[rgba(120,60,220,0.12)] sm:text-sm"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}
