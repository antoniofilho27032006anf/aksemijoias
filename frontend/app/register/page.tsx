'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { api } from '@/src/services/api'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      await api.post('/register', { name, email, password })
      router.push('/login')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: "url('/bg-login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-[320px] px-2 py-4 sm:max-w-sm sm:px-4">
        <form
          onSubmit={handleRegister}
          className="rounded-2xl bg-white px-4 py-5 shadow-[0_32px_80px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10"
        >
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg sm:h-14 sm:w-14">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Criar sua conta</h2>
            <p className="mt-1 text-sm text-slate-400">Junte-se e descubra nossas peças exclusivas</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Como podemos te chamar?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-500 border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-4 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #f472b6, #e11d48)' }}
            >
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs text-slate-300">ou</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-pink-500 hover:text-pink-600 transition">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
