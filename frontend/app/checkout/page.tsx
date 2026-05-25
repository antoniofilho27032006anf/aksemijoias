'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'
import { useAuth } from '@/src/contexts/AuthContext'
import { useCart } from '@/src/contexts/CartContext'
import { api } from '@/src/services/api'

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card'

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  )

  const isCard = paymentMethod === 'credit_card' || paymentMethod === 'debit_card'

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
        paymentMethod: isCard ? 'stripe' : 'pix',
        returnUrl: `${window.location.origin}/checkout`,
      })

      if (response.data.stripeUrl) {
        clearCart()
        window.location.href = response.data.stripeUrl
        return
      }
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

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6">

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg,#7C3D8E,#C4509B)' }} />
            <h1 className="text-lg font-black uppercase tracking-[0.15em] text-brand">Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Compra segura
          </div>
        </div>

        {/* PIX success screen */}
        {pixCode ? (
          <PixResult pixQr={pixQr} pixCode={pixCode} copied={copied} onCopy={handleCopy} />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 lg:grid-cols-[1fr,360px] lg:items-start">

              {/* Left: payment + coupon */}
              <div className="flex flex-col gap-4">

                <Section label="Forma de pagamento">
                  <div className="flex flex-col gap-2">
                    <PaymentOption
                      id="pix"
                      selected={paymentMethod === 'pix'}
                      onSelect={() => setPaymentMethod('pix')}
                      icon={<PixIcon />}
                      label="PIX"
                      sub="Aprovação instantânea · Sem taxas"
                      accent="#22c55e"
                      accentBg="#f0fdf4"
                      accentBorder="#bbf7d0"
                    />
                    <PaymentOption
                      id="credit_card"
                      selected={paymentMethod === 'credit_card'}
                      onSelect={() => setPaymentMethod('credit_card')}
                      icon={<CardIcon stroke="#7C3D8E" />}
                      label="Cartão de Crédito"
                      sub="Visa, Mastercard, Elo e outros"
                      accent="#7C3D8E"
                      accentBg="#faf5ff"
                      accentBorder="#e8d5f5"
                    />
                    <PaymentOption
                      id="debit_card"
                      selected={paymentMethod === 'debit_card'}
                      onSelect={() => setPaymentMethod('debit_card')}
                      icon={<CardIcon stroke="#C4509B" dot />}
                      label="Cartão de Débito"
                      sub="Débito à vista · Processado pelo Stripe"
                      accent="#C4509B"
                      accentBg="#fff0f8"
                      accentBorder="#f5c6e5"
                    />
                  </div>

                  {isCard && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-[11px] text-brand-800">
                      <svg className="mt-0.5 flex-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Você será redirecionado para o ambiente seguro do Stripe para inserir os dados do cartão.
                    </div>
                  )}
                </Section>

                <Section label="Cupom de desconto">
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Digite seu cupom"
                      className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-purple-200"
                      style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)', color: 'var(--c-text)' }}
                    />
                    {couponCode && (
                      <button
                        type="button"
                        onClick={() => setCouponCode('')}
                        className="rounded-xl border px-3 py-2.5 text-xs font-semibold transition hover:bg-gray-50"
                        style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </Section>

                {message && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {message}
                  </div>
                )}

                {/* Submit (mobile) */}
                <div className="lg:hidden">
                  <SubmitButton loading={loading} isCard={isCard} paymentMethod={paymentMethod} />
                </div>
              </div>

              {/* Right: order summary (sticky) */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-6">
                <Section label="Resumo do pedido">
                  {cart.length === 0 ? (
                    <p className="py-4 text-center text-xs" style={{ color: 'var(--c-vdim)' }}>
                      Seu carrinho está vazio
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative flex-none">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded-xl object-cover"
                              style={{ border: '1px solid var(--c-border)' }}
                            />
                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold" style={{ color: 'var(--c-text)' }}>
                              {item.name}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>
                              {item.quantity}× R$ {item.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                          <p className="flex-none text-xs font-black text-brand-pink">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totals */}
                  <div
                    className="mt-4 flex flex-col gap-1.5 border-t pt-4"
                    style={{ borderColor: 'var(--c-border)' }}
                  >
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--c-muted)' }}>
                      <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} itens)</span>
                      <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--c-muted)' }}>
                      <span>Frete</span>
                      <span className="font-semibold text-green-600">Grátis</span>
                    </div>
                    {couponCode && (
                      <div className="flex items-center justify-between text-xs text-green-600">
                        <span>Cupom <span className="font-bold">"{couponCode.toUpperCase()}"</span></span>
                        <span>—</span>
                      </div>
                    )}
                    <div
                      className="mt-1.5 flex items-center justify-between border-t pt-2.5"
                      style={{ borderColor: 'var(--c-border)' }}
                    >
                      <span className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>Total</span>
                      <span className="text-base font-black text-brand-pink">
                        R$ {total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </Section>

                {/* Submit (desktop) */}
                <div className="hidden lg:block">
                  <SubmitButton loading={loading} isCard={isCard} paymentMethod={paymentMethod} />
                </div>

                {/* Trust badges */}
                <div
                  className="flex items-center justify-center gap-4 rounded-xl border px-4 py-3"
                  style={{ background: 'var(--c-raised)', borderColor: 'var(--c-border)' }}
                >
                  {[
                    { icon: '🔒', label: 'SSL seguro' },
                    { icon: '✓', label: 'Dados protegidos' },
                    { icon: '↩', label: 'Troca garantida' },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{b.icon}</span>
                      <span className="text-[9px] font-semibold" style={{ color: 'var(--c-vdim)' }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </form>
        )}
      </main>

      <CartSidebar />
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
    >
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand">
        {label}
      </p>
      {children}
    </div>
  )
}

