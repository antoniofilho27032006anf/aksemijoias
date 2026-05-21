'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      await signIn(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-bg-gold flex min-h-screen items-center justify-center bg-black px-4">
      <style>{`footer { display: none !important; }`}</style>
      <div className="w-full max-w-[290px] rounded-2xl bg-white px-5 py-7 shadow-2xl">

        {/* Logo/topo */}
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-2 h-32 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bem-vinda</h1>
          <p className="mt-1 text-sm text-gray-500">Acesse sua conta exclusiva</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-violet-400 focus:bg-white"
            />
            <div className="mt-1.5 flex justify-end">
              <Link href="/forgot-password" className="text-[11px] text-violet-500 hover:text-violet-700 transition">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            onClick={handleLogin as any}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Ainda não tem conta?{' '}
          <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-800 transition">
            Criar conta
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
