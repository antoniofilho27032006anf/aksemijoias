'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/src/components/Navbar'
import { CartSidebar } from '@/src/components/CartSidebar'
import { useAuth } from '@/src/contexts/AuthContext'
import { api } from '@/src/services/api'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function AccountPage() {
  const router = useRouter()
  const { user, updateProfile, changePassword } = useAuth() as any
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    setName(user.name)
    setEmail(user.email)
    setAvatarUrl(user.avatarUrl || '')

    async function loadOrders() {
      try {
        const response = await api.get('/orders')
        setOrders(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [router, user])

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')

    try {
      const updated = await updateProfile({ name, email, avatarUrl })
      setMessage('Perfil atualizado com sucesso.')
      setName(updated.name)
      setEmail(updated.email)
      setAvatarUrl(updated.avatarUrl || '')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao atualizar perfil')
    }
  }

  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault()
    setPasswordMessage('')

    try {
      await changePassword(currentPassword, newPassword)
      setPasswordMessage('Senha alterada com sucesso.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (error: any) {
      setPasswordMessage(error?.response?.data?.error || 'Erro ao alterar senha')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.24),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(155,92,255,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7efff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-[1320px] px-6 py-12 sm:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.9fr,_0.5fr]">
          <section className="space-y-8 rounded-[2rem] border border-pink-100/50 bg-white/85 p-8 shadow-[0_40px_120px_rgba(145,92,255,0.12)]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Minha conta</p>
              <h1 className="mt-3 text-4xl font-black text-slate-900">Perfil do usuário</h1>
              <p className="mt-4 text-sm text-slate-600">Edite suas informações, atualize o avatar e gerencie sua senha.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
                />
              </div>
              <input
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="URL da foto de perfil"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
              <button className="rounded-full bg-pink-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-pink-600">Salvar perfil</button>
            </form>

            {message ? <div className="rounded-3xl bg-green-50 p-4 text-sm text-green-700">{message}</div> : null}

            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Alterar senha</h2>
              <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Senha atual"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Nova senha"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
                />
                <button className="rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">Atualizar senha</button>
              </form>
              {passwordMessage ? <p className="mt-4 text-sm text-slate-700">{passwordMessage}</p> : null}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/90 p-6 shadow-[0_30px_80px_rgba(145,92,255,0.12)]">
              <div className="flex items-center gap-4">
                <img src={avatarUrl || '/profile-placeholder.png'} alt="Avatar" className="h-20 w-20 rounded-3xl object-cover" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Olá</p>
                  <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">Gerencie informações de conta, pedidos e acesso direto ao histórico.</p>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(145,92,255,0.12)]">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-700">Últimos pedidos</p>
              {loading ? (
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-20 rounded-3xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="mt-6 text-sm text-slate-600">Você ainda não fez pedidos.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">Pedido #{order.id.slice(0, 8)}</p>
                      <p className="mt-2 text-sm text-slate-600">Total: R$ {order.total.toFixed(2)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-pink-600">{order.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
