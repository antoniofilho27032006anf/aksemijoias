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

        <div className="mt-16">

          <h2 className="text-3xl font-black text-white">
            Pedidos Recentes
          </h2>

          <div className="mt-8 space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
              >

                <div className="flex flex-col gap-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="text-sm text-zinc-400">
                        Cliente
                      </p>

                      <h3 className="text-xl font-bold text-white">
                        {order.user.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {order.user.email}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-zinc-400">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-pink-400">

                        {order.status === 'PENDING' && 'Pendente'}

                        {order.status === 'PAID' && 'Pago'}

                        {order.status === 'SENT' && 'Enviado'}

                        {order.status === 'DELIVERED' && 'Entregue'}

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-zinc-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        R$ {order.total.toFixed(2)}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'PENDING'
                        )
                      }
                      className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Pendente
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'PAID'
                        )
                      }
                      className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Pago
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'SENT'
                        )
                      }
                      className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Enviado
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'DELIVERED'
                        )
                      }
                      className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Entregue
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}