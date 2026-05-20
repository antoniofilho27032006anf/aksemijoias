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
    <div className="flex min-h-screen">

      {/* Painel esquerdo — imagem */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-end pb-16"
        style={{
          backgroundImage: "url('/bg-login.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <div className="mb-3 flex justify-center">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
          <p className="text-xs font-light uppercase tracking-[0.5em] text-amber-300">Faça parte do nosso mundo</p>
          <p className="mt-4 text-lg font-light leading-relaxed text-white/70 max-w-xs mx-auto">
            Crie sua conta e explore nossa coleção de semijoias exclusivas.
          </p>
          <div className="mt-3 flex justify-center">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex w-full flex-col items-center justify-center lg:w-[45%] relative"
        style={{
          background: 'linear-gradient(160deg, #1a0a2e 0%, #0f0520 60%, #1a0a2e 100%)'
        }}
      >
        {/* Mobile background */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage: "url('/bg-login.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 lg:hidden bg-black/65" />

        <div className="relative z-10 w-full max-w-[340px] px-4 py-10 sm:max-w-sm">

          {/* Logo/topo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30"
              style={{ background: 'linear-gradient(135deg, #2d1b4e, #1a0a2e)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#d4a853" strokeWidth="1.5" fill="rgba(212,168,83,0.15)" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Criar conta</h1>
            <p className="mt-1.5 text-sm text-white/40">Junte-se à nossa comunidade</p>
          </div>

          {/* Form */}
          <div className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-400/70">
                Nome
              </label>
              <input
                type="text"
                placeholder="Como podemos te chamar?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition duration-200 focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-400/70">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition duration-200 focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-400/70">
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition duration-200 focus:border-amber-400/50"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              onClick={handleRegister as any}
              className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-transparent" />
              <span className="relative">{loading ? 'Criando conta...' : 'Criar minha conta'}</span>
            </button>
          </div>

          {/* Divisor */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }} />
            <span className="text-[10px] uppercase tracking-widest text-white/20">ou</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }} />
          </div>

          <p className="text-center text-sm text-white/30">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition">
              Entrar
            </Link>
          </p>

          <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/20 hover:text-white/40 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  )
}
