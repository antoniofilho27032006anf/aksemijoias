'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/contexts/AuthContext'
import { CreateProductForm } from '@/src/components/CreateProductForm'
import { api } from '@/src/services/api'

import { toast } from 'sonner'

export default function AdminPage() {

  const { user } = useAuth() as any

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [stats, setStats] =
    useState({

      products: 0,
      orders: 0,
      users: 0,

      revenue: 0,

      paidOrders: 0,

      averageTicket: 0

    })

  const [orders, setOrders] =
    useState<any[]>([])

  const [products, setProducts] =
    useState<any[]>([])

  const [editingProduct, setEditingProduct] =
    useState<any | null>(null)

  const [editForm, setEditForm] =
    useState({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: ''
    })

  const [categories, setCategories] = useState<any[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [tags, setTags] = useState<any[]>([])
  const [newTag, setNewTag] = useState('')

  const [banners, setBanners] = useState<any[]>([])
  const [bannerForm, setBannerForm] = useState({ label: '', imageUrl: '', position: 0, active: true })
  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [bannerImagePreview, setBannerImagePreview] = useState('')
  const [bannerUploading, setBannerUploading] = useState(false)

  useEffect(() => {

    const token =
      localStorage.getItem('@ak-token')

    if (!token) {

      router.push('/login')

    } else {

      setLoading(false)

      api
        .get('/admin/dashboard')
        .then((response) => {

          setStats(response.data)

        })
        .catch((error) => {

          console.log(error)

        })

      api
        .get('/admin/orders')
        .then((response) => {

          setOrders(response.data)

        })
        .catch((error) => {

          console.log(error)

        })

      api
        .get('/admin/products')
        .then((response) => {
          setProducts(response.data)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get('/categories').then((r) => setCategories(r.data)).catch(() => {})
      api.get('/tags').then((r) => setTags(r.data)).catch(() => {})
      api.get('/admin/banners').then((r) => setBanners(r.data)).catch(() => {})
    }

  }, [router])

  async function handleUpdateStatus(
    orderId: string,
    status: string
  ) {

    try {

      await api.patch(

        `/admin/orders/${orderId}`,

        {
          status
        }

      )

      setOrders((prevOrders) =>

        prevOrders.map((order) => {

          if (order.id === orderId) {

            return {
              ...order,
              status
            }
          }

          return order

        })

      )

    } catch (error) {

      console.log(error)

      toast.error('Erro ao atualizar status')

    }

  }

  async function handleDeleteProduct(
    productId: string
  ) {

    const confirmDelete =
      confirm(
        'Deseja realmente excluir este produto?'
      )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(
        `/admin/products/${productId}`
      )

      setProducts((prevProducts) =>

        prevProducts.filter(
          (product) =>
            product.id !== productId
        )

      )

      setStats((prev) => ({
        ...prev,
        products:
          prev.products - 1
      }))

      toast.success('Produto excluído')

    } catch (error) {

      console.log(error)

      toast.error('Erro ao excluir produto')

    }

  }

  function handleEditProduct(
    product: any
  ) {

    setEditingProduct(product)

    setEditForm({

      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image

    })

  }

  async function handleSaveEdit() {

    try {

      const response =
        await api.put(

          `/admin/products/${editingProduct.id}`,

          {

            name: editForm.name,

            description:
              editForm.description,

            price:
              Number(editForm.price),

            stock:
              Number(editForm.stock),

            image:
              editForm.image

          }

        )

      setProducts((prevProducts) =>

        prevProducts.map((product) => {

          if (
            product.id ===
            editingProduct.id
          ) {

            return response.data
          }

          return product

        })

      )

      setEditingProduct(null)

      toast.success('Produto atualizado')

    } catch (error) {

      console.log(error)

      toast.error('Erro ao editar produto')

    }

  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) return
    try {
      const response = await api.post('/categories', { name: newCategory.trim() })
      setCategories((prev) => [...prev, response.data])
      setNewCategory('')
      toast.success('Categoria criada')
    } catch {
      toast.error('Erro ao criar categoria')
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Excluir categoria?')) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Categoria removida')
    } catch {
      toast.error('Erro ao remover categoria')
    }
  }

  async function handleCreateTag() {
    if (!newTag.trim()) return
    try {
      const response = await api.post('/tags', { name: newTag.trim() })
      setTags((prev) => [...prev, response.data])
      setNewTag('')
      toast.success('Tag criada')
    } catch {
      toast.error('Erro ao criar tag')
    }
  }

  async function handleDeleteTag(id: string) {
    if (!confirm('Excluir tag?')) return
    try {
      await api.delete(`/tags/${id}`)
      setTags((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tag removida')
    } catch {
      toast.error('Erro ao remover tag')
    }
  }

  async function handleBannerImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerImagePreview(URL.createObjectURL(file))
    setBannerUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const r = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setBannerForm((prev) => ({ ...prev, imageUrl: r.data.url }))
      toast.success('Imagem enviada')
    } catch {
      toast.error('Erro ao enviar imagem')
    } finally {
      setBannerUploading(false)
    }
  }

  async function handleSaveBanner() {
    const payload = {
      label:    bannerForm.label || 'Banner',
      imageUrl: bannerForm.imageUrl.trim() || null,
      position: Number(bannerForm.position),
      active:   bannerForm.active,
    }
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
    setBannerForm({
      label:    banner.label,
      imageUrl: banner.imageUrl ?? '',
      position: banner.position,
      active:   banner.active,
    })
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
      const response = await api.get('/admin/reports/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'relatorio-pedidos.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Erro ao exportar relatório')
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  if (user.role !== 'ADMIN') {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">

        <h1 className="text-3xl font-bold">
          Acesso negado
        </h1>

      </div>

    )
  }

  return (

    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-pink-500">
              Painel Administrativo
            </p>

            <h1 className="mt-3 text-2xl font-black text-gray-900 sm:text-4xl">
              Bem-vindo, {user.name}
            </h1>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">

            <p className="text-xs text-gray-500">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold text-green-600">
              Online
            </p>

          </div>

        </div>

        {/* ── Stat cards row 1 ── */}
        <div className="mt-6 grid grid-cols-3 gap-2 md:mt-8 md:gap-4">

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-gray-500">Produtos</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              {stats.products}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-gray-500">Pedidos</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              {stats.orders}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-gray-500">Clientes</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              {stats.users}
            </h2>
          </div>

        </div>

        {/* ── Stat cards row 2 ── */}
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mt-3 md:gap-4">

          <div className="rounded-xl border border-green-200 bg-green-50 p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-green-700">Faturamento</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              R$ {Number(stats.revenue).toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-blue-700">Pedidos Pagos</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              {stats.paidOrders}
            </h2>
          </div>

          <div className="rounded-xl border border-pink-200 bg-pink-50 p-3 shadow-sm md:rounded-2xl md:p-5">
            <p className="text-xs text-pink-700">Ticket Médio</p>
            <h2 className="mt-1 text-xl font-black text-gray-900 md:mt-2 md:text-3xl">
              R$ {Number(stats.averageTicket).toFixed(2)}
            </h2>
          </div>

        </div>

        {/* ── Criar produto ── */}
        <div className="mt-10">
          <CreateProductForm />
        </div>

        {/* ── Editar produto ── */}
        {editingProduct && (

          <div className="mt-10 rounded-2xl border border-pink-300 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-black text-gray-900">
              Editar Produto
            </h2>

            <div className="mt-6 space-y-3">

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
                placeholder="Nome"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description:
                      e.target.value
                  })
                }
                placeholder="Descrição"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              />

              <input
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: e.target.value
                  })
                }
                placeholder="Preço"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              />

              <input
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    stock: e.target.value
                  })
                }
                placeholder="Estoque"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              />

              <input
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    image: e.target.value
                  })
                }
                placeholder="Imagem URL"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              />

              <div className="flex gap-3">

                <button
                  onClick={handleSaveEdit}
                  className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Salvar
                </button>

                <button
                  onClick={() =>
                    setEditingProduct(null)
                  }
                  className="rounded-full bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700"
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        )}

        {/* ── Produtos ── */}
        <div className="mt-12">

          <h2 className="text-2xl font-black text-gray-900">
            Produtos
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {products.map((product) => (

              <div
                key={product.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full rounded-xl object-cover"
                />

                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">

                  <p className="text-base font-black text-pink-500">
                    R$ {product.price.toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-400">
                    Estoque: {product.stock}
                  </p>

                </div>

                <div className="mt-3 flex gap-2">

                  <button
                    onClick={() =>
                      handleEditProduct(product)
                    }
                    className="w-full rounded-full bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(
                        product.id
                      )
                    }
                    className="w-full rounded-full bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ── Pedidos Recentes ── */}
        <div className="mt-14">

          <h2 className="text-2xl font-black text-gray-900">
            Pedidos Recentes
          </h2>

          <div className="mt-5 space-y-3">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >

                <div className="flex flex-col gap-4">

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="text-xs text-gray-500">
                        Cliente
                      </p>

                      <h3 className="text-base font-bold text-gray-900">
                        {order.user.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {order.user.email}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-pink-500">

                        {order.status === 'PENDING' && 'Pendente'}

                        {order.status === 'PAID' && 'Pago'}

                        {order.status === 'SENT' && 'Enviado'}

                        {order.status === 'DELIVERED' && 'Entregue'}

                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Total
                      </p>

                      <p className="mt-0.5 text-base font-bold text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'PENDING'
                        )
                      }
                      className="rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Pendente
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'PAID'
                        )
                      }
                      className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Pago
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'SENT'
                        )
                      }
                      className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Enviado
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'DELIVERED'
                        )
                      }
                      className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Entregue
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ── Exportar CSV ── */}
        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Relatórios</h2>
          <button
            onClick={handleExportCSV}
            className="rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-400"
          >
            Exportar pedidos CSV
          </button>
        </div>

        {/* ── Categorias ── */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-gray-900">Categorias</h2>
          <div className="mt-4 flex gap-3">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nome da categoria"
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button
              onClick={handleCreateCategory}
              className="rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400"
            >
              Criar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5">
                <span className="text-sm text-gray-700">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-400 transition hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma categoria cadastrada.</p>
            )}
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-gray-900">Tags</h2>
          <div className="mt-4 flex gap-3">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nome da tag"
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button
              onClick={handleCreateTag}
              className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              Criar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5">
                <span className="text-sm text-gray-700">{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-400 transition hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma tag cadastrada.</p>
            )}
          </div>
        </div>

        {/* ── Banners do carrossel ── */}
        <div className="mt-12 pb-16">
          <h2 className="text-2xl font-black text-gray-900">Banners do Carrossel</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os slides do hero banner. Adicione uma URL de imagem para exibir foto de divulgação em datas comemorativas.
          </p>

          {/* Formulário */}
          <div className="mt-5 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-bold text-violet-600">
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Identificador (uso interno)</label>
                <input
                  value={bannerForm.label}
                  onChange={(e) => setBannerForm({ ...bannerForm, label: e.target.value })}
                  placeholder="Ex: Dia dos Namorados, Promoção Maio..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-gray-500">Imagem do banner</label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 py-5 transition hover:bg-violet-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="text-sm font-bold text-[#7C3D8E]">
                    {bannerUploading ? 'Enviando...' : 'Selecionar imagem da galeria'}
                  </span>
                  <span className="text-xs text-gray-400">JPG, PNG ou WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerImageSelect}
                  />
                </label>

                {/* Preview */}
                {(bannerImagePreview || bannerForm.imageUrl) && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs text-gray-400">Pré-visualização:</p>
                    <img
                      src={bannerImagePreview || bannerForm.imageUrl}
                      alt="preview"
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Posição</label>
                  <input
                    type="number"
                    value={bannerForm.position}
                    onChange={(e) => setBannerForm({ ...bannerForm, position: Number(e.target.value) })}
                    className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  Ativo (visível na loja)
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSaveBanner}
                className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                {editingBanner ? 'Salvar alterações' : 'Adicionar banner'}
              </button>
              {editingBanner && (
                <button
                  onClick={() => {
                    setEditingBanner(null)
                    setBannerForm({ label: '', imageUrl: '', position: 0, active: true })
                    setBannerImagePreview('')
                  }}
                  className="rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de banners */}
          <div className="mt-4 space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.label} className="h-14 w-20 flex-none rounded-xl object-cover" />
                ) : (
                  <div
                    className="h-14 w-20 flex-none rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${banner.color}33, ${banner.color}66)`, border: `1px solid ${banner.color}44` }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: banner.color }}>{banner.label}</p>
                  <p className="truncate text-sm font-bold text-gray-900">{banner.title}</p>
                  <p className="text-xs text-gray-400">
                    Pos. {banner.position} · {banner.active ? <span className="text-green-600">Ativo</span> : <span className="text-red-500">Inativo</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-400"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <p className="text-sm text-gray-400">Nenhum banner cadastrado. Os slides padrão serão exibidos na loja.</p>
            )}
          </div>
        </div>

      </div>

    </div>

  )
}
