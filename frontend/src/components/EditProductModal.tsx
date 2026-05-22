'use client'

import { useEffect, useState } from 'react'

import { api } from '../services/api'
import { CATEGORIES } from '../data/categories'

interface ApiCategory {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  categoryId?: string
}

interface Props {
  product: Product
  onClose: () => void
  onUpdated: () => void
}

export function EditProductModal({ product, onClose, onUpdated }: Props) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [image, setImage] = useState<File | null>(null)

  const [selectedMain, setSelectedMain] = useState('')
  const [selectedSub, setSelectedSub] = useState('')
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    api.get('/categories').then((r) => {
      const cats: ApiCategory[] = r.data
      setApiCategories(cats)

      // Pre-select current category
      if (product.categoryId) {
        const current = cats.find((c) => c.id === product.categoryId)
        if (current) {
          const mainMatch = CATEGORIES.find((m) =>
            m.sub.some((s) => s.name.toLowerCase() === current.name.toLowerCase())
          )
          if (mainMatch) {
            setSelectedMain(mainMatch.name)
            setSelectedSub(current.name)
          } else {
            const directMatch = CATEGORIES.find(
              (m) => m.name.toLowerCase() === current.name.toLowerCase()
            )
            if (directMatch) setSelectedMain(directMatch.name)
          }
        }
      }
    }).catch(() => {})
  }, [product.categoryId])

  const activeSubs = CATEGORIES.find((c) => c.name === selectedMain)?.sub ?? []

  function resolvedCategoryId(): string {
    const label = selectedSub || selectedMain
    if (!label) return ''
    return apiCategories.find(
      (c) => c.name.toLowerCase() === label.toLowerCase()
    )?.id ?? ''
  }

  async function handleUpdateProduct() {
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)

      const catId = resolvedCategoryId()
      if (catId) formData.append('categoryId', catId)
      if (image) formData.append('image', image)

      await api.put(`/products/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Produto atualizado!')
      onUpdated()
      onClose()
    } catch {
      alert('Erro ao atualizar produto')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#12081b] p-6 max-h-[90vh] overflow-y-auto sm:p-8">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Editar produto</p>
            <h2 className="mt-2 text-2xl font-black text-white">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-3xl text-white/60 hover:text-white">×</button>
        </div>

        <div className="mt-6 space-y-4">

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Preço"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
            />
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Estoque"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
            />
          </div>

          {/* ── Category picker ── */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              Categoria
            </p>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedMain(cat.name === selectedMain ? '' : cat.name)
                    setSelectedSub('')
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:opacity-90 active:scale-95"
                  style={
                    selectedMain === cat.name
                      ? { background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', color: '#fff' }
                      : { border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {selectedMain && activeSubs.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                  Subcategoria — {selectedMain}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeSubs.map((sub) => (
                    <button
                      key={sub.name}
                      type="button"
                      onClick={() => setSelectedSub(sub.name === selectedSub ? '' : sub.name)}
                      className="rounded-xl px-3 py-2.5 text-left text-[10px] font-semibold uppercase leading-tight tracking-wide transition hover:opacity-90 active:scale-95"
                      style={
                        selectedSub === sub.name
                          ? { background: 'linear-gradient(135deg,#be185d,#db2777)', color: '#fff' }
                          : { border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }
                      }
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selectedMain || selectedSub) && (
              <p className="mt-3 text-[10px] text-white/40">
                Selecionado:{' '}
                <span className="font-bold text-white/70">{selectedSub || selectedMain}</span>
                {!resolvedCategoryId() && (
                  <span className="ml-2 text-yellow-400/70">
                    (categoria não encontrada no banco — crie-a primeiro)
                  </span>
                )}
              </p>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => { if (e.target.files) setImage(e.target.files[0]) }}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <button
            onClick={handleUpdateProduct}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-4 font-semibold text-white transition hover:opacity-95"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  )
}
