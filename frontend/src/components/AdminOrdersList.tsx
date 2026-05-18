'use client'

import { useEffect, useState } from 'react'

import { api } from '../services/api'

interface OrderItem {
  id: string
  quantity: number
  price: number

  product: {
    name: string
    image: string
  }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string

  user: {
    name: string
    email: string
  }

  items: OrderItem[]
}

export function AdminOrdersList() {

  const [orders, setOrders] =
    useState<Order[]>([])

  async function loadOrders() {

    const response =
      await api.get('/orders')

    setOrders(response.data)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (

    <div className="mt-20">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Pedidos
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          Pedidos realizados
        </h2>

      </div>

      <div className="mt-10 space-y-6">

        {orders.map((order) => (

          <div
            key={order.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8"
          >

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <h3 className="text-2xl font-bold text-white">
                  {order.user.name}
                </h3>

                <p className="mt-2 text-zinc-400">
                  {order.user.email}
                </p>

                <p className="mt-4 text-sm text-zinc-500">
                  Pedido:
                  {' '}
                  {order.id}
                </p>

              </div>

              <div>

                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Total
                </p>

                <h2 className="mt-2 text-3xl font-black text-pink-300">
                  R$ {order.total.toFixed(2)}
                </h2>

                <span className="mt-3 inline-block rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
                  {order.status}
                </span>

              </div>

            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-40 w-full rounded-2xl object-cover"
                  />

                  <h3 className="mt-4 text-lg font-bold text-white">
                    {item.product.name}
                  </h3>

                  <p className="mt-2 text-zinc-400">
                    Quantidade:
                    {' '}
                    {item.quantity}
                  </p>

                  <p className="mt-2 text-pink-300">
                    R$ {item.price.toFixed(2)}
                  </p>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}