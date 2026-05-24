'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '../contexts/CartContext'

export function CartSidebar() {
  const router = useRouter()
  const { cart, isCartOpen, closeCart, removeFromCart } = useCart()

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  function handleCheckout() {
    closeCart()
    router.push('/checkout')
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col bg-white shadow-2xl sm:w-[360px]">

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #7C3D8E 0%, #C4509B 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <div>
              <h2 className="text-base font-black text-white leading-none">Meu Carrinho</h2>
              <p className="mt-0.5 text-[10px] text-white/70">
                {totalItems === 0 ? 'Vazio' : `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Fechar carrinho"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#faf5ff' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B0D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-700">Carrinho vazio</p>
                <p className="mt-1 text-sm text-gray-400">Adicione produtos para continuar</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-1 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 px-3 py-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">

                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-xl border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-snug text-gray-800">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Qtd: {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-black" style={{ color: '#7C3D8E' }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-400"
                    aria-label="Remover"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-4 pb-6 pt-4">

            {/* PIX discount banner */}
            <div
              className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ backgroundColor: '#faf5ff', border: '1px solid #e8d5f5' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <p className="text-[10px] font-bold" style={{ color: '#7C3D8E' }}>
                Pague no PIX e ganhe <span style={{ color: '#C4509B' }}>5% de desconto!</span>
              </p>
            </div>

            {/* Total */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-black" style={{ color: '#7C3D8E' }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full rounded-xl py-3.5 text-sm font-black uppercase tracking-wide text-white transition hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7C3D8E 0%, #C4509B 100%)' }}
            >
              Finalizar Compra
            </button>

            <button
              onClick={closeCart}
              className="mt-2 w-full rounded-xl py-2.5 text-xs font-semibold text-gray-400 transition hover:text-gray-600"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