function PaymentOption({
  selected, onSelect, icon, label, sub, accent, accentBg, accentBorder,
}: {
  id: string
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  label: string
  sub: string
  accent: string
  accentBg: string
  accentBorder: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition"
      style={{
        borderColor: selected ? accentBorder : 'var(--c-border)',
        background: selected ? accentBg : 'var(--c-card)',
      }}
    >
      <div
        className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
        style={{ background: selected ? accentBorder : 'var(--c-border)', opacity: selected ? 1 : 0.5 }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold" style={{ color: selected ? accent : 'var(--c-text)' }}>{label}</p>
        <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>{sub}</p>
      </div>
      <span
        className="flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 transition"
        style={{ borderColor: selected ? accent : '#d1d5db' }}
      >
        {selected && <span className="h-2 w-2 rounded-full" style={{ background: accent }} />}
      </span>
    </button>
  )
}

function SubmitButton({ loading, isCard, paymentMethod }: { loading: boolean; isCard: boolean; paymentMethod: string }) {
  const label = loading
    ? (isCard ? 'Redirecionando...' : 'Gerando PIX...')
    : (isCard
        ? `Pagar com ${paymentMethod === 'credit_card' ? 'Crédito' : 'Débito'}`
        : 'Gerar QR Code PIX')

  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-2xl py-3.5 text-sm font-black text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      style={{
        background: isCard
          ? 'linear-gradient(135deg,#7C3D8E,#C4509B)'
          : 'linear-gradient(135deg,#22c55e,#16a34a)',
        boxShadow: isCard
          ? '0 8px 24px rgba(124,61,142,0.25)'
          : '0 8px 24px rgba(34,197,94,0.25)',
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {label}
        </span>
      ) : label}
    </button>
  )
}

function PixResult({ pixQr, pixCode, copied, onCopy }: { pixQr: string; pixCode: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            PIX gerado com sucesso!
          </span>
        </div>
        <p className="text-xs text-slate-500">Escaneie o QR Code ou copie o código abaixo para pagar</p>

        {pixQr && (
          <div className="my-5 flex justify-center">
            <img
              src={`data:image/png;base64,${pixQr}`}
              alt="QRCode PIX"
              className="h-48 w-48 rounded-2xl bg-white p-3 shadow-md"
            />
          </div>
        )}

        <p className="mb-2 text-left text-[10px] font-bold uppercase tracking-wider text-brand-900">
          Copia e cola
        </p>
        <div className="relative">
          <textarea
            readOnly
            value={pixCode}
            className="h-16 w-full resize-none rounded-xl border border-gray-200 bg-white p-3 pr-12 text-[10px] text-gray-600 outline-none"
          />
          <button
            onClick={onCopy}
            type="button"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-400"
          >
            {copied ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            )}
          </button>
        </div>
        {copied && <p className="mt-1.5 text-left text-[11px] font-semibold text-green-600">✓ Código copiado!</p>}

        <p className="mt-4 text-[10px] text-slate-400">
          Após o pagamento, seu pedido será confirmado automaticamente.
        </p>
      </div>
    </div>
  )
}

function PixIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

function CardIcon({ stroke, dot }: { stroke: string; dot?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={stroke} strokeWidth="2"/>
      <line x1="1" y1="10" x2="23" y2="10" stroke={stroke} strokeWidth="2"/>
      {dot && <line x1="5" y1="15" x2="9" y2="15" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>}
    </svg>
  )
}
