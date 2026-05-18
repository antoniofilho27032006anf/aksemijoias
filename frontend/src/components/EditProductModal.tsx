'use client'

import { useState } from 'react'

import { api } from '../services/api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
}

interface Props {
  product: Product
  onClose: () => void
  onUpdated: () => void
}

export function EditProductModal({
  product,
  onClose,
  onUpdated
}: Props) {

  const [name, setName] =
    useState(product.name)

  const [description, setDescription] =
    useState(product.description)

  const [price, setPrice] =
    useState(String(product.price))

  const [stock, setStock] =
    useState(String(product.stock))

  const [image, setImage] =
    useState<File | null>(null)

  async function handleUpdateProduct() {

  try {

    const formData = new FormData()

    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)

    if (image) {
      formData.append('image', image)
    }

    await api.put(
      `/products/${product.id}`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data'
        }
      }
    )

    alert('Produto atualizado!')

    onUpdated()

    onClose()

  } catch (error) {

    console.log(error)

    alert('Erro ao atualizar produto')

  }
}

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#12081b] p-8">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Editar produto
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-white"
          >
            ×
          </button>

        </div>

        <div className="mt-8 space-y-5">

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

                 if (e.target.files) {
                 setImage(e.target.files[0])
             }

     }}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
/>

          <button
            onClick={handleUpdateProduct}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-4 font-semibold text-white"
          >
            Salvar alterações
          </button>

        </div>

      </div>

    </div>
  )
}