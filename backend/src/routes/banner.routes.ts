import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middlewares/auth'
import { adminMiddleware } from '../middlewares/admin'
import { validateBody } from '../middlewares/validate'

const router = Router()

const bannerSchema = z.object({
  label:    z.string().min(1),
  title:    z.string().optional().default(''),
  imageUrl: z.string().url().optional().nullable(),
  color:    z.string().optional().default('#7C3D8E'),
  cta:      z.string().optional().default(''),
  active:   z.boolean().optional().default(true),
  position: z.number().int().optional().default(0),
})

router.get('/banners', async (_req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
    })
    return res.json(banners)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar banners' })
  }
})

router.get('/admin/banners', authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { position: 'asc' } })
    return res.json(banners)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar banners' })
  }
})

router.post('/banners', authMiddleware, adminMiddleware, validateBody(bannerSchema), async (req, res) => {
  try {
    const banner = await prisma.banner.create({ data: req.body })
    return res.status(201).json(banner)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar banner' })
  }
})

router.put('/banners/:id', authMiddleware, adminMiddleware, validateBody(bannerSchema), async (req, res) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: String(req.params.id) },
      data: req.body,
    })
    return res.json(banner)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar banner' })
  }
})

router.delete('/banners/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: String(req.params.id) } })
    return res.json({ message: 'Banner removido' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover banner' })
  }
})

export default router
