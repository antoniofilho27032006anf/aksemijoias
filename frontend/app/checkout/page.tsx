'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'
import { useAuth } from '@/src/contexts/AuthContext'
import { useCart } from '@/src/contexts/CartContext'
import { api } from '@/src/services/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [pixQr, setPixQr] = useState('')
  const [copied, setCopied] = useState(false)

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  )

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    if (cart.length === 0) { setMessage('Seu carrinho está vazio.'); return }

    try {
      setLoading(true)
      setMessage('')
      const response = await api.post('/orders', {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        couponCode: couponCode.trim() || undefined,
        paymentMethod: 'pix',
      })
      if (response.data.pix) {
        setPixQr(response.data.pix.qr_code_base64)
        setPixCode(response.data.pix.qr_code)
        clearCart()
        return
      }
      clearCart()
      router.push('/checkout/success')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <Navbar />

      <main className="mx-auto max-w-lg px-3 pb-16 pt-5 sm:px-5 lg:max-w-4xl">

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h1 className="text-base font-black" style={{ color: 'var(--c-text)' }}>Checkout</h1>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">

          {/* ── Main column ── */}
          <div className="flex flex-col gap-3 lg:flex-1">

            {/* Order summary */}
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7C3D8E' }}>
                Resumo do pedido
              </p>
              <div className="flex flex-col gap-1.5">
                {cart.length === 0 ? (
                  <p className="py-3 text-center text-xs" style={{ color: 'var(--c-vdim)' }}>Carrinho vazio</p>
                ) : cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg border px-2.5 py-2"
                    style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold" style={{ color: 'var(--c-text)' }}>
                        {item.name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="flex-none text-xs font-black" style={{ color: '#C4509B' }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="mt-2.5 flex items-center justify-between border-t pt-2.5"
                style={{ borderColor: 'var(--c-border)' }}
              >
                <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Total</span>
                <span className="text-sm font-black" style={{ color: '#C4509B' }}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* PIX form */}
            {!pixCode && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

                {/* PIX badge */}
                <div
                  className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
                >
                  <span className="flex h-8 w-12 flex-none items-center justify-center rounded-lg bg-green-500 text-[11px] font-black text-white">
                    PIX
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Pagamento via PIX</p>
                    <p className="text-[10px] text-slate-500">Aprovação imediata após pagamento</p>
                  </div>
                </div>

                {/* Coupon */}
                <div
                  className="rounded-xl border p-3"
                  style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
                >
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
                    Cupom (opcional)
                  </label>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código do cupom"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                    style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)', color: 'var(--c-text)' }}
                  />
                </div>

                {message && (
                  <p className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: '#fee2e2', color: '#991b1b' }}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                >
                  {loading ? 'Gerando PIX...' : 'Gerar QR Code PIX'}
                </button>
              </form>
            )}

            {/* PIX result */}
            {pixCode && (
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
              >
                <div className="mb-3 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ PIX gerado com sucesso!
                  </span>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Escaneie o QR Code ou copie o código para pagar
                  </p>
                </div>

                {pixQr && (
                  <div className="my-3 flex justify-center">
                    <img
                      src={`data:image/png;base64,${pixQr}`}
                      alt="QRCode PIX"
                      className="h-44 w-44 rounded-xl bg-white p-2 shadow-sm"
                    />
                  </div>
                )}

                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a3a6c' }}>
                  Copia e cola:
                </p>
                <div className="relative">
                  <textarea
                    readOnly
                    value={pixCode}
                    className="h-16 w-full resize-none rounded-lg border p-3 pr-12 text-[10px] outline-none"
                    style={{ borderColor: '#d1d5db', background: 'white', color: '#4a5568' }}
                  />
                  <button
                    onClick={handleCopy}
                    type="button"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-400"
                  >
                    {copied ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-[11px] font-semibold text-green-600">✓ Copiado!</p>
                )}
                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Após o pagamento, seu pedido será confirmado automaticamente.
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar: PIX info ── */}
          <div
            className="rounded-xl border p-4 lg:w-52 lg:flex-none"
            style={{ borderColor: '#bbf7d0', background: 'var(--c-card)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
              Pagamento seguro
            </p>
            <p className="mt-1.5 text-sm font-black" style={{ color: 'var(--c-text)' }}>PIX</p>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
              Instantâneo, seguro e sem taxas adicionais.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {['Aprovação imediata', 'Sem taxa extra', '100% seguro'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  <span className="font-bold text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
