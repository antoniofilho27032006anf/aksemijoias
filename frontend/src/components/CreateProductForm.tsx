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
    <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #7C3D8E 0%, #5b2177 100%)' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-200">Novo produto</p>
        <h2 className="mt-2 text-2xl font-black text-white">Criar joia</h2>
      </div>

      <div className="mt-5 space-y-4">

        <input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl bg-white/95 px-4 py-3 font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-20 w-full rounded-xl bg-white/95 px-4 py-3 font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Preço (R$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl bg-white/95 px-4 py-3 font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
          />
          <input
            type="number"
            placeholder="Estoque"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-xl bg-white/95 px-4 py-3 font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
          />
        </div>

        {/* ── Category picker ── */}
        <div className="rounded-xl bg-white/10 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
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
                    ? { background: 'rgba(255,255,255,0.95)', color: '#5b2177', fontWeight: 900 }
                    : { border: '1px solid rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.10)', color: '#fff' }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {selectedMain && activeSubs.length > 0 && (
            <div className="mt-3 border-t border-white/20 pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Subcategoria — {selectedMain}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {activeSubs.map((sub) => (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => setSelectedSub(sub.name === selectedSub ? '' : sub.name)}
                    className="rounded-xl px-3 py-2 text-left text-[10px] font-semibold uppercase leading-tight tracking-wide transition hover:opacity-90 active:scale-95"
                    style={
                      selectedSub === sub.name
                        ? { background: 'rgba(255,255,255,0.95)', color: '#be185d', fontWeight: 900 }
                        : { border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }
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
            <p className="mt-3 text-[10px] text-white/50">
              Selecionado:{' '}
              <span className="font-bold text-white/90">
                {selectedSub || selectedMain}
              </span>
              {!resolvedCategoryId() && (
                <span className="ml-2 text-yellow-300">
                  (categoria não encontrada no banco — crie-a primeiro)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Image upload */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/70">Foto do produto</p>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/40 bg-white/10 py-5 transition hover:bg-white/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="text-sm font-bold text-white/80">
              {image ? image.name : 'Selecionar foto da galeria'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0]
                  setImage(file)
                  setPreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
        </div>

        {preview && (
          <img src={preview} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
        )}

        <button
          onClick={handleCreateProduct}
          className="w-full rounded-xl bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-[#7C3D8E] transition hover:bg-white/90 active:scale-[0.99]"
        >
          Criar Produto
        </button>
      </div>
    </div>
  )
}
