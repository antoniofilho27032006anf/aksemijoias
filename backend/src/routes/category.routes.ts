import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { adminMiddleware } from '../middlewares/admin'
import { validateBody } from '../middlewares/validate'

const router = Router()

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const categorySchema = z.object({
  name: z.string().min(2)
})

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    })
    return res.json(categories)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
})

router.get('/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: { where: { status: true } }
      }
    })
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' })
    return res.json(category)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar categoria' })
  }
})

router.post('/categories', adminMiddleware, validateBody(categorySchema), async (req, res) => {
  try {
    const { name } = req.body
    const slug = generateSlug(name)

    const exists = await prisma.category.findUnique({ where: { slug } })
    if (exists) return res.status(400).json({ error: 'Categoria já existe' })

    const category = await prisma.category.create({ data: { name, slug } })
    return res.status(201).json(category)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar categoria' })
  }
})

router.put('/categories/:id', adminMiddleware, validateBody(categorySchema), async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const slug = generateSlug(name)

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug }
    })
    return res.json(category)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar categoria' })
  }
})

router.delete('/categories/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.category.delete({ where: { id } })
    return res.json({ message: 'Categoria removida' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover categoria' })
  }
})

export default router
