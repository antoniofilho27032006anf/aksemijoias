'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('term') ?? ''
  const sortParam = (searchParams.get('sort') as SortOption) ?? 'bestseller'

  const [searchTerm, setSearchTerm] = useState(query)
  const [sortOption, setSortOption] = useState<SortOption>(sortParam)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSearchTerm(query)
    setSortOption(sortParam)
  }, [query, sortParam])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)

      try {
        const response = await api.get('/products')
        const allProducts: Product[] = response.data

        const normalized = searchTerm.trim().toLowerCase()

        const filtered = allProducts.filter((product) => {
          return (
            product.name.toLowerCase().includes(normalized) ||
            product.description.toLowerCase().includes(normalized)
          )
        })

        setProducts(sortProducts(filtered, sortOption))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [searchTerm, sortOption, query])

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = searchTerm.trim()
    router.push(`/search?term=${encodeURIComponent(term)}&sort=${sortOption}`)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        <section className="mt-12 rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Busque sua peça</p>
              <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">
                Resultados para “{query || 'todas as coleções'}”
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                Encontre a joia perfeita com filtros rápidos, ordenação inteligente e visual premium.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex w-full gap-3 sm:max-w-xl">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por colar, anel, brincos..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-pink-300"
              />
              <button className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-95">
                Buscar
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">{loading ? 'Carregando produtos...' : `${products.length} produto(s) encontrado(s)`}</span>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">Ordenar por:</label>
              <select
                value={sortOption}
                onChange={(event) => {
                  const next = event.target.value as SortOption
                  setSortOption(next)
                  router.push(`/search?term=${encodeURIComponent(searchTerm.trim())}&sort=${next}`)
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-300"
              >
                <option value="bestseller">Mais vendidos</option>
                <option value="lowest">Menor preço</option>
                <option value="highest">Maior preço</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
              <p className="text-2xl font-semibold text-slate-900">Nada encontrado ainda.</p>
              <p className="mt-3 text-sm leading-7">Experimente outros termos como “anel”, “colar” ou “brinco”.</p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Voltar para a loja
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </section>
      </main>

      <CartSidebar />
    </div>
  )
}
