'use client'

import Link from 'next/link'
import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,126,255,0.16),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,144,209,0.14),transparent_24%),linear-gradient(180deg,#f5f2ff_0%,#ffffff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[900px] px-6 py-24 sm:px-10">
        <div className="rounded-[2rem] border border-pink-200/50 bg-white/95 p-12 text-center shadow-[0_40px_120px_rgba(255,182,193,0.14)]">
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">Pagamento aprovado</span>
          <h1 className="mt-8 text-5xl font-black text-slate-900">Compra concluída</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">Seu pedido foi recebido e está em processamento. Confira o status na área de pedidos.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/orders" className="rounded-full bg-pink-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-pink-600">
              Meus pedidos
            </Link>
            <Link href="/" className="rounded-full border border-pink-200 px-8 py-4 text-sm font-semibold text-pink-600 transition hover:bg-pink-50">
              Voltar à loja
            </Link>
          </div>
        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
