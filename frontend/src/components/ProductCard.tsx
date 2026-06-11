'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

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

export function ProductCard({ id, name, price, image, stock }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorited = isFavorite(id)

  const pixPrice = (price * 0.9).toFixed(2).replace('.', ',')
  const installments = price >= 100 ? 6 : price >= 50 ? 4 : 3
  const installmentValue = (price / installments).toFixed(2).replace('.', ',')

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: 'var(--c-border)' }}
    >

      {/* Favorite */}
      <button
        onClick={() => favorited ? removeFavorite(id) : addFavorite({ id, name, image, price })}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 backdrop-blur transition hover:scale-110"
        aria-label={favorited ? 'Remover favorito' : 'Favoritar'}
      >
        <Heart
          size={14}
          strokeWidth={2}
          fill={favorited ? 'var(--color-brand-pink)' : 'none'}
          stroke={favorited ? 'var(--color-brand-pink)' : 'var(--c-vdim)'}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${id}`} className="block aspect-square overflow-hidden bg-[var(--c-bg-soft)]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/product/${id}`}>
          <h3
            className="line-clamp-2 text-[11px] font-medium uppercase leading-tight tracking-wide transition hover:text-[var(--color-brand)]"
            style={{ color: 'var(--c-text)' }}
          >
            {name}
          </h3>
        </Link>

        <div>
          <p className="text-lg font-bold leading-tight" style={{ color: 'var(--color-brand)' }}>
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--c-dim)' }}>
            R$ {pixPrice} no Pix
          </p>
        </div>

        <p className="text-[11px]" style={{ color: 'var(--c-vdim)' }}>
          {installments}x de R$ {installmentValue} sem juros
        </p>

        <button
          onClick={() => addToCart({ id, name, price, image })}
          disabled={stock === 0}
          className="btn-premium mt-1 w-full disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {stock > 0 ? 'Comprar' : 'Esgotado'}
        </button>
      </div>
    </div>
  )
}
