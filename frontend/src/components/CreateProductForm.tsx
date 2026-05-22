'use client'

import { useEffect, useState } from 'react'

import { api } from '../services/api'
import { toast } from 'sonner'
import { CATEGORIES } from '../data/categories'

interface ApiCategory {
  id: string
  name: string
  slug: string
}

export function CreateProductForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const [selectedMain, setSelectedMain] = useState('')
  const [selectedSub, setSelectedSub] = useState('')
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    api.get('/categories').then((r) => setApiCategories(r.data)).catch(() => {})
  }, [])

  const activeSubs = CATEGORIES.find((c) => c.name === selectedMain)?.sub ?? []

  function resolvedCategoryId(): string {
    const label = selectedSub || selectedMain
    if (!label) return ''
    const match = apiCategories.find(
      (c) => c.name.toLowerCase() === label.toLowerCase()
    )
    return match?.id ?? ''
  }

  async function handleCreateProduct() {
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)

      const catId = resolvedCategoryId()
      if (catId) formData.append('categoryId', catId)
      if (image) formData.append('image', image)

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Produto criado com sucesso!')
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setImage(null)
      setPreview('')
      setSelectedMain('')
      setSelectedSub('')
    } catch {
      toast.error('Erro ao criar produto')
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Novo produto</p>
        <h2 className="mt-3 text-3xl font-black text-white">Criar joia</h2>
      </div>

      <div className="mt-8 space-y-5">

        <input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Preço (R$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />
          <input
            type="number"
            placeholder="Estoque"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />
        </div>

        {/* ── Category picker ── */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Categoria
          </p>

          {/* Main categories */}
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

          {/* Subcategories */}
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

          {/* Selected label */}
          {(selectedMain || selectedSub) && (
            <p className="mt-3 text-[10px] text-white/40">
              Selecionado:{' '}
              <span className="font-bold text-white/70">
                {selectedSub || selectedMain}
              </span>
              {!resolvedCategoryId() && (
                <span className="ml-2 text-yellow-400/70">
                  (categoria não encontrada no banco — crie-a primeiro)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0]
              setImage(file)
              setPreview(URL.createObjectURL(file))
            }
          }}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
        />

        {preview && (
          <img src={preview} alt="Preview" className="h-64 w-full rounded-2xl object-cover" />
        )}

        <button
          onClick={handleCreateProduct}
          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-4 font-semibold text-white transition hover:opacity-95 active:scale-[0.99]"
        >
          Criar Produto
        </button>
      </div>
    </div>
  )
}
