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
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/bg-login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-light uppercase tracking-[0.4em] text-pink-300">Crie sua conta</p>
          <h1
            className="mt-2 text-5xl font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #f9a8d4, #d4a853, #f9a8d4)' }}
          >
            Anna Kelly
          </h1>
          <p className="mt-1 text-sm text-white/60 tracking-widest">Semijóias & Tals.</p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-2xl font-semibold text-white text-center">Criar sua conta</h2>
          <p className="mt-1 text-center text-sm text-white/50">Junte-se à nossa comunidade</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pink-200">
                Seu nome
              </label>
              <input
                type="text"
                placeholder="Como podemos te chamar?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pink-400 focus:bg-white/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pink-200">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pink-400 focus:bg-white/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pink-200">
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pink-400 focus:bg-white/15"
              />
            </div>

            {error && (
              <p className="rounded-2xl bg-red-500/20 px-4 py-3 text-center text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-4 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #ec4899, #d4a853)' }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/50">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-pink-300 hover:text-pink-200 transition">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
