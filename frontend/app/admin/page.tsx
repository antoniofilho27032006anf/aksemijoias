'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/contexts/AuthContext'
import { CreateProductForm } from '@/src/components/CreateProductForm'
import { api } from '@/src/services/api'
import { toast } from 'sonner'

type Panel = 'orders' | 'banners' | null

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente', PAID: 'Pago', SENT: 'Enviado',
  DELIVERED: 'Entregue', CANCELLED: 'Cancelado',
}
const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  PENDING:   { color: '#92400e', bg: '#fef3c7' },
  PAID:      { color: '#065f46', bg: '#d1fae5' },
  SENT:      { color: '#1e40af', bg: '#dbeafe' },
  DELIVERED: { color: '#5B2170', bg: '#f3e8ff' },
  CANCELLED: { color: '#991b1b', bg: '#fee2e2' },
}

export default function AdminPage() {
  const { user } = useAuth() as any
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, paidOrders: 0, averageTicket: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', details: '', price: '', stock: '', image: '' })

  const [banners, setBanners] = useState<any[]>([])
  const [bannerForm, setBannerForm] = useState({ label: '', imageUrl: '', position: 0, active: true })
  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [bannerImagePreview, setBannerImagePreview] = useState('')
  const [bannerUploading, setBannerUploading] = useState(false)

  const [activePanel, setActivePanel] = useState<Panel>(null)
  const [dotsOpen, setDotsOpen] = useState(false)
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('@ak-token')
    if (!token) { router.push('/login'); return }
    setLoading(false)
    api.get('/admin/dashboard').then((r) => setStats(r.data)).catch(() => {})
    api.get('/admin/orders').then((r) => setOrders(r.data)).catch(() => {})
    api.get('/admin/products').then((r) => setProducts(r.data)).catch(() => {})
    api.get('/admin/banners').then((r) => setBanners(r.data)).catch(() => {})
  }, [router])

  // close dots menu when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleUpdateStatus(orderId: string, status: string) {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status })
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Deseja realmente excluir este produto?')) return
    try {
      await api.delete(`/admin/products/${productId}`)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      setStats((prev) => ({ ...prev, products: prev.products - 1 }))
      toast.success('Produto excluído')
    } catch {
      toast.error('Erro ao excluir produto')
    }
  }

  function handleEditProduct(product: any) {
    setEditingProduct(product)
    setEditForm({ name: product.name, description: product.description, details: product.details ?? '', price: product.price, stock: product.stock, image: product.image })
  }

  async function handleSaveEdit() {
    try {
      const r = await api.put(`/admin/products/${editingProduct.id}`, {
        name: editForm.name, description: editForm.description,
        details: editForm.details || null,
        price: Number(editForm.price), stock: Number(editForm.stock), image: editForm.image,
      })
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? r.data : p))
      setEditingProduct(null)
      toast.success('Produto atualizado')
    } catch {
      toast.error('Erro ao editar produto')
    }
  }

  async function handleBannerImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerImagePreview(URL.createObjectURL(file))
    setBannerUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const r = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setBannerForm((prev) => ({ ...prev, imageUrl: r.data.url }))
      toast.success('Imagem enviada')
    } catch {
      toast.error('Erro ao enviar imagem')
    } finally {
      setBannerUploading(false)
    }
  }

  async function handleSaveBanner() {
    const payload = { label: bannerForm.label || 'Banner', imageUrl: bannerForm.imageUrl.trim() || null, position: Number(bannerForm.position), active: bannerForm.active }
    try {
      if (editingBanner) {
        const r = await api.put(`/banners/${editingBanner.id}`, payload)
        setBanners((prev) => prev.map((b) => b.id === editingBanner.id ? r.data : b))
        toast.success('Banner atualizado')
      } else {
        const r = await api.post('/banners', payload)
        setBanners((prev) => [...prev, r.data])
        toast.success('Banner criado')
      }
      setEditingBanner(null)
      setBannerForm({ label: '', imageUrl: '', position: 0, active: true })
      setBannerImagePreview('')
    } catch {
      toast.error('Erro ao salvar banner')
    }
  }

  function handleEditBanner(banner: any) {
    setEditingBanner(banner)
    setBannerImagePreview('')
    setBannerForm({ label: banner.label, imageUrl: banner.imageUrl ?? '', position: banner.position, active: banner.active })
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm('Excluir banner?')) return
    try {
      await api.delete(`/banners/${id}`)
      setBanners((prev) => prev.filter((b) => b.id !== id))
      toast.success('Banner removido')
    } catch {
      toast.error('Erro ao remover banner')
    }
  }

  async function handleExportCSV() {
    try {
      const r = await api.get('/admin/reports/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const a = document.createElement('a')
      a.href = url; a.download = 'relatorio-pedidos.csv'; a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Erro ao exportar relatório')
    }
  }

  if (loading || !user) return null

  if (user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--c-bg)' }}>
        <h1 className="text-2xl font-black" style={{ color: 'var(--c-text)' }}>Acesso negado</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#C4509B' }}>
              Painel Administrativo
            </p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl" style={{ color: 'var(--c-text)' }}>
              {user.name}
            </h1>
          </div>

          {/* 3 dots menu */}
          <div className="relative" ref={dotsRef}>
            <button
              onClick={() => setDotsOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
              style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}
              aria-label="Mais opções"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5"  r="1.5" fill="#7C3D8E"/>
                <circle cx="12" cy="12" r="1.5" fill="#7C3D8E"/>
                <circle cx="12" cy="19" r="1.5" fill="#7C3D8E"/>
              </svg>
            </button>

            {dotsOpen && (
              <div
                className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border shadow-xl"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}
              >
                <button
                  onClick={() => { setActivePanel('orders'); setDotsOpen(false) }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition hover:opacity-80"
                  style={{ color: 'var(--c-text)', borderBottom: `1px solid var(--c-border)` }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#dbeafe' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
                    </svg>
                  </span>
                  Pedidos & Relatório
                </button>
                <button
                  onClick={() => { setActivePanel('banners'); setDotsOpen(false) }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition hover:opacity-80"
                  style={{ color: 'var(--c-text)' }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#f3e8ff' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </span>
                  Banners do Carrossel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats: Faturamento ── */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
          <StatCard label="Faturamento" value={`R$ ${Number(stats.revenue).toFixed(2).replace('.', ',')}`} accent="#d1fae5" labelColor="#065f46" />
          <StatCard label="Pedidos Pagos" value={String(stats.paidOrders)} accent="#dbeafe" labelColor="#1e40af" />
          <StatCard label="Ticket Médio" value={`R$ ${Number(stats.averageTicket).toFixed(2).replace('.', ',')}`} accent="#fce7f3" labelColor="#9d174d" />
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          <StatCard label="Produtos" value={String(stats.products)} accent="var(--c-raised)" labelColor="var(--c-dim)" />
          <StatCard label="Pedidos" value={String(stats.orders)} accent="var(--c-raised)" labelColor="var(--c-dim)" />
          <StatCard label="Clientes" value={String(stats.users)} accent="var(--c-raised)" labelColor="var(--c-dim)" />
        </div>

        {/* ── Criar produto ── */}
        <CreateProductForm />

        {/* ── Editar produto ── */}
        {editingProduct && (
          <div className="mt-6 rounded-xl border p-4" style={{ borderColor: '#C4509B55', background: 'var(--c-card)' }}>
            <p className="mb-3 text-sm font-black" style={{ color: '#C4509B' }}>Editar Produto</p>
            <div className="flex flex-col gap-2">
              {[
                { key: 'name', placeholder: 'Nome' },
                { key: 'price', placeholder: 'Preço' },
                { key: 'stock', placeholder: 'Estoque' },
                { key: 'image', placeholder: 'Imagem URL' },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  value={(editForm as any)[key]}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-text)' }}
                />
              ))}
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Descrição"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-text)' }}
              />
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7C3D8E' }}>
                  Detalhes da peça <span className="font-normal normal-case opacity-60">(uma por linha)</span>
                </label>
                <textarea
                  value={editForm.details}
                  onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                  placeholder={"Acabamento em prata 925\nDesign leve e confortável\nInspiração moderna e feminina"}
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                  style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-text)' }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleSaveEdit} className="rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white hover:bg-green-400">Salvar</button>
                <button onClick={() => setEditingProduct(null)} className="rounded-lg px-4 py-2 text-xs font-bold transition" style={{ background: 'var(--c-raised)', color: 'var(--c-muted)' }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Lista de produtos ── */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-vdim)' }}>
            Produtos cadastrados ({products.length})
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border p-2.5" style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}>
                <img src={product.image} alt={product.name} className="h-24 w-full rounded-lg object-cover" />
                <p className="mt-2 truncate text-xs font-bold" style={{ color: 'var(--c-text)' }}>{product.name}</p>
                <p className="text-xs font-black" style={{ color: '#C4509B' }}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>Estoque: {product.stock}</p>
                <div className="mt-2 flex gap-1.5">
                  <button onClick={() => handleEditProduct(product)} className="flex-1 rounded-lg bg-blue-500 py-1 text-[10px] font-bold text-white hover:bg-blue-400">Editar</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 rounded-lg bg-red-500 py-1 text-[10px] font-bold text-white hover:bg-red-400">Excluir</button>
                </div>
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-center text-sm" style={{ color: 'var(--c-vdim)' }}>Nenhum produto cadastrado.</p>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          Panel: Pedidos & Relatório
      ════════════════════════════════════════ */}
      {activePanel === 'orders' && (
        <SlidePanel title="Pedidos & Relatório" onClose={() => setActivePanel(null)}>
          <div className="flex flex-col gap-4">

            {/* Export */}
            <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Relatório de Pedidos</p>
                <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>Exportar todos os pedidos em CSV</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-400"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                CSV
              </button>
            </div>

            {/* Orders list */}
            <div className="flex flex-col gap-2">
              {orders.length === 0 && (
                <p className="text-center text-sm" style={{ color: 'var(--c-vdim)' }}>Nenhum pedido encontrado.</p>
              )}
              {orders.map((order) => {
                const s = STATUS_COLOR[order.status] ?? { color: '#555', bg: '#f3f4f6' }
                return (
                  <div key={order.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs font-semibold" style={{ color: 'var(--c-text)' }}>{order.user?.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>{order.user?.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: s.color, background: s.bg }}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                        <p className="text-xs font-black" style={{ color: '#C4509B' }}>
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    {/* Status buttons */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {[
                        { key: 'PENDING', label: 'Pendente', color: 'bg-yellow-500' },
                        { key: 'PAID',    label: 'Pago',     color: 'bg-green-500' },
                        { key: 'SENT',    label: 'Enviado',  color: 'bg-blue-500' },
                        { key: 'DELIVERED', label: 'Entregue', color: 'bg-violet-500' },
                        { key: 'CANCELLED', label: 'Cancelar', color: 'bg-red-500' },
                      ].map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => handleUpdateStatus(order.id, btn.key)}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold text-white transition hover:opacity-80 ${btn.color} ${order.status === btn.key ? 'ring-2 ring-offset-1 ring-current' : ''}`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </SlidePanel>
      )}

      {/* ════════════════════════════════════════
          Panel: Banners do Carrossel
      ════════════════════════════════════════ */}
      {activePanel === 'banners' && (
        <SlidePanel title="Banners do Carrossel" onClose={() => setActivePanel(null)}>
          <div className="flex flex-col gap-4">

            {/* Form */}
            <div className="rounded-xl border p-3" style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}>
              <p className="mb-3 text-xs font-black uppercase tracking-wide" style={{ color: '#7C3D8E' }}>
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </p>
              <div className="flex flex-col gap-2">
                <input
                  value={bannerForm.label}
                  onChange={(e) => setBannerForm({ ...bannerForm, label: e.target.value })}
                  placeholder="Identificador (ex: Dia das Mães)"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-text)' }}
                />

                {/* Upload */}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-4 transition hover:opacity-80" style={{ borderColor: '#7C3D8E55', background: 'var(--c-raised)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="text-xs font-bold" style={{ color: '#7C3D8E' }}>
                    {bannerUploading ? 'Enviando...' : 'Selecionar imagem'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageSelect} />
                </label>

                {(bannerImagePreview || bannerForm.imageUrl) && (
                  <img src={bannerImagePreview || bannerForm.imageUrl} alt="preview" className="h-28 w-full rounded-lg object-cover" />
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>Posição</label>
                    <input
                      type="number"
                      value={bannerForm.position}
                      onChange={(e) => setBannerForm({ ...bannerForm, position: Number(e.target.value) })}
                      className="w-14 rounded-lg border px-2 py-1 text-sm outline-none"
                      style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)', color: 'var(--c-text)' }}
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
                    <input
                      type="checkbox"
                      checked={bannerForm.active}
                      onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                      className="h-3.5 w-3.5"
                    />
                    Ativo
                  </label>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveBanner} className="rounded-lg px-4 py-2 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7C3D8E, #C4509B)' }}>
                    {editingBanner ? 'Salvar' : 'Adicionar'}
                  </button>
                  {editingBanner && (
                    <button
                      onClick={() => { setEditingBanner(null); setBannerForm({ label: '', imageUrl: '', position: 0, active: true }); setBannerImagePreview('') }}
                      className="rounded-lg px-4 py-2 text-xs font-bold"
                      style={{ background: 'var(--c-raised)', color: 'var(--c-muted)' }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Banner list */}
            <div className="flex flex-col gap-2">
              {banners.length === 0 && (
                <p className="text-center text-sm" style={{ color: 'var(--c-vdim)' }}>Nenhum banner cadastrado.</p>
              )}
              {banners.map((banner) => (
                <div key={banner.id} className="flex items-center gap-3 rounded-xl border p-2.5" style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}>
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.label} className="h-12 w-16 flex-none rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-16 flex-none rounded-lg" style={{ background: 'var(--c-raised)' }} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold" style={{ color: 'var(--c-text)' }}>{banner.label}</p>
                    <p className="text-[10px]" style={{ color: 'var(--c-vdim)' }}>
                      Pos. {banner.position} · {banner.active
                        ? <span style={{ color: '#16a34a' }}>Ativo</span>
                        : <span style={{ color: '#dc2626' }}>Inativo</span>}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEditBanner(banner)} className="rounded-lg bg-blue-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-blue-400">Editar</button>
                    <button onClick={() => handleDeleteBanner(banner.id)} className="rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-400">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SlidePanel>
      )}
    </div>
  )
}

/* ── Subcomponents ── */

function StatCard({ label, value, accent, labelColor }: { label: string; value: string; accent: string; labelColor: string }) {
  return (
    <div className="rounded-xl border p-3 sm:p-4" style={{ borderColor: 'var(--c-border)', background: accent }}>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: labelColor }}>{label}</p>
      <p className="mt-1 text-base font-black sm:text-xl" style={{ color: 'var(--c-text)' }}>{value}</p>
    </div>
  )
}

function SlidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-hidden shadow-2xl sm:max-w-md"
        style={{ background: 'var(--c-bg)' }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--c-border)', background: 'var(--c-raised)' }}>
          <p className="text-sm font-black" style={{ color: 'var(--c-text)' }}>{title}</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-70"
            style={{ background: 'var(--c-glass)', color: 'var(--c-text)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  )
}
