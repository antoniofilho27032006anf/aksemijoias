'use client'

import Link from 'next/link'
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

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendente',  color: '#92400e', bg: '#fef3c7' },
  PAID:      { label: 'Pago',      color: '#065f46', bg: '#d1fae5' },
  SENT:      { label: 'Enviado',   color: '#1e40af', bg: '#dbeafe' },
  DELIVERED: { label: 'Entregue',  color: '#5B2170', bg: '#f3e8ff' },
  CANCELLED: { label: 'Cancelado', color: '#991b1b', bg: '#fee2e2' },
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-3 pb-20 pt-5 sm:px-5">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
            <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
              Detalhes do Pedido
            </h1>
          </div>
          <Link
            href="/orders"
            className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-gray-50"
            style={{ color: '#7C3D8E', border: '1px solid #e8d5f5' }}
          >
            ← Voltar
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }} />
            ))}
          </div>
        ) : !order ? (
          <div
            className="flex flex-col items-center gap-3 rounded-2xl border py-14 text-center"
            style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}
          >
            <p className="text-sm font-bold text-gray-700">Pedido não encontrado.</p>
            <Link
              href="/orders"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
            >
              Ver meus pedidos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Order summary */}
            <div
              className="overflow-hidden rounded-xl border bg-white"
              style={{ borderColor: '#e8d5f5' }}
            >
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {(() => {
                  const status = STATUS_MAP[order.status] ?? { label: order.status, color: '#555', bg: '#f3f4f6' }
                  return (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>
                  )
                })()}

                <p className="text-sm font-black" style={{ color: '#C4509B' }}>
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </p>

                <span
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
                  style={{ color: '#7C3D8E', border: '1px solid #e8d5f5', backgroundColor: '#faf5ff' }}
                >
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div
              className="overflow-hidden rounded-xl border bg-white"
              style={{ borderColor: '#e8d5f5' }}
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: '#f3e8ff' }}>
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                  Itens do pedido
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: '#f3e8ff' }}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 px-3 py-2" style={{ borderColor: '#f3e8ff' }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-10 w-10 flex-none rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-gray-700">{item.product.name}</p>
                      <p className="text-[11px] text-gray-400">Qtd: {item.quantity}</p>
                    </div>
                    <p className="flex-none text-[12px] font-bold" style={{ color: '#7C3D8E' }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {order.orderEvents.length > 0 && (
              <div
                className="overflow-hidden rounded-xl border bg-white"
                style={{ borderColor: '#e8d5f5' }}
              >
                <div className="px-3 py-2 border-b" style={{ borderColor: '#f3e8ff' }}>
                  <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                    Linha do tempo
                  </p>
                </div>
                <div className="divide-y" style={{ borderColor: '#f3e8ff' }}>
                  {order.orderEvents.map((event) => (
                    <div key={event.id} className="px-3 py-2.5">
                      <p className="text-[12px] font-semibold text-gray-700">{event.status}</p>
                      <p className="text-[11px] text-gray-400">{event.description || 'Evento registrado'}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                        {new Date(event.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}
