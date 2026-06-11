'use client'

import { useEffect, useMemo, useState } from 'react'

import { CreditCard } from 'lucide-react'

import { api } from '../src/services/api'
import { Navbar } from '../src/components/Navbar'
import { ProductCard } from '../src/components/ProductCard'
import { CartSidebar } from '../src/components/CartSidebar'
import { HeroBanner } from '../src/components/HeroBanner'
import { ProductSkeleton } from '../src/components/ProductSkeleton'
import { CategoryCarousel } from '../src/components/CategoryCarousel'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

type SortOption = 'bestseller' | 'lowest' | 'highest'

interface Category {
  id: string
  name: string
  slug: string
}

function getPopularityScore(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100
}

function sortProducts(products: Product[], option: SortOption) {
  if (option === 'lowest') return [...products].sort((a, b) => a.price - b.price)
  if (option === 'highest') return [...products].sort((a, b) => b.price - a.price)
  return [...products].sort((a, b) => getPopularityScore(b.id) - getPopularityScore(a.id))
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
    async function load() {
      try {
        setLoading(true)
        const url = selectedCategory ? `/products?category=${selectedCategory}` : '/products'
        const res = await api.get(url)
        setAllProducts(res.data.products ?? [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedCategory])

  const products = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    const filtered = allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
    return sortProducts(filtered, sortOption)
  }, [allProducts, searchTerm, sortOption])

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>

      {/* Promotional banner */}
      <div
        className="px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white sm:text-xs"
        style={{ background: 'linear-gradient(to right, var(--color-brand-800), var(--color-brand))' }}
      >
        Pague no Pix e ganhe 5% de desconto
      </div>

      <Navbar onSearch={setSearchTerm} />

      {/* Hero banner */}
      <HeroBanner />

      {/* Installment strip */}
      <div className="border-b py-4" style={{ borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-center gap-3">
          <CreditCard size={24} strokeWidth={1.6} style={{ color: 'var(--color-brand)' }} />
          <div>
            <p className="font-heading text-base font-semibold tracking-wide" style={{ color: 'var(--color-brand)' }}>
              Parcelamos sua compra
            </p>
            <p className="text-xs" style={{ color: 'var(--c-dim)' }}>Em até 6x sem juros. Aproveite!</p>
          </div>
        </div>
      </div>

      {/* Categories quick nav */}
      <CategoryCarousel />

      {/* Products section */}
      <main id="produtos" className="px-3 pb-24 pt-6 sm:px-5">

        {/* Category pills */}
        {categories.length > 0 && (
          <div
            className="mb-4 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            <button
              onClick={() => setSelectedCategory('')}
              className={`chip flex-none ${selectedCategory === '' ? 'chip-active' : ''}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`chip flex-none ${selectedCategory === cat.slug ? 'chip-active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="mb-4 flex items-center justify-end">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-full border px-4 py-1.5 text-xs outline-none transition focus:border-[var(--color-brand)]"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-soft)', color: 'var(--c-muted)' }}
          >
            <option value="bestseller">Mais vendidos</option>
            <option value="lowest">Menor preço</option>
            <option value="highest">Maior preço</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bold" style={{ color: 'var(--c-vdim)' }}>Nenhum produto encontrado</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--c-vdim)' }}>Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                price={p.price}
                image={p.image}
                stock={p.stock}
              />
            ))}
          </div>
        )}

      </main>

      <CartSidebar />
    </div>
  )
}
