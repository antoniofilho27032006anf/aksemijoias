'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/contexts/AuthContext'

export default function LoginPage() {

  const router = useRouter()

  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault()

    try {

      await signIn(
        email,
        password
      )

      router.push('/')

    } catch (error) {

      alert('Erro ao fazer login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09040f] px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-white shadow-2xl"
      >

        <h1 className="text-4xl font-black">
          Entrar
        </h1>

        <p className="mt-2 text-zinc-400">
          Faça login para continuar
        </p>

        <div className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-pink-500 py-4 font-semibold transition hover:bg-pink-600"
          >
            Entrar
          </button>

        </div>

      </form>

    </div>
  )
}