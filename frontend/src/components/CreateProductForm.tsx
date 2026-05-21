'use client'

import { useEffect, useState } from 'react'

import { api } from '../services/api'
import { toast } from 'sonner'

interface Category {
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
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  async function handleCreateProduct() {

    try {

      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)

      if (categoryId) formData.append('categoryId', categoryId)
      if (image) formData.append('image', image)

      await api.post(
        '/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      toast.success('Produto criado com sucesso!')

      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setImage(null)
      setPreview('')
      setCategoryId('')

    } catch (error) {

      console.log(error)
      toast.error('Erro ao criar produto')

    }

  }

  return (

    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Novo produto
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Criar joia
        </h2>

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
          className="h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
        />

        <input
          type="number"
          placeholder="Preço"
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

        {/* Category selector */}
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/50">
            Categoria
          </p>
          {categories.length === 0 ? (
            <p className="text-sm text-white/30">Carregando categorias…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id === categoryId ? '' : cat.id)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 active:scale-95"
                  style={
                    categoryId === cat.id
                      ? {
                          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #5b21b6 100%)',
                          color: '#ffffff',
                        }
                      : {
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.65)',
                        }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

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
          <img
            src={preview}
            alt="Preview"
            className="h-72 w-full rounded-2xl object-cover"
          />
        )}

        <button
          onClick={handleCreateProduct}
          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-4 font-semibold text-white transition hover:opacity-95"
        >
          Criar Produto
        </button>

      </div>

    </div>

  )
}
