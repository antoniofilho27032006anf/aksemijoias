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

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-pink-300/40 hover:bg-white/15">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 via-violet-400 to-transparent opacity-90" />
      <button
        onClick={() => {
          if (isFavorite(id)) {
            removeFavorite(id)
          } else {
            addFavorite({
              id,
              name,
              image,
              price
            })
          }
        }}
        className="absolute right-4 top-4 z-10 text-3xl transition hover:scale-110"
      >
        {isFavorite(id) ? '❤️' : '🤍'}
      </button>

      <Link href={`/product/${id}`} className="block overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-6">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-2xl font-semibold text-white">{name}</h3>
        </Link>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-3xl font-bold text-pink-300">R$ {price}</span>
            <p className="mt-1 text-sm text-zinc-400">{stock > 0 ? 'Em estoque' : 'Esgotado'}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${stock > 0 ? 'bg-pink-500/15 text-pink-200' : 'bg-red-500/15 text-red-200'}`}>
            {stock > 0 ? 'Disponível' : 'Sem estoque'}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            onClick={() =>
              addToCart({
                id,
                name,
                price,
                image
              })
            }
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95"
          >
            Adicionar ao carrinho
          </button>
          <Link
            href={`/product/${id}`}
            className="inline-flex justify-center rounded-full border border-slate-200 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}
