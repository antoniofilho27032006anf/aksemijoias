'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/src/components/Navbar'
import { api } from '@/src/services/api'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.')
      return
    }

    if (!token) {
      setMessage('Token inválido.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await api.post('/users/password/reset', {
        token,
        password
      })
      setMessage('Senha redefinida com sucesso.')
      router.push('/login')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[560px] px-6 py-20 sm:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/90 p-10 shadow-[0_40px_120px_rgba(145,92,255,0.08)]">
          <h1 className="text-4xl font-black text-slate-900">Redefinir senha</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Use o token recebido para criar uma nova senha segura.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nova senha"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirme a nova senha"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>

          {message ? (
            <p className="mt-5 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">{message}</p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
