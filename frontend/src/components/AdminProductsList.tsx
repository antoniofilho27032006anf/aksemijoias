'use client'

import { useEffect, useState } from 'react'

import { api } from '../services/api'

import { EditProductModal } from './EditProductModal'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
}

export function AdminProductsList() {

  const [products, setProducts] =
    useState<Product[]>([])

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  async function loadProducts() {

    const response = await api.get('/products')

    setProducts(response.data)
  }

  async function handleDeleteProduct(id: string) {

    const confirmDelete = confirm(
      'Deseja deletar este produto?'
    )

    if (!confirmDelete) {
      return
    }

    await api.delete(`/products/${id}`)

    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (

    <div className="mt-16">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Produtos
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Gerenciar produtos
          </h2>

        </div>

      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

        {products.map((product) => (

          <div
            key={product.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
          >

            <img
              src={product.image}
              alt={product.name}
              className="h-60 w-full rounded-2xl object-cover"
            />

            <h3 className="mt-5 text-2xl font-bold text-white">
              {product.name}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              {product.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">

              <div>

                <p className="text-2xl font-bold text-pink-300">
                  R$ {product.price}
                </p>

                <span className="text-sm text-zinc-500">
                  Estoque: {product.stock}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    setSelectedProduct(product)
                  }
                  className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  Excluir
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {selectedProduct && (

        <EditProductModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onUpdated={loadProducts}
        />

      )}

    </div>
  )
}