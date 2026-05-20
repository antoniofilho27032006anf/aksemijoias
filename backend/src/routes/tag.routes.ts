import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { adminMiddleware } from '../middlewares/admin'
import { validateBody } from '../middlewares/validate'

const router = Router()

const tagSchema = z.object({
  name: z.string().min(2)
})

router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    })
    return res.json(tags)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar tags' })
  }
})

router.post('/tags', adminMiddleware, validateBody(tagSchema), async (req, res) => {
  try {
    const { name } = req.body

    const exists = await prisma.tag.findUnique({ where: { name } })
    if (exists) return res.status(400).json({ error: 'Tag já existe' })

    const tag = await prisma.tag.create({ data: { name } })
    return res.status(201).json(tag)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar tag' })
  }
})

router.delete('/tags/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.tag.delete({ where: { id } })
    return res.json({ message: 'Tag removida' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover tag' })
  }
})

export default router
