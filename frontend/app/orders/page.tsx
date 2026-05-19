'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'
import { useAuth } from '../../src/contexts/AuthContext'
import { api } from '../../src/services/api'

interface ProductInfo {
  id: string
  name: string
  image: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: ProductInfo
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
  user: {
    id: string
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setOrders([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const response = await api.get('/orders')
        const filteredOrders: Order[] = response.data.filter(
          (order: Order) => order.user?.id === user.id
        )
        setOrders(filteredOrders)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 pb-28 sm:px-10">
        <section className="mt-12 rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Meus pedidos</p>
              <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">Histórico de compras</h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                Acompanhe cada pedido, o status do pagamento e os detalhes dos itens escolhidos.
              </p>
            </div>

            <div className="rounded-full bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
              {user ? `${orders.length} pedido(s)` : 'Acesse sua conta'}
            </div>
          </div>
        </section>

        <section className="mt-10">
          {!user ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
              <p className="text-2xl font-semibold text-slate-900">Entre para ver seus pedidos</p>
              <p className="mt-3 text-sm leading-7">Seus pedidos estão sempre disponíveis em sua conta.</p>
              <Link
                href="/login"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Ir para login
              </Link>
            </div>
          ) : loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-40 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-pink-300/40 bg-white/80 p-12 text-center text-slate-600 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
              <p className="text-2xl font-semibold text-slate-900">Nenhum pedido encontrado</p>
              <p className="mt-3 text-sm leading-7">Faça sua primeira compra para ver o pedido aqui.</p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-sm uppercase tracking-[0.3em] text-pink-700">Pedido #{order.id.slice(0, 8)}</span>
                      <h2 className="mt-3 text-2xl font-bold text-slate-900">R$ {order.total.toFixed(2)}</h2>
                    </div>
                    <div className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-pink-200">
                      {order.status.toLowerCase()}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-4">
                          <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-3xl object-cover" />
                          <div>
                            <p className="font-semibold text-slate-100">{item.product.name}</p>
                            <p className="mt-1 text-sm text-slate-400">Qtd: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CartSidebar />
    </div>
  )
}
