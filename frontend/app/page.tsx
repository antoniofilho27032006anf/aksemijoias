'use client'

import { useEffect, useMemo, useState } from 'react'

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
    <div className="min-h-screen bg-white">

      {/* Promotional banner */}
      <div className="bg-[#7C3D8E] px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        Pague no PIX e ganhe 5% de desconto! Vem!
      </div>

      <Navbar onSearch={setSearchTerm} />

      {/* Hero banner */}
      <HeroBanner />

      {/* Category carousel */}
      <CategoryCarousel />

      {/* Installment strip */}
      <div className="border-b border-gray-100 py-5">
        <div className="flex items-center justify-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#7C3D8E]">
              PARCELAMOS SUA COMPRA
            </p>
            <p className="text-xs text-gray-500">Em até 6X sem juros. APROVEITE!</p>
          </div>
        </div>
      </div>

      {/* Products section */}
      <main id="produtos" className="px-3 pb-24 pt-5 sm:px-5">

        {/* Category pills */}
        {categories.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-3"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            <button
              onClick={() => setSelectedCategory('')}
              className="flex-none rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition hover:opacity-80"
              style={
                selectedCategory === ''
                  ? { backgroundColor: '#7C3D8E', borderColor: '#7C3D8E', color: '#fff' }
                  : { borderColor: '#C4B0D4', color: '#7C3D8E', backgroundColor: '#fff' }
              }
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="flex-none rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition hover:opacity-80"
                style={
                  selectedCategory === cat.slug
                    ? { backgroundColor: '#7C3D8E', borderColor: '#7C3D8E', color: '#fff' }
                    : { borderColor: '#C4B0D4', color: '#7C3D8E', backgroundColor: '#fff' }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="mb-4 mt-1 flex items-center justify-end">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-full border border-gray-200 px-4 py-1.5 text-xs text-gray-600 outline-none"
          >
            <option value="bestseller">Mais vendidos</option>
            <option value="lowest">Menor preço</option>
            <option value="highest">Maior preço</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bold text-gray-400">Nenhum produto encontrado</p>
            <p className="mt-1 text-sm text-gray-300">Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
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
