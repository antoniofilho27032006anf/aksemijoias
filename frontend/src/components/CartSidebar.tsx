'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'

import { useCart } from '../contexts/CartContext'

export function CartSidebar() {
  const router = useRouter()
  const { cart, isCartOpen, closeCart, removeFromCart } = useCart()

  const [pixQrCode] = useState('')
  const [pixCode] = useState('')

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  function handleCheckout() {
    closeCart()
    router.push('/checkout')
  }

  async function handleCopyPix() {
    await navigator.clipboard.writeText(pixCode)
    alert('PIX copiado!')
  }

  if (!isCartOpen) return null

  return (
    <>
      <div onClick={closeCart} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />

      <div
        className="animate-slide-in fixed right-0 top-0 z-50 flex h-screen w-full flex-col overflow-y-auto border-l shadow-[0_0_80px_rgba(0,0,0,0.8)] sm:w-96 transition-colors duration-300"
        style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-cart)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: 'var(--c-border)' }}>
          <div>
            <h2 className="text-xl font-black text-white">Carrinho</h2>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--c-dim)' }}>
              {cart.length === 0 ? 'Vazio' : `${cart.length} ${cart.length === 1 ? 'item' : 'itens'}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:text-[#e8c94a]"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--c-dim)' }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="text-sm" style={{ color: 'var(--c-dim)' }}>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)' }}
                >
                  <img src={item.image} alt={item.name} className="h-28 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-snug text-white">{item.name}</h3>
                    <p className="mt-1 text-xs" style={{ color: 'var(--c-muted)' }}>Qtd: {item.quantity}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="text-base font-black"
                        style={{
                          background: 'linear-gradient(135deg, #c9a227 0%, #f0c040 60%, #c9a227 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-[rgba(180,30,30,0.15)]"
                        style={{ borderColor: 'rgba(180,30,30,0.3)', backgroundColor: 'rgba(180,30,30,0.08)' }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pixQrCode && (
            <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: 'rgba(34,197,94,0.2)', backgroundColor: 'rgba(34,197,94,0.06)' }}>
              <h3 className="text-center text-sm font-bold text-white">PIX Gerado</h3>
              <img src={`data:image/png;base64,${pixQrCode}`} alt="PIX QRCode" className="mx-auto mt-4 h-48 w-48 rounded-xl bg-white p-3" />
              <div className="mt-4">
                <textarea
                  value={pixCode}
                  readOnly
                  className="h-24 w-full rounded-xl border p-3 text-xs outline-none"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-glass)', color: 'var(--c-muted)' }}
                />
                <button
                  onClick={handleCopyPix}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#0a0612]"
                  style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
                >
                  <Copy size={16} />
                  Copiar chave PIX
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-5" style={{ borderColor: 'var(--c-border)' }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Total</span>
              <span
                className="text-2xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #c9a227 0%, #f0c040 60%, #c9a227 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-[#0a0612] transition hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  )
}
