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
  const [bannerForm, setBannerForm] = useState({ label: '', title: '', imageUrl: '', color: '#7C3D8E', cta: 'Ver mais', position: 0, active: true })
  const [editingBanner, setEditingBanner] = useState<any | null>(null)

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

  async function handleSaveBanner() {
    const payload = {
      ...bannerForm,
      imageUrl: bannerForm.imageUrl.trim() || null,
      position: Number(bannerForm.position),
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
      setBannerForm({ label: '', title: '', imageUrl: '', color: '#7C3D8E', cta: 'Ver mais', position: 0, active: true })
    } catch {
      toast.error('Erro ao salvar banner')
    }
  }

  function handleEditBanner(banner: any) {
    setEditingBanner(banner)
    setBannerForm({
      label:    banner.label,
      title:    banner.title,
      imageUrl: banner.imageUrl ?? '',
      color:    banner.color,
      cta:      banner.cta,
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

      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-3xl font-bold">
          Acesso negado
        </h1>

      </div>

    )
  }

  return (

    <div className="min-h-screen bg-[#09040f] p-4 sm:p-6 md:p-10 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Painel Administrativo
            </p>

            <h1 className="mt-4 text-3xl font-black sm:text-5xl">
              Bem-vindo, {user.name}
            </h1>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4">

            <p className="text-sm text-zinc-400">
              Status
            </p>

            <p className="mt-1 font-semibold text-green-400">
              Online
            </p>

          </div>

        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 md:mt-14 md:gap-6">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-xs text-zinc-400 md:text-base">
              Produtos
            </p>

            <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-4xl">
              {stats.products}
            </h2>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-xs text-zinc-400 md:text-base">
              Pedidos
            </p>

            <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-4xl">
              {stats.orders}
            </h2>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-xs text-zinc-400 md:text-base">
              Clientes
            </p>

            <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-4xl">
              {stats.users}
            </h2>

          </div>

        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-6 md:gap-6">

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-sm text-green-300">
              Faturamento
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">

              R$ {Number(stats.revenue).toFixed(2)}

            </h2>

          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-sm text-blue-300">
              Pedidos Pagos
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">

              {stats.paidOrders}

            </h2>

          </div>

          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 md:rounded-[2rem] md:p-8">

            <p className="text-sm text-pink-300">
              Ticket Médio
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">

              R$ {Number(stats.averageTicket).toFixed(2)}

            </h2>

          </div>

        </div>

        <div className="mt-12">

          <CreateProductForm />

        </div>

        {editingProduct && (

          <div className="mt-12 rounded-[2rem] border border-pink-500 bg-white/5 p-8">

            <h2 className="text-3xl font-black text-white">
              Editar Produto
            </h2>

            <div className="mt-8 space-y-4">

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
                placeholder="Nome"
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
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
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
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
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
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
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
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
                className="w-full rounded-2xl bg-black/40 p-4 text-white outline-none"
              />

              <div className="flex gap-4">

                <button
                  onClick={handleSaveEdit}
                  className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white"
                >
                  Salvar
                </button>

                <button
                  onClick={() =>
                    setEditingProduct(null)
                  }
                  className="rounded-full bg-zinc-700 px-6 py-3 font-semibold text-white"
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        )}

        <div className="mt-16">

          <h2 className="text-3xl font-black text-white">
            Produtos
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {products.map((product) => (

              <div
                key={product.id}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-60 w-full rounded-2xl object-cover"
                />

                <h3 className="mt-5 text-2xl font-bold text-white">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <p className="text-xl font-black text-pink-400">
                    R$ {product.price.toFixed(2)}
                  </p>

                  <p className="text-sm text-zinc-400">
                    Estoque: {product.stock}
                  </p>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      handleEditProduct(product)
                    }
                    className="w-full rounded-full bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(
                        product.id
                      )
                    }
                    className="w-full rounded-full bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400"
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="mt-20">

          <h2 className="text-3xl font-black text-white">
            Pedidos Recentes
          </h2>

          <div className="mt-8 space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
              >

                <div className="flex flex-col gap-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="text-sm text-zinc-400">
                        Cliente
                      </p>

                      <h3 className="text-xl font-bold text-white">
                        {order.user.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {order.user.email}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-zinc-400">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-pink-400">

                        {order.status === 'PENDING' && 'Pendente'}

                        {order.status === 'PAID' && 'Pago'}

                        {order.status === 'SENT' && 'Enviado'}

                        {order.status === 'DELIVERED' && 'Entregue'}

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-zinc-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        R$ {order.total.toFixed(2)}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          'PENDING'
                        )
                      }
                      className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
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
                      className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white"
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
                      className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
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
                      className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Entregue
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Exportar CSV */}
        <div className="mt-16 flex items-center justify-between">
          <h2 className="text-3xl font-black text-white">Relatórios</h2>
          <button
            onClick={handleExportCSV}
            className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-400"
          >
            Exportar pedidos CSV
          </button>
        </div>

        {/* Categorias */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-white">Categorias</h2>
          <div className="mt-6 flex gap-3">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nome da categoria"
              className="flex-1 rounded-full bg-white/10 px-5 py-3 text-white outline-none placeholder:text-zinc-500"
            />
            <button
              onClick={handleCreateCategory}
              className="rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-400"
            >
              Criar
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-sm text-white">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-400 transition hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma categoria cadastrada.</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-white">Tags</h2>
          <div className="mt-6 flex gap-3">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nome da tag"
              className="flex-1 rounded-full bg-white/10 px-5 py-3 text-white outline-none placeholder:text-zinc-500"
            />
            <button
              onClick={handleCreateTag}
              className="rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400"
            >
              Criar
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-sm text-white">{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-400 transition hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma tag cadastrada.</p>
            )}
          </div>
        </div>

        {/* Banners do carrossel */}
        <div className="mt-16 pb-16">
          <h2 className="text-3xl font-black text-white">Banners do Carrossel</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Gerencie os slides do hero banner. Adicione uma URL de imagem para exibir foto de divulgação em datas comemorativas.
          </p>

          {/* Formulário */}
          <div className="mt-6 rounded-2xl border border-violet-500/30 bg-white/5 p-6">
            <h3 className="mb-4 font-bold text-violet-300">
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={bannerForm.label}
                onChange={(e) => setBannerForm({ ...bannerForm, label: e.target.value })}
                placeholder="Etiqueta (ex: Nova coleção)"
                className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <input
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="Título do slide"
                className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <input
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                placeholder="URL da imagem (deixe vazio para usar gradiente)"
                className="col-span-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <input
                value={bannerForm.cta}
                onChange={(e) => setBannerForm({ ...bannerForm, cta: e.target.value })}
                placeholder="Texto do botão (ex: Ver coleção)"
                className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-400">Cor de destaque</label>
                <input
                  type="color"
                  value={bannerForm.color}
                  onChange={(e) => setBannerForm({ ...bannerForm, color: e.target.value })}
                  className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <span className="text-xs text-zinc-500">{bannerForm.color}</span>
              </div>
              <input
                type="number"
                value={bannerForm.position}
                onChange={(e) => setBannerForm({ ...bannerForm, position: Number(e.target.value) })}
                placeholder="Posição (0 = primeiro)"
                className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={bannerForm.active}
                  onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                Banner ativo (visível na loja)
              </label>
            </div>

            {/* Preview da imagem */}
            {bannerForm.imageUrl && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-zinc-500">Pré-visualização:</p>
                <img
                  src={bannerForm.imageUrl}
                  alt="preview"
                  className="h-32 w-full rounded-xl object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSaveBanner}
                className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                {editingBanner ? 'Salvar alterações' : 'Criar banner'}
              </button>
              {editingBanner && (
                <button
                  onClick={() => {
                    setEditingBanner(null)
                    setBannerForm({ label: '', title: '', imageUrl: '', color: '#7C3D8E', cta: 'Ver mais', position: 0, active: true })
                  }}
                  className="rounded-full bg-zinc-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de banners */}
          <div className="mt-6 space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.label} className="h-16 w-24 flex-none rounded-xl object-cover" />
                ) : (
                  <div
                    className="h-16 w-24 flex-none rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${banner.color}33, ${banner.color}66)`, border: `1px solid ${banner.color}44` }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: banner.color }}>{banner.label}</p>
                  <p className="truncate text-sm font-bold text-white">{banner.title}</p>
                  <p className="text-xs text-zinc-500">
                    Pos. {banner.position} · {banner.active ? <span className="text-green-400">Ativo</span> : <span className="text-red-400">Inativo</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhum banner cadastrado. Os slides padrão serão exibidos na loja.</p>
            )}
          </div>
        </div>

      </div>

    </div>

  )
}