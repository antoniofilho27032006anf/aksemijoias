import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { adminMiddleware } from '../middlewares/admin'
import { validateBody } from '../middlewares/validate'

const router = Router()

const variationSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  stock: z.preprocess((v) => Number(v), z.number().int().nonnegative()),
  price: z.preprocess((v) => (v === undefined || v === '' ? undefined : Number(v)), z.number().positive().optional())
})

router.get('/products/:id/variations', async (req, res) => {
  try {
    const id = String(req.params.id)
    const variations = await prisma.productVariation.findMany({
      where: { productId: id },
      orderBy: { name: 'asc' }
    })
    return res.json(variations)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar variações' })
  }
})

router.post('/products/:id/variations', adminMiddleware, validateBody(variationSchema), async (req, res) => {
  try {
    const id = String(req.params.id)
    const { name, value, stock, price } = req.body

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })

    const variation = await prisma.productVariation.create({
      data: { productId: id, name, value, stock: Number(stock), price: price ? Number(price) : undefined }
    })
    return res.status(201).json(variation)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar variação' })
  }
})

router.put('/products/:productId/variations/:id', adminMiddleware, validateBody(variationSchema), async (req, res) => {
  try {
    const id = String(req.params.id)
    const { name, value, stock, price } = req.body

    const variation = await prisma.productVariation.update({
      where: { id },
      data: { name, value, stock: Number(stock), price: price ? Number(price) : undefined }
    })
    return res.json(variation)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar variação' })
  }
})

router.delete('/products/:productId/variations/:id', adminMiddleware, async (req, res) => {
  try {
    const id = String(req.params.id)
    await prisma.productVariation.delete({ where: { id } })
    return res.json({ message: 'Variação removida' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover variação' })
  }
})

export default router
