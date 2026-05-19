'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { api } from '../src/services/api'

import { Navbar } from '../src/components/Navbar'
import { ProductCard } from '../src/components/ProductCard'
import { CartSidebar } from '../src/components/CartSidebar'
import { BannerCarousel } from '../src/components/BannerCarousel'
import { ProductSkeleton } from '../src/components/ProductSkeleton'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

type SortOption = 'bestseller' | 'lowest' | 'highest'

function getPopularityScore(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100
}

function sortProducts(products: Product[], option: SortOption) {
  if (option === 'lowest') {
    return [...products].sort((a, b) => a.price - b.price)
  }

  if (option === 'highest') {
    return [...products].sort((a, b) => b.price - a.price)
  }

  return [...products].sort((a, b) => getPopularityScore(b.id) - getPopularityScore(a.id))
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('bestseller')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const response = await api.get('/products')
        setAllProducts(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const products = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    const filtered = allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
      )
    })

    return sortProducts(filtered, sortOption)
  }, [allProducts, searchTerm, sortOption])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        <section className="grid gap-10 xl:grid-cols-[1.1fr,_0.9fr] items-center pt-12">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-700 shadow-[0_0_30px_rgba(255,182,193,0.12)]">
              Delicadeza em cada detalhe
            </span>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em]">
                Alta joalheria sob uma nova perspectiva: brilho discreto, estilo eterno.
              </h1>
              <p className="max-w-xl text-slate-600 text-base sm:text-lg leading-8">
                As marcas que você confia, a qualidade que você exige: Rommanel, Brunna Semijoias e o brilho autêntico da Prata 925.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/favorites"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-pink-400 px-8 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(219,39,119,0.24)] transition hover:-translate-y-0.5"
              >
                Minhas favoritas
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Meus pedidos
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-pink-100 bg-white/90 p-4 text-center shadow-[0_10px_40px_rgba(255,182,193,0.08)]">
                <p className="text-3xl font-bold text-slate-900">+250</p>
                <span className="block text-sm text-slate-500">Peças exclusivas</span>
              </div>
              <div className="rounded-3xl border border-violet-100 bg-white/90 p-4 text-center shadow-[0_10px_40px_rgba(155,92,255,0.08)]">
                <p className="text-3xl font-bold text-slate-900">Suave</p>
                <span className="block text-sm text-slate-500">Acabamento perolado</span>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-white/90 p-4 text-center shadow-[0_10px_40px_rgba(255,192,203,0.08)]">
                <p className="text-3xl font-bold text-slate-900">Sempre</p>
                <span className="block text-sm text-slate-500">Para todos os momentos</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white/95 p-6 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-pink-400/30 to-transparent" />
            <div className="relative grid gap-5">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_80px_rgba(145,92,255,0.12)]">
                <p className="text-sm uppercase tracking-[0.25em] text-pink-700">Seleção Rosé</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">Colar Pérola Lunar</h2>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Um design suave com acabamento em pérola e pequenos detalhes em ametista para um brilho feminino.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="text-3xl font-bold text-pink-600">R$ 299</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                    Nova chegada
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="rounded-[1.75rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm text-slate-500">Brilho suave</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">Brincos</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm text-slate-500">Detalhes femininos</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">Anéis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BannerCarousel />

        <section id="produtos" className="mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Nova coleção</p>
              <h2 className="text-4xl font-bold text-slate-900">Joias que encantam</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(220px,_1fr)_200px]">
              <form className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm" onSubmit={(event) => event.preventDefault()}>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar produto"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </form>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="bestseller">Mais vendidos</option>
                <option value="lowest">Menor preço</option>
                <option value="highest">Maior preço</option>
              </select>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-slate-500">Uma curadoria feminina com design delicado, perfeita para quem gosta de joias leves e cheias de charme.</p>

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
                <p className="text-2xl font-semibold text-slate-900">Nenhum produto encontrado</p>
                <p className="mt-3 text-sm leading-7">Experimente outro termo como “anel”, “colar” ou “brinco”.</p>
                <Link
                  href="/search"
                  className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    stock={product.stock}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <CartSidebar />
    </div>
  )
}
