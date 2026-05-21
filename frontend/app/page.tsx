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
  if (option === 'lowest') return [...products].sort((a, b) => a.price - b.price)
  if (option === 'highest') return [...products].sort((a, b) => b.price - a.price)
  return [...products].sort((a, b) => getPopularityScore(b.id) - getPopularityScore(a.id))
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('bestseller')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const url = selectedCategory ? `/products?category=${selectedCategory}` : '/products'
        const response = await api.get(url)
        setAllProducts(response.data.products ?? [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [selectedCategory])

  const products = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized)
    )
    return sortProducts(filtered, sortOption)
  }, [allProducts, searchTerm, sortOption])

  return (
    <div className="min-h-screen grid-bg bg-[#06040c] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-8">

        {/* Hero */}
        <section className="grid gap-8 pt-10 sm:pt-14 xl:grid-cols-[1.15fr,0.85fr] xl:items-center xl:gap-12">

          {/* Left: headline */}
          <div className="space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,162,39,0.25)] bg-[rgba(201,162,39,0.07)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c9a227]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227] animate-pulse" />
              Delicadeza em cada detalhe
            </span>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-white">Alta joalheria sob</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #c9a227 55%, #f0c040 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                uma nova perspectiva
              </span>
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-[#7c6fa0] sm:text-base sm:leading-8">
              Rommanel, Brunna Semijoias e Prata 925 — marcas que você confia, qualidade que você exige.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/favorites"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#0a0612] transition hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
              >
                Minhas favoritas
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(120,60,220,0.3)] bg-[rgba(12,8,28,0.8)] px-6 py-3 text-sm font-semibold text-[#a78bfa] transition hover:border-[rgba(120,60,220,0.55)] hover:bg-[rgba(120,60,220,0.1)]"
              >
                Meus pedidos
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '+250', label: 'Peças exclusivas' },
                { value: 'Suave', label: 'Acabamento perolado' },
                { value: 'Sempre', label: 'Para cada momento' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[rgba(120,60,220,0.15)] bg-[rgba(12,8,28,0.7)] p-3 text-center sm:p-4"
                >
                  <p
                    className="text-lg font-black sm:text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #c9a227 0%, #f0c040 60%, #c9a227 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </p>
                  <span className="mt-1 block text-[10px] text-[#5a4f7a] sm:text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: featured card */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(120,60,220,0.2)] bg-[#080514] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:p-6">
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 10%, #7c3aed, transparent)' }} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-50" />

            <div className="relative space-y-4">
              {/* Main product card */}
              <div className="rounded-xl border border-[rgba(120,60,220,0.18)] bg-[rgba(12,8,28,0.9)] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a227]">Seleção Premium</p>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Colar Pérola Lunar</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7c6fa0]">
                  Design suave com acabamento em pérola e detalhes em ametista para um brilho feminino.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className="text-2xl font-black sm:text-3xl"
                    style={{
                      background: 'linear-gradient(135deg, #c9a227 0%, #f0c040 60%, #c9a227 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    R$ 299
                  </span>
                  <span className="rounded-lg border border-[rgba(120,60,220,0.25)] bg-[rgba(120,60,220,0.1)] px-3 py-1 text-[10px] uppercase tracking-wider text-[#a78bfa]">
                    Nova chegada
                  </span>
                </div>
              </div>

              {/* Mini info cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { tag: 'Brilho suave', title: 'Brincos' },
                  { tag: 'Detalhes únicos', title: 'Anéis' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[rgba(120,60,220,0.15)] bg-[rgba(12,8,28,0.8)] p-3"
                  >
                    <p className="text-[10px] text-[#5a4f7a]">{item.tag}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <BannerCarousel />

        {/* Products section */}
        <section id="produtos" className="mt-16 sm:mt-20">

          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a227]">Nova coleção</p>
              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Joias que encantam</h2>
            </div>

            {/* Search + sort */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-xl border border-[rgba(120,60,220,0.2)] bg-[rgba(12,8,28,0.8)] px-4 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a4f7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar produto..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#3d3560]"
                />
              </div>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="rounded-xl border border-[rgba(120,60,220,0.2)] bg-[rgba(12,8,28,0.8)] px-4 py-2.5 text-sm text-[#a090c0] outline-none"
              >
                <option value="bestseller">Mais vendidos</option>
                <option value="lowest">Menor preço</option>
                <option value="highest">Maior preço</option>
              </select>
            </div>
          </div>

          <p className="mt-2 text-sm text-[#5a4f7a]">
            Uma curadoria com design delicado, perfeita para quem aprecia joias leves e cheias de charme.
          </p>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className="rounded-xl border px-4 py-2 text-xs font-semibold transition"
                style={selectedCategory === '' ? {
                  background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)',
                  color: '#0a0612',
                  borderColor: 'transparent',
                } : {
                  borderColor: 'rgba(120,60,220,0.2)',
                  background: 'rgba(12,8,28,0.8)',
                  color: '#7c6fa0',
                }}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold transition"
                  style={selectedCategory === cat.slug ? {
                    background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)',
                    color: '#0a0612',
                    borderColor: 'transparent',
                  } : {
                    borderColor: 'rgba(120,60,220,0.2)',
                    background: 'rgba(12,8,28,0.8)',
                    color: '#7c6fa0',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-[rgba(120,60,220,0.15)] border-dashed bg-[rgba(12,8,28,0.6)] p-12 text-center">
                <p className="text-lg font-bold text-white">Nenhum produto encontrado</p>
                <p className="mt-2 text-sm text-[#5a4f7a]">
                  Experimente outro termo como "anel", "colar" ou "brinco".
                </p>
                <Link
                  href="/search"
                  className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-[#0a0612] transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
                >
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-3">
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
