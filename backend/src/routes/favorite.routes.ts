import { Router } from 'express'

import { prisma } from '../lib/prisma'
import { adminMiddleware } from '../middlewares/admin'

const router = Router()

router.post('/favorites', async (req, res) => {
  try {
    const authUser = (req as any).user
    const { productId, isPublic = false } = req.body

    const alreadyExists = await prisma.favorite.findFirst({
      where: { userId: authUser.id, productId }
    })

    if (alreadyExists) {
      return res.status(400).json({ error: 'Produto já favoritado' })
    }

    const favorite = await prisma.favorite.create({
      data: { userId: authUser.id, productId, isPublic: Boolean(isPublic) },
      include: { product: true }
    })

    return res.json(favorite)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao favoritar' })
  }
})

router.get('/favorites', async (req, res) => {
  try {
    const authUser = (req as any).user

    const favorites = await prisma.favorite.findMany({
      where: { userId: authUser.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })

    return res.json(favorites)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar favoritos' })
  }
})

router.patch('/favorites/:id/visibility', async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params
    const { isPublic } = req.body

    const favorite = await prisma.favorite.findUnique({ where: { id } })
    if (!favorite) return res.status(404).json({ error: 'Favorito não encontrado' })
    if (favorite.userId !== authUser.id) return res.status(403).json({ error: 'Acesso negado' })

    const updated = await prisma.favorite.update({
      where: { id },
      data: { isPublic: Boolean(isPublic) }
    })

    return res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar visibilidade' })
  }
})

router.delete('/favorites/:productId', async (req, res) => {
  try {
    const authUser = (req as any).user
    const { productId } = req.params

    await prisma.favorite.deleteMany({
      where: { userId: authUser.id, productId }
    })

    return res.json({ message: 'Favorito removido' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover favorito' })
  }
})

router.get('/favorites/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const favorites = await prisma.favorite.findMany({
      where: { userId, isPublic: true },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })

    return res.json(favorites)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar favoritos públicos' })
  }
})

router.get('/favorites/analytics', adminMiddleware, async (req, res) => {
  try {
    const topProducts = await prisma.favorite.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 10
    })

    const productIds = topProducts.map((f) => f.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    const result = topProducts.map((f) => ({
      product: products.find((p) => p.id === f.productId),
      count: f._count.productId
    }))

    return res.json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar analytics' })
  }
})

export default router
