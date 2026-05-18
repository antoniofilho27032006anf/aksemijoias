'use client'

import { useState } from 'react'

import { useCart } from '../contexts/CartContext'

import { api } from '../services/api'

import { Copy } from 'lucide-react'

export function CartSidebar() {

  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    clearCart
  } = useCart()

  const [pixQrCode, setPixQrCode] =
    useState('')

  const [pixCode, setPixCode] =
    useState('')

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  )

  async function handleCheckout() {

    try {

      const user =
        localStorage.getItem('@ak-user')

      if (!user) {

        alert('Faça login')

        return
      }

      const parsedUser =
        JSON.parse(user)

      const response =
        await api.post('/orders', {

          userId: parsedUser.id,

          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))

        })

      setPixQrCode(
        response.data.pix.qr_code_base64
      )

      setPixCode(
        response.data.pix.qr_code
      )

      alert('Pedido realizado!')

      clearCart()

    } catch (error) {

      console.log(error)

      alert('Erro ao finalizar pedido')

    }
  }

  async function handleCopyPix() {

    await navigator.clipboard.writeText(
      pixCode
    )

    alert('PIX copiado!')
  }

  if (!isCartOpen) {
    return null
  }

  return (
    <>

      <div
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col overflow-y-auto border-l border-pink-300/10 bg-[#100713]/95 p-6 shadow-[0_0_120px_rgba(0,0,0,0.45)] sm:w-96 animate-slide-in">

        <button
          onClick={closeCart}
          className="absolute right-4 top-4 rounded-full bg-white/5 px-3 py-2 text-2xl text-zinc-200 transition hover:bg-white/10"
        >
          ✕
        </button>

        <div className="mt-8">

          <h2 className="text-3xl font-bold text-white">
            Meu Carrinho
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Peças delicadas aguardando seu toque final.
          </p>

        </div>

        <div className="mt-8 flex flex-col gap-4">

          {cart.length === 0 ? (

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-center text-zinc-300">
              Seu carrinho está vazio.
            </div>

          ) : (

            cart.map((item) => (

              <div
                key={item.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(255,182,193,0.08)]"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-2xl object-cover"
                />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Quantidade: {item.quantity}
                </p>

                <p className="mt-2 text-xl font-bold text-pink-300">
                  R$ {item.price.toFixed(2)}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  className="mt-4 rounded-full bg-pink-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
                >
                  Remover
                </button>

              </div>

            ))

          )}

        </div>

        {pixQrCode && (

          <div className="mt-8 rounded-[2rem] border border-green-500/20 bg-green-500/10 p-6">

            <h3 className="text-center text-xl font-bold text-white">
              PIX Gerado
            </h3>

            <img
              src={`data:image/png;base64,${pixQrCode}`}
              alt="PIX QRCode"
              className="mx-auto mt-6 h-56 w-56 rounded-2xl bg-white p-4"
            />

            <div className="mt-6">

              <textarea
                value={pixCode}
                readOnly
                className="h-32 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-300"
              />

              <button
                onClick={handleCopyPix}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-400"
              >

                <Copy size={18} />

                Copiar chave PIX

              </button>

            </div>

          </div>

        )}

        <div className="mt-auto border-t border-white/10 pt-6">

          <div className="flex items-center justify-between gap-4">

            <span className="text-sm uppercase tracking-[0.2em] text-zinc-400">
              Total
            </span>

            <span className="text-2xl font-bold text-white">
              R$ {total.toFixed(2)}
            </span>

          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95"
          >
            Finalizar Compra
          </button>

        </div>

      </div>

    </>

  )
}