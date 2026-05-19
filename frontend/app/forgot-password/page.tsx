'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/src/components/Navbar'
import { api } from '@/src/services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await api.post('/users/password/forgot', { email })
      setMessage('Token de recuperação enviado com sucesso.')
      setToken(response.data.resetToken)
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao gerar token de recuperação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[560px] px-6 py-20 sm:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/90 p-10 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
          <h1 className="text-4xl font-black text-slate-900">Recuperar senha</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Digite seu email para receber o link de redefinição ou o token temporário.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Seu email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Enviando...' : 'Enviar token'}
            </button>
          </form>

          {message ? (
            <p className="mt-5 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">{message}</p>
          ) : null}

          {token ? (
            <div className="mt-4 rounded-3xl border border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
              Token: <strong>{token}</strong>
              <p className="mt-2 text-xs text-slate-500">Use este token na página de redefinição para recuperar sua senha.</p>
            </div>
          ) : null}

          <div className="mt-8 text-center text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-pink-600 hover:text-pink-700">Voltar ao login</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
