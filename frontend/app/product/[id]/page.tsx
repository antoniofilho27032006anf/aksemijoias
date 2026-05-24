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

interface Variation {
  id: string
  name: string
  value: string
  stock: number
  price?: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  variations: Variation[]
  category?: { name: string }
}

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const [productRes, relatedRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get('/products?limit=4'),
        ])
        setProduct(productRes.data)
        setRelatedProducts(
          (relatedRes.data.products ?? [])
            .filter((p: Product) => p.id !== productId)
            .slice(0, 3)
        )
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId])

  const variationGroups = product?.variations?.reduce((acc: Record<string, Variation[]>, v) => {
    if (!acc[v.name]) acc[v.name] = []
    acc[v.name].push(v)
    return acc
  }, {}) ?? {}

  function handleAddToCart() {
    if (!product) return
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <Navbar />

      <main className="mx-auto max-w-lg px-3 pb-20 pt-4 sm:px-5 lg:max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--c-vdim)' }}>
          <Link href="/" className="transition hover:underline" style={{ color: 'var(--c-dim)' }}>Loja</Link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="truncate max-w-[180px]">{loading ? '...' : (product?.name ?? 'Produto')}</span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-6">
            <div className="skeleton h-72 w-full rounded-xl lg:h-96 lg:w-80 lg:flex-none" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="skeleton h-4 w-1/3 rounded-lg" />
              <div className="skeleton h-6 w-3/4 rounded-lg" />
              <div className="skeleton h-5 w-full rounded-lg" />
              <div className="skeleton h-5 w-5/6 rounded-lg" />
              <div className="skeleton h-10 w-1/3 rounded-xl" />
              <div className="skeleton h-11 w-full rounded-xl" />
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && !product && (
          <div
            className="flex flex-col items-center gap-4 rounded-xl border px-6 py-14 text-center"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4509B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>Produto não encontrado</p>
            <p className="text-xs" style={{ color: 'var(--c-vdim)' }}>O produto pode ter sido removido ou o link está incorreto.</p>
            <Link
              href="/"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
            >
              Voltar à loja
            </Link>
          </div>
        )}

        {/* Product */}
        {!loading && product && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">

            {/* ── Image ── */}
            <div className="lg:w-80 lg:flex-none">
              <div
                className="relative overflow-hidden rounded-xl border"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-72 w-full object-cover lg:h-96"
                />
                {/* Favorite button overlay */}
                <button
                  onClick={() => isFavorite(product.id)
                    ? removeFavorite(product.id)
                    : addFavorite({ id: product.id, name: product.name, image: product.image, price: product.price })
                  }
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition hover:scale-110"
                  style={{ background: 'var(--c-glass)', backdropFilter: 'blur(8px)' }}
                  aria-label="Favoritar"
                >
                  <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    fill={isFavorite(product.id) ? '#C4509B' : 'none'}
                    stroke="#C4509B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                {/* Stock badge */}
                <div
                  className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm"
                  style={product.stock > 0
                    ? { background: '#d1fae5cc', color: '#065f46' }
                    : { background: '#fee2e2cc', color: '#991b1b' }
                  }
                >
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                </div>
              </div>
            </div>

            {/* ── Info ── */}
            <div className="flex flex-1 flex-col gap-3">

              {/* Category + name */}
              <div>
                {product.category && (
                  <span
                    className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{ background: '#f3e8ff', color: '#7C3D8E' }}
                  >
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-lg font-black leading-tight sm:text-xl" style={{ color: 'var(--c-text)' }}>
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black" style={{ color: '#C4509B' }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                {product.description}
              </p>

              {/* Variations */}
              {Object.entries(variationGroups).map(([groupName, options]) => (
                <div key={groupName}>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
                    {groupName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariations((prev) => ({ ...prev, [groupName]: v.value }))}
                        disabled={v.stock === 0}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                        style={selectedVariations[groupName] === v.value
                          ? { borderColor: '#7C3D8E', background: '#f3e8ff', color: '#7C3D8E' }
                          : { borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-muted)' }
                        }
                      >
                        {v.value}{v.price ? ` +R$ ${v.price.toFixed(2).replace('.', ',')}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: added ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
                >
                  {added ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Adicionar ao carrinho
                    </>
                  )}
                </button>
              </div>

              {/* Details card */}
              <div
                className="rounded-xl border p-3"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
              >
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
                  Detalhes da peça
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    'Acabamento em prata 925 com banho hipoalergênico',
                    'Design leve, confortável para uso prolongado',
                    'Inspiração moderna e feminina em cada detalhe',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
                      <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full" style={{ background: '#C4509B' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Back link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold transition hover:underline"
                style={{ color: 'var(--c-dim)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Voltar para a loja
              </Link>
            </div>
          </div>
        )}

        {/* ── Related products ── */}
        {!loading && product && relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-vdim)' }}>
                Produtos relacionados
              </p>
              <Link href="/" className="text-[11px] font-semibold transition hover:underline" style={{ color: '#7C3D8E' }}>
                Ver mais
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {relatedProducts.map((p) => (
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
          </div>
        )}

      </main>

      <CartSidebar />
    </div>
  )
}
