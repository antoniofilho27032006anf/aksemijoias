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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!user) {
      router.push('/login')
      return
    }

    if (cart.length === 0) {
      setMessage('Seu carrinho está vazio.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await api.post('/orders', {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        couponCode: couponCode.trim() || undefined,
        paymentMethod: 'pix'
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
      console.log(error)
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 py-12 sm:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.9fr,_0.6fr]">
          <section className="rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
            <h1 className="text-4xl font-black text-slate-900">Checkout</h1>
            <p className="mt-3 text-sm text-slate-600">Finalize sua compra com pagamento via PIX.</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/5 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Resumo do pedido</h2>
                <div className="mt-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/70 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-pink-500">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span className="text-2xl font-black text-pink-500">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {!pixCode && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-3xl border border-green-200 bg-green-50 p-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white text-xl font-bold">
                      PIX
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Pagamento via PIX</p>
                      <p className="text-sm text-slate-500">Aprovação imediata após o pagamento</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/80 p-5">
                    <label className="block text-sm font-semibold text-slate-700">Cupom de desconto</label>
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código do cupom (opcional)"
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Gerando PIX...' : 'Gerar QR Code PIX'}
                  </button>
                </form>
              )}

              {message && (
                <div className="rounded-[2rem] border border-red-200 bg-red-50 p-5 text-red-700">
                  <p>{message}</p>
                </div>
              )}

              {pixCode && (
                <div className="rounded-[2rem] border border-green-200 bg-green-50 p-6 space-y-5">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      ✓ PIX gerado com sucesso!
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Escaneie o QR Code ou copie o código para pagar</p>
                  </div>

                  {pixQr && (
                    <div className="flex justify-center">
                      <img
                        src={`data:image/png;base64,${pixQr}`}
                        alt="QRCode PIX"
                        className="h-56 w-56 rounded-3xl bg-white p-3 shadow-md"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Código PIX copia e cola:</p>
                    <div className="relative">
                      <textarea
                        readOnly
                        value={pixCode}
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 pr-14 text-xs text-slate-600 outline-none resize-none h-24"
                      />
                      <button
                        onClick={handleCopy}
                        title="Copiar código PIX"
                        className="absolute right-3 top-3 flex items-center justify-center rounded-xl bg-green-500 p-2 text-white transition hover:bg-green-400"
                      >
                        {copied ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 font-semibold">✓ Código copiado!</p>
                    )}
                  </div>

                  <p className="text-center text-xs text-slate-400">
                    Após o pagamento, seu pedido será confirmado automaticamente.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-green-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(145,92,255,0.12)]">
              <p className="text-sm uppercase tracking-[0.24em] text-green-600">Pagamento seguro</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">PIX</h2>
              <p className="mt-4 text-sm text-slate-600">Pagamento instantâneo, seguro e sem taxas adicionais.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-green-500">✓</span> Aprovação imediata
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-green-500">✓</span> Sem taxa extra
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-green-500">✓</span> 100% seguro
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
