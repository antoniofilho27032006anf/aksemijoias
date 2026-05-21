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
    <div className="grid-bg-gold flex min-h-screen items-center justify-center bg-black px-4">
      <style>{`footer { display: none !important; }`}</style>
      <div className="w-full max-w-[290px] rounded-2xl bg-white px-5 py-7 shadow-2xl">

        {/* Logo/topo */}
        <div className="mb-7 text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-2 h-32 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Criar conta</h1>
          <p className="mt-1 text-sm text-gray-500">Junte-se à nossa comunidade</p>
        </div>

        {/* Form */}
        <div className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Nome
            </label>
            <input
              type="text"
              placeholder="Como podemos te chamar?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-violet-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-violet-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Senha
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-violet-400 focus:bg-white"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            onClick={handleRegister as any}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
          >
            {loading ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </div>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-800 transition">
            Entrar
          </Link>
        </p>

        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar à loja
        </Link>
      </div>
    </div>
  )
}
