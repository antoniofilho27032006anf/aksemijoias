'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'
import { useAuth } from '@/src/contexts/AuthContext'
import { useCart } from '@/src/contexts/CartContext'
import { api } from '@/src/services/api'

const paymentOptions = [
  { value: 'pix', label: 'PIX' },
  { value: 'stripe', label: 'Cartão (Stripe)' },
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'card', label: 'Cartão comum' }
]

type PaymentMethod = 'pix' | 'stripe' | 'mercadopago' | 'card'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [pixQr, setPixQr] = useState('')

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
        userId: user.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        couponCode: couponCode.trim() || undefined,
        paymentMethod,
        returnUrl: `${window.location.origin}/checkout/success`
      })

      if (response.data.stripeUrl) {
        clearCart()
        window.location.href = response.data.stripeUrl
        return
      }

      if (response.data.pix) {
        setPixQr(response.data.pix.qr_code_base64)
        setPixCode(response.data.pix.qr_code)
        setMessage('PIX pronto. Copie o código ou use o QR code para concluir.')
        clearCart()
        return
      }

      setMessage('Pedido criado com sucesso. Confira seus pedidos.')
      clearCart()
      router.push('/checkout/success')
    } catch (error: any) {
      console.log(error)
      setMessage(error?.response?.data?.error || 'Erro ao processar pagamento')
      router.push('/checkout/failure')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 py-12 sm:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.9fr,_0.6fr]">
          <section className="rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
            <h1 className="text-4xl font-black text-slate-900">Checkout</h1>
            <p className="mt-3 text-sm text-slate-600">Finalize sua compra com diversos métodos de pagamento seguros.</p>

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
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentOptions.map((option) => (
                    <label key={option.value} className={`cursor-pointer rounded-3xl border p-4 transition ${paymentMethod === option.value ? 'border-pink-500 bg-pink-50' : 'border-white/10 bg-white/80 hover:border-pink-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value as PaymentMethod)}
                        className="mr-3 h-4 w-4"
                      />
                      <span className="font-semibold text-slate-900">{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/80 p-5">
                  <label className="block text-sm font-semibold text-slate-700">Cupom de desconto</label>
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Código do cupom"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Processando...' : 'Finalizar pedido'}
                </button>
              </form>

              {message ? (
                <div className="rounded-[2rem] border border-pink-200 bg-pink-50 p-5 text-slate-800">
                  <p>{message}</p>
                </div>
              ) : null}

              {pixQr ? (
                <div className="rounded-[2rem] border border-green-200 bg-green-50 p-5">
                  <h2 className="text-lg font-semibold text-slate-900">PIX gerado</h2>
                  <img src={`data:image/png;base64,${pixQr}`} alt="QRCode PIX" className="mt-4 h-52 w-52 rounded-3xl bg-white p-2" />
                  <textarea readOnly value={pixCode} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700" />
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/90 p-6 shadow-[0_30px_80px_rgba(145,92,255,0.12)]">
              <p className="text-sm uppercase tracking-[0.24em] text-pink-700">Pagamento seguro</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Método selecionado</h2>
              <p className="mt-4 text-sm text-slate-600">Todos os pagamentos são feitos em ambiente seguro e confiável.</p>
            </div>
            <div className="rounded-[2rem] border border-pink-100/50 bg-white/90 p-6 shadow-[0_30px_80px_rgba(255,182,193,0.12)]">
              <h3 className="text-lg font-semibold text-slate-900">Ajuda</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Se precisar de suporte, entre em contato com nosso atendimento e acompanhe seu pedido diretamente na área do usuário.</p>
            </div>
          </aside>
        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
