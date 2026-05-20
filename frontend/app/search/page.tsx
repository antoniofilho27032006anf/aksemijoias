'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { api } from '../../src/services/api'
import { Navbar } from '../../src/components/Navbar'
import { ProductCard } from '../../src/components/ProductCard'
import { CartSidebar } from '../../src/components/CartSidebar'
import { ProductSkeleton } from '../../src/components/ProductSkeleton'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

interface Category {
  id: string
  name: string
  slug: string
}

type SortOption = 'newest' | 'lowest' | 'highest'

function sortProducts(products: Product[], option: SortOption) {
  if (option === 'lowest') return [...products].sort((a, b) => a.price - b.price)
  if (option === 'highest') return [...products].sort((a, b) => b.price - a.price)
  return products
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.set('q', searchTerm.trim())
      if (selectedCategory) params.set('category', selectedCategory)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      params.set('limit', '50')

      const response = await api.get(`/products?${params}`)
      setProducts(response.data.products ?? [])
      setTotal(response.data.total ?? 0)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, minPrice, maxPrice])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  function handleSearch(event: { preventDefault(): void }) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('q', searchTerm.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    router.push(`/search?${params}`)
    loadProducts()
  }

  function clearFilters() {
    setSearchTerm('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/search')
  }

  const sorted = sortProducts(products, sortOption)
  const hasFilters = searchTerm || selectedCategory || minPrice || maxPrice

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        <section className="mt-12 rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Busca avançada</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Encontre sua peça</h1>

          <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome ou descrição..."
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-300 lg:col-span-2"
            />
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Preço mínimo (R$)"
              type="number"
              min="0"
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-300"
            />
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Preço máximo (R$)"
              type="number"
              min="0"
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-300"
            />
          </form>

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === '' ? 'bg-pink-500 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-pink-300'}`}
              >
                Todas categorias
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === cat.slug ? 'bg-pink-500 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-pink-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {loading ? 'Buscando...' : `${total} produto(s) encontrado(s)`}
              </span>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-pink-500 underline">
                  Limpar filtros
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">Ordenar:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
              >
                <option value="newest">Mais recentes</option>
                <option value="lowest">Menor preço</option>
                <option value="highest">Maior preço</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center">
              <p className="text-2xl font-semibold text-slate-900">Nenhum produto encontrado</p>
              <p className="mt-3 text-sm text-slate-500">Tente outros termos ou remova alguns filtros.</p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Voltar à loja
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sorted.map((product) => (
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
        </section>
      </main>

      <CartSidebar />
    </div>
  )
}
