'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'
import { useAuth } from '@/src/contexts/AuthContext'
import { api } from '@/src/services/api'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}

interface OrderEvent {
  id: string
  status: string
  description?: string
  createdAt: string
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
  orderEvents: OrderEvent[]
}

export default function OrderDetailPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function loadOrder() {
      try {
        const response = await api.get(`/orders/${id}`)
        setOrder(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id, router, user])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 py-12 sm:px-10">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-[2rem] bg-white/70 animate-pulse" />
            ))}
          </div>
        ) : !order ? (
          <div className="rounded-[2rem] border border-pink-100/50 bg-white/90 p-10 text-center text-slate-700 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
            <p>Pedido não encontrado.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-pink-100/50 bg-white/95 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Detalhes do pedido</p>
                  <h1 className="mt-3 text-4xl font-black text-slate-900">Pedido #{order.id.slice(0, 8)}</h1>
                </div>
                <div className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-pink-200">{order.status}</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">R$ {order.total.toFixed(2)}</p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Criado em</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Itens</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{order.items.length}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.65fr,_0.35fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
                <h2 className="text-2xl font-black text-slate-900">Itens do pedido</h2>
                <div className="mt-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[120px,_1fr]">
                      <img src={item.product.image} alt={item.product.name} className="h-28 w-full rounded-3xl object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.product.name}</p>
                        <p className="mt-2 text-sm text-slate-600">Quantidade: {item.quantity}</p>
                        <p className="mt-3 text-lg font-bold text-pink-600">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
                <h2 className="text-2xl font-black text-slate-900">Linha do tempo</h2>
                <div className="mt-6 space-y-4">
                  {order.orderEvents.map((event) => (
                    <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{event.status}</p>
                      <p className="mt-2 text-sm text-slate-600">{event.description || 'Evento registrado'}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(event.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}
