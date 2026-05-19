'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { api } from '@/src/services/api'

export default function RegisterPage() {

  const router = useRouter()

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault()

    try {

      await api.post(
        '/register',
        {
          name,
          email,
          password
        }
      )

      alert('Conta criada com sucesso')

      window.location.href = '/login'

    } catch (error: any) {

      console.log(error)

      alert(
        error?.response?.data?.error ||
        'Erro ao cadastrar'
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09040f] px-6">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-white shadow-2xl"
      >

        <h1 className="text-4xl font-black">
          Criar conta
        </h1>

        <p className="mt-2 text-zinc-400">
          Cadastre-se para comprar
        </p>

        <div className="mt-8 space-y-5">

          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
          />

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
            Criar conta
          </button>

        </div>

      </form>

    </div>
  )
}