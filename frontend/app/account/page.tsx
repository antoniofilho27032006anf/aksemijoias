'use client'

import Link from 'next/link'
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
  product: { name: string; image: string }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendente',  color: '#92400e', bg: '#fef3c7' },
  PAID:      { label: 'Pago',      color: '#065f46', bg: '#d1fae5' },
  SENT:      { label: 'Enviado',   color: '#1e40af', bg: '#dbeafe' },
  DELIVERED: { label: 'Entregue',  color: '#5B2170', bg: '#f3e8ff' },
  CANCELLED: { label: 'Cancelado', color: '#991b1b', bg: '#fee2e2' },
}

const AVATAR_OPTIONS = [
  '👑', '💎', '🌸', '🦋', '✨', '💜', '🌺', '🦄',
  '💫', '🌙', '🔮', '💐', '🌹', '💝', '👸', '🎀',
  '🌟', '🍀', '🦚', '🌈', '🐚', '🌻', '🫧', '🪷',
]

function isEmoji(str: string) {
  return str.length <= 4 && !str.startsWith('http')
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
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'orders'>('profile')

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    setName(user.name)
    setEmail(user.email)
    setAvatarUrl(user.avatarUrl || '')
    api.get('/orders')
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router, user])

  async function handleSaveProfile(e: { preventDefault(): void }) {
    e.preventDefault()
    setMessage('')
    try {
      const updated = await updateProfile({ name, email, avatarUrl })
      setName(updated.name)
      setEmail(updated.email)
      setAvatarUrl(updated.avatarUrl || '')
      setMessage('Perfil atualizado com sucesso.')
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Erro ao atualizar perfil')
    }
  }

  async function handleChangePassword(e: { preventDefault(): void }) {
    e.preventDefault()
    setPasswordMessage('')
    try {
      await changePassword(currentPassword, newPassword)
      setPasswordMessage('Senha alterada com sucesso.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      setPasswordMessage(err?.response?.data?.error || 'Erro ao alterar senha')
    }
  }

  const TABS = [
    { key: 'profile', label: 'Perfil' },
    { key: 'password', label: 'Senha' },
    { key: 'orders', label: `Pedidos${orders.length > 0 ? ` (${orders.length})` : ''}` },
  ] as const

  const savedEmoji = user?.avatarUrl && isEmoji(user.avatarUrl) ? user.avatarUrl : null
  const previewEmoji = avatarUrl && isEmoji(avatarUrl) ? avatarUrl : null

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <Navbar />

      <main className="mx-auto max-w-xl px-3 pb-20 pt-5 sm:px-5">

        {/* Profile card */}
        <div
          className="mb-4 flex items-center gap-3 rounded-xl border p-3"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-raised)' }}
        >
          <div
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-lg font-black"
            style={savedEmoji
              ? { background: 'var(--c-glass)', fontSize: '1.6rem', lineHeight: 1 }
              : { background: 'linear-gradient(135deg, #7C3D8E, #C4509B)', color: '#fff' }
            }
          >
            {savedEmoji ?? (user?.name?.charAt(0)?.toUpperCase() ?? '?')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold" style={{ color: 'var(--c-text)' }}>{user?.name}</p>
            <p className="truncate text-[11px]" style={{ color: 'var(--c-vdim)' }}>{user?.email}</p>
          </div>
          <span
            className="ml-auto flex-none rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
            style={{ backgroundColor: '#f3e8ff', color: '#7C3D8E' }}
          >
            Conta
          </span>
        </div>

        {/* Tab bar */}
        <div
          className="mb-4 flex rounded-xl border p-1"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-raised)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 rounded-lg py-2 text-[11px] font-bold uppercase tracking-wide transition"
              style={
                activeTab === tab.key
                  ? { background: 'linear-gradient(135deg, #7C3D8E, #C4509B)', color: '#fff' }
                  : { color: '#7C3D8E', backgroundColor: 'transparent' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Perfil */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
            <Field label="Nome">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="input-base"
              />
            </Field>
            <Field label="E-mail">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-base"
              />
            </Field>

            {/* Avatar gallery */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
                Avatar
              </label>

              {/* Preview */}
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border-2"
                  style={{
                    borderColor: '#7C3D8E',
                    background: previewEmoji ? 'var(--c-raised)' : 'linear-gradient(135deg, #7C3D8E, #C4509B)',
                    fontSize: previewEmoji ? '1.5rem' : undefined,
                    color: previewEmoji ? undefined : '#fff',
                    fontWeight: 900,
                  }}
                >
                  {previewEmoji ?? (name?.charAt(0)?.toUpperCase() ?? '?')}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--c-text)' }}>
                    {previewEmoji ? 'Avatar selecionado' : 'Nenhum avatar selecionado'}
                  </p>
                  {previewEmoji && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[10px] underline"
                      style={{ color: 'var(--c-vdim)' }}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div
                className="grid grid-cols-8 gap-1.5 rounded-xl border p-3"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
              >
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatarUrl(avatarUrl === emoji ? '' : emoji)}
                    className="flex aspect-square items-center justify-center rounded-lg text-xl transition"
                    style={{
                      outline: avatarUrl === emoji ? '2px solid #7C3D8E' : '2px solid transparent',
                      background: avatarUrl === emoji ? '#f3e8ff' : 'var(--c-glass)',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <p
                className="rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={
                  message.includes('sucesso')
                    ? { backgroundColor: '#d1fae5', color: '#065f46' }
                    : { backgroundColor: '#fee2e2', color: '#991b1b' }
                }
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
            >
              Salvar perfil
            </button>
          </form>
        )}

        {/* Tab: Senha */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
            <Field label="Senha atual">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </Field>
            <Field label="Nova senha">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </Field>

            {passwordMessage && (
              <p
                className="rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={
                  passwordMessage.includes('sucesso')
                    ? { backgroundColor: '#d1fae5', color: '#065f46' }
                    : { backgroundColor: '#fee2e2', color: '#991b1b' }
                }
              >
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
            >
              Atualizar senha
            </button>
          </form>
        )}

        {/* Tab: Pedidos */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl border" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-raised)' }} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border py-12 text-center" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-raised)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--c-muted)' }}>Nenhum pedido ainda</p>
                <Link
                  href="/"
                  className="rounded-xl px-5 py-2 text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}
                >
                  Ver produtos
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.map((order) => {
                  const status = STATUS_MAP[order.status] ?? { label: order.status, color: '#555', bg: '#f3f4f6' }
                  return (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-3 rounded-xl border px-3 py-2.5 transition hover:border-[#C4509B]"
                      style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--c-vdim)' }}>
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ color: status.color, backgroundColor: status.bg }}
                      >
                        {status.label}
                      </span>
                      <p className="flex-none text-sm font-black" style={{ color: '#C4509B' }}>
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4B0D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </main>

      <CartSidebar />

      <style>{`
        .input-base {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--c-border);
          background-color: var(--c-raised);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: var(--c-text);
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base:focus {
          border-color: #7C3D8E;
          background-color: var(--c-card);
        }
        .input-base::placeholder {
          color: var(--c-vdim);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
