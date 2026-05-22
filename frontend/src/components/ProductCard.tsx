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

export function ProductCard({ id, name, price, image, stock }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorited = isFavorite(id)

  const pixPrice = (price * 0.9).toFixed(2).replace('.', ',')
  const installments = price >= 100 ? 6 : price >= 50 ? 4 : 3
  const installmentValue = (price / installments).toFixed(2).replace('.', ',')

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md">

      {/* NOVO badge */}
      <span className="absolute right-0 top-3 z-10 rounded-l bg-[#8B7070] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
        NOVO
      </span>

      {/* Favorite */}
      <button
        onClick={() => favorited ? removeFavorite(id) : addFavorite({ id, name, image, price })}
        className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:scale-110"
        aria-label={favorited ? 'Remover favorito' : 'Favoritar'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={favorited ? '#C4509B' : 'none'} stroke={favorited ? '#C4509B' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Image */}
      <Link href={`/product/${id}`} className="block bg-gray-50">
        <img
          src={image}
          alt={name}
          className="h-36 w-full object-contain p-3 transition duration-300 hover:scale-105 sm:h-44"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-2 text-[11px] font-semibold uppercase leading-tight text-gray-700 transition hover:text-[#7C3D8E] sm:text-xs">
            {name}
          </h3>
        </Link>

        <div className="mt-2 space-y-0.5">
          <p className="text-base font-black text-[#7C3D8E] sm:text-lg">
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[11px] text-gray-400">
            R$ {pixPrice} com Pix
          </p>
        </div>

        <div className="mt-2 rounded border border-gray-200 px-2 py-1.5 text-center text-[10px] text-gray-500 sm:text-[11px]">
          {installments} x de R$ {installmentValue} sem juros
        </div>

        <button
          onClick={() => addToCart({ id, name, price, image })}
          disabled={stock === 0}
          className="mt-3 w-full rounded py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: stock > 0 ? '#C4509B' : '#aaa' }}
        >
          {stock > 0 ? 'COMPRAR' : 'ESGOTADO'}
        </button>
      </div>
    </div>
  )
}
