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
  user: { id: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendente',  color: '#92400e', bg: '#fef3c7' },
  PAID:      { label: 'Pago',      color: '#065f46', bg: '#d1fae5' },
  SENT:      { label: 'Enviado',   color: '#1e40af', bg: '#dbeafe' },
  DELIVERED: { label: 'Entregue',  color: '#5B2170', bg: '#f3e8ff' },
  CANCELLED: { label: 'Cancelado', color: '#991b1b', bg: '#fee2e2' },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user) { setLoading(false); return }
      try {
        const res = await api.get('/orders')
        setOrders(res.data.filter((o: Order) => o.user?.id === user.id))
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [user])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-3 pb-20 pt-5 sm:px-5">

        {/* Page header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
            <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
              Meus Pedidos
            </h1>
          </div>
          {user && !loading && (
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold"
              style={{ backgroundColor: '#faf5ff', color: '#7C3D8E', border: '1px solid #e8d5f5' }}
            >
              {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          )}
        </div>

        {/* Content */}
        {!user ? (
          <EmptyState
            title="Entre para ver seus pedidos"
            subtitle="Seus pedidos ficam disponíveis na sua conta."
            cta="Entrar agora"
            href="/login"
          />
        ) : loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="Nenhum pedido ainda"
            subtitle="Faça sua primeira compra e acompanhe tudo aqui."
            cta="Ver produtos"
            href="/"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] ?? { label: order.status, color: '#555', bg: '#f3f4f6' }
              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border bg-white"
                  style={{ borderColor: '#e8d5f5' }}
                >
                  {/* Order summary row */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>

                    <p className="text-sm font-black" style={{ color: '#C4509B' }}>
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>

                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-gray-50"
                      style={{ color: '#7C3D8E', border: '1px solid #e8d5f5' }}
                    >
                      Ver
                    </Link>
                  </div>

                  {/* Items */}
                  {order.items.length > 0 && (
                    <div className="divide-y border-t" style={{ borderColor: '#f3e8ff' }}>
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
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}

function EmptyState({ title, subtitle, cta, href }: { title: string; subtitle: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border py-14 text-center" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: '#f3e8ff' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4B0D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">{title}</p>
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
      >
        {cta}
      </Link>
    </div>
  )
}
