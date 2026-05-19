'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { api } from '../../../src/services/api'
import { Navbar } from '../../../src/components/Navbar'
import { ProductCard } from '../../../src/components/ProductCard'
import { CartSidebar } from '../../../src/components/CartSidebar'
import { useCart } from '../../../src/contexts/CartContext'
import { useFavorites } from '../../../src/contexts/FavoritesContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

function getPopularityScore(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100
}

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)

      try {
        const response = await api.get('/products')
        const allProducts: Product[] = response.data

        const currentProduct = allProducts.find((item) => item.id === productId) ?? null
        setProduct(currentProduct)

        const related = allProducts
          .filter((item) => item.id !== productId)
          .sort((a, b) => getPopularityScore(b.id) - getPopularityScore(a.id))
          .slice(0, 3)

        setRelatedProducts(related)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        {loading ? (
          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_rgba(145,92,255,0.12)] animate-pulse">
            <div className="h-8 w-1/3 rounded-full bg-slate-300/60" />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,_0.9fr]">
              <div className="h-[420px] rounded-[2rem] bg-slate-300/40" />
              <div className="space-y-4">
                <div className="h-8 w-2/3 rounded-full bg-slate-300/40" />
                <div className="h-6 w-full rounded-full bg-slate-300/40" />
                <div className="h-6 w-5/6 rounded-full bg-slate-300/40" />
                <div className="h-14 w-full rounded-full bg-slate-300/40" />
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="mt-12 rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
            <p className="text-2xl font-semibold text-slate-900">Não encontramos essa peça</p>
            <p className="mt-3 text-sm leading-7">O produto pode ter sido removido ou o link está incorreto.</p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Voltar à loja
            </Link>
          </div>
        ) : (
          <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr,_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
              <img src={product.image} alt={product.name} className="h-[520px] w-full rounded-[2rem] object-cover" />
              <div className="mt-8 grid gap-3">
                <span className="inline-flex rounded-full bg-pink-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-pink-300">
                  Produto premium
                </span>
                <h1 className="text-4xl font-black text-slate-900">{product.name}</h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">{product.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="text-4xl font-bold text-pink-500">R$ {product.price.toFixed(2)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
                    {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
                  </span>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    Adicionar ao carrinho
                  </button>
                  <button
                    onClick={() => {
                      if (isFavorite(product.id)) {
                        removeFavorite(product.id)
                      } else {
                        addFavorite({ id: product.id, name: product.name, image: product.image, price: product.price })
                      }
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-white/10"
                  >
                    {isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
                <h2 className="text-2xl font-bold text-slate-900">Detalhes da peça</h2>
                <ul className="mt-6 space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-pink-500" />
                    Acabamento em prata 925 com banho hipoalergênico.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-pink-500" />
                    Design leve, confortável para uso prolongado.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-pink-500" />
                    Inspiração moderna e feminina em cada detalhe.
                  </li>
                </ul>
                <Link
                  href="/"
                  className="mt-8 inline-flex rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Voltar para a loja
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm uppercase tracking-[0.3em] text-pink-700">Sugestões</span>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">Produtos relacionados</h2>
                  </div>
                  <span className="text-sm text-slate-500">Baseado na sua escolha</span>
                </div>
                <div className="mt-6 grid gap-5">
                  {relatedProducts.map((suggestion) => (
                    <ProductCard
                      key={suggestion.id}
                      id={suggestion.id}
                      name={suggestion.name}
                      description={suggestion.description}
                      price={suggestion.price}
                      image={suggestion.image}
                      stock={suggestion.stock}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}
