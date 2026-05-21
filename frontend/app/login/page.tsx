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
    <div className="flex min-h-screen items-center justify-center bg-black px-4 relative overflow-hidden">

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
          50% { transform: translateY(-22px) rotate(12deg); opacity: 0.38; }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
          50% { transform: translateY(-30px) rotate(-18deg); opacity: 0.3; }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-18px) rotate(8deg); opacity: 0.4; }
        }
      `}</style>

      {/* Joias flutuantes */}
      <div className="pointer-events-none absolute inset-0">
        {/* Anéis */}
        {[
          { top: '8%', left: '5%', size: 38, delay: '0s', dur: '4s', anim: 'floatA' },
          { top: '20%', right: '8%', size: 28, delay: '1s', dur: '5s', anim: 'floatB' },
          { top: '55%', left: '3%', size: 44, delay: '2s', dur: '4.5s', anim: 'floatC' },
          { top: '75%', right: '5%', size: 32, delay: '0.5s', dur: '6s', anim: 'floatA' },
          { top: '40%', left: '88%', size: 24, delay: '1.5s', dur: '3.8s', anim: 'floatB' },
          { top: '88%', left: '15%', size: 36, delay: '3s', dur: '5.2s', anim: 'floatC' },
        ].map((item, i) => (
          <svg key={i} width={item.size} height={item.size} viewBox="0 0 40 40" fill="none"
            style={{ position: 'absolute', top: item.top, left: (item as any).left, right: (item as any).right,
              animation: `${item.anim} ${item.dur} ${item.delay} ease-in-out infinite` }}>
            <circle cx="20" cy="20" r="13" stroke="#d4a853" strokeWidth="2.5" fill="none" />
            <circle cx="20" cy="20" r="7" stroke="#8b5cf6" strokeWidth="1.5" fill="rgba(139,92,246,0.08)" />
            <circle cx="20" cy="9" r="3" fill="rgba(212,168,83,0.35)" stroke="#d4a853" strokeWidth="1.2" />
          </svg>
        ))}

        {/* Brincos */}
        {[
          { top: '15%', left: '80%', delay: '0.8s', dur: '4.2s', anim: 'floatB' },
          { top: '65%', left: '92%', delay: '2.2s', dur: '5s', anim: 'floatA' },
          { top: '35%', left: '2%', delay: '1.8s', dur: '4.8s', anim: 'floatC' },
          { top: '82%', left: '70%', delay: '0.3s', dur: '3.5s', anim: 'floatA' },
        ].map((item, i) => (
          <svg key={i} width="22" height="36" viewBox="0 0 22 36" fill="none"
            style={{ position: 'absolute', top: item.top, left: item.left,
              animation: `${item.anim} ${item.dur} ${item.delay} ease-in-out infinite` }}>
            <circle cx="11" cy="5" r="4" stroke="#d4a853" strokeWidth="1.5" fill="rgba(212,168,83,0.15)" />
            <line x1="11" y1="9" x2="11" y2="16" stroke="#d4a853" strokeWidth="1.2" />
            <ellipse cx="11" cy="26" rx="6" ry="9" stroke="#8b5cf6" strokeWidth="1.5" fill="rgba(139,92,246,0.12)" />
            <ellipse cx="11" cy="26" rx="3" ry="5" fill="rgba(212,168,83,0.2)" />
          </svg>
        ))}
      </div>
      <div className="w-full max-w-[290px] rounded-2xl bg-white px-5 py-7 shadow-2xl">

        {/* Logo/topo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-amber-300 bg-amber-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L9 8H3L8 12.5L6 19L12 15L18 19L16 12.5L21 8H15L12 2Z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(217,119,6,0.12)" />
            </svg>
          </div>
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
