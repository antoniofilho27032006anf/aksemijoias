'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/contexts/AuthContext'
import { CreateProductForm } from '@/src/components/CreateProductForm'
import { api } from '@/src/services/api'

export default function AdminPage() {

  const { user } = useAuth() as any

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [stats, setStats] =
    useState({

      products: 0,
      orders: 0,
      users: 0

    })

  const [orders, setOrders] =
    useState<any[]>([])

  const [products, setProducts] =
    useState<any[]>([])

  const [editingProduct, setEditingProduct] =
    useState<any | null>(null)

  const [editForm, setEditForm] =
    useState({

      name: '',
      description: '',
      price: '',
      stock: '',
      image: ''

    })

  useEffect(() => {

    const token =
      localStorage.getItem('@ak-token')

    if (!token) {

      router.push('/login')

    } else {

      setLoading(false)

      api
        .get('/admin/dashboard')
        .then((response) => {

          setStats(response.data)

        })
        .catch((error) => {

          console.log(error)

        })

      api
        .get('/admin/orders')
        .then((response) => {

          setOrders(response.data)

        })
        .catch((error) => {

          console.log(error)

        })

      api
        .get('/admin/products')
        .then((response) => {

          setProducts(response.data)

        })
        .catch((error) => {

          console.log(error)

        })

    }

  }, [router])

  async function handleUpdateStatus(
    orderId: string,
    status: string
  ) {

    try {

      await api.patch(

        `/admin/orders/${orderId}`,

        {
          status
        }

      )

      setOrders((prevOrders) =>

        prevOrders.map((order) => {

          if (order.id === orderId) {

            return {
              ...order,
              status
            }
          }

          return order

        })

      )

    } catch (error) {

      console.log(error)

      alert('Erro ao atualizar status')

    }

  }

  async function handleDeleteProduct(
    productId: string
  ) {

    const confirmDelete =
      confirm(
        'Deseja realmente excluir este produto?'
      )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(
        `/admin/products/${productId}`
      )

      setProducts((prevProducts) =>

        prevProducts.filter(
          (product) =>
            product.id !== productId
        )

      )

      setStats((prev) => ({
        ...prev,
        products:
          prev.products - 1
      }))

      alert('Produto excluído')

    } catch (error) {

      console.log(error)

      alert('Erro ao excluir produto')

    }

  }

  function handleEditProduct(
    product: any
  ) {

    setEditingProduct(product)

    setEditForm({

      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image

    })

  }

  async function handleSaveEdit() {

    try {

      const response =
        await api.put(

          `/admin/products/${editingProduct.id}`,

          {

            name: editForm.name,

            description:
              editForm.description,

            price:
              Number(editForm.price),

            stock:
              Number(editForm.stock),

            image:
              editForm.image

          }

        )

      setProducts((prevProducts) =>

        prevProducts.map((product) => {

          if (
            product.id ===
            editingProduct.id
          ) {

            return response.data
          }

          return product

        })

      )

      setEditingProduct(null)

      alert('Produto atualizado')

    } catch (error) {

      console.log(error)

      alert('Erro ao editar produto')

    }

  }

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  if (user.role !== 'ADMIN') {

    return (

      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-3xl font-bold">
          Acesso negado
        </h1>

      </div>

    )
  }

  return (

    <div className="min-h-screen bg-[#09040f] p-10 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Painel Administrativo
            </p>

            <h1 className="mt-4 text-5xl font-black">
              Bem-vindo, {user.name}
            </h1>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4">

            <p className="text-sm text-zinc-400">
              Status
            </p>

            <p className="mt-1 font-semibold text-green-400">
              Online
            </p>

          </div>

        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">

            <p className="text-zinc-400">
              Produtos
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {stats.products}
            </h2>

          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">

            <p className="text-zinc-400">
              Pedidos
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {stats.orders}
            </h2>

          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">

            <p className="text-zinc-400">
              Clientes
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {stats.users}
            </h2>

          </div>

        </div>

        <div className="mt-12">

          <CreateProductForm />

        </div>

        {editingProduct && (

          <div className="mt-12 rounded-[2rem] border border-pink-500 bg-white/5 p-8">

            <h2 className="text-3xl font-black text-white">
              Editar Produto
            </h2>

            <div className="mt-8 space-y-4">

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
                placeholder="Nome"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description:
                      e.target.value
                  })
                }
                placeholder="Descrição"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <input
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: e.target.value
                  })
                }
                placeholder="Preço"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <input
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    stock: e.target.value
                  })
                }
                placeholder="Estoque"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <input
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    image: e.target.value
                  })
                }
                placeholder="Imagem URL"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <div className="flex gap-4">

                <button
                  onClick={handleSaveEdit}
                  className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white"
                >
                  Salvar
                </button>

                <button
                  onClick={() =>
                    setEditingProduct(null)
                  }
                  className="rounded-full bg-zinc-700 px-6 py-3 font-semibold text-white"
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        )}

        <div className="mt-16">

          <h2 className="text-3xl font-black text-white">
            Produtos
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

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

                <div className="mt-5 flex items-center justify-between">

                  <p className="text-xl font-black text-pink-400">
                    R$ {product.price.toFixed(2)}
                  </p>

                  <p className="text-sm text-zinc-400">
                    Estoque: {product.stock}
                  </p>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      handleEditProduct(product)
                    }
                    className="w-full rounded-full bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(
                        product.id
                      )
                    }
                    className="w-full rounded-full bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400"
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}