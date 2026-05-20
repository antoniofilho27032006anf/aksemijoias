import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { upload } from '../middlewares/upload'
import { adminMiddleware } from '../middlewares/admin'
import { authMiddleware } from '../middlewares/auth'
import { validateBody } from '../middlewares/validate'

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'aksemijoias' }, (error: any, result: any) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      })
      .end(buffer)
  })
}

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.preprocess((v) => Number(v), z.number().positive()),
  stock: z.preprocess((v) => Number(v), z.number().int().nonnegative()),
  categoryId: z.string().optional(),
  tags: z.preprocess((v) => {
    if (!v || v === '') return undefined
    if (typeof v === 'string') { try { return JSON.parse(v) } catch { return undefined } }
    return v
  }, z.array(z.string()).optional())
})

router.post('/products', authMiddleware, adminMiddleware, upload.single('image'), validateBody(productSchema), async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, tags } = req.body
    const file = req.file as Express.Multer.File

    if (!file) return res.status(400).json({ error: 'Imagem obrigatória' })

    const image = await uploadToCloudinary(file.buffer)
    const slug = generateSlug(name)

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        status: true,
        categoryId: categoryId ? String(categoryId) : undefined,
        tags: tags?.length
          ? {
              create: tags.map((tagId: string) => ({ tagId }))
            }
          : undefined
      },
      include: { category: true, tags: { include: { tag: true } }, variations: true }
    })

    return res.status(201).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar produto' })
  }
})

router.get('/products', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, tags, page = '1', limit = '20' } = req.query

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))
    const skip = (pageNum - 1) * limitNum

    const where: any = { status: true }

    if (q) {
      where.OR = [
        { name: { contains: String(q), mode: 'insensitive' } },
        { description: { contains: String(q), mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = { slug: String(category) }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }

    if (tags) {
      const tagList = String(tags).split(',')
      where.tags = { some: { tag: { name: { in: tagList } } } }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
          variations: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ])

    return res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const id = String(req.params.id)
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }], status: true },
      include: {
        category: true,
        tags: { include: { tag: true } },
        variations: true
      }
    })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    return res.json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar produto' })
  }
})

router.put('/products/:id', authMiddleware, adminMiddleware, upload.single('image'), validateBody(productSchema), async (req, res) => {
  try {
    const id = String(req.params.id)
    const { name, description, price, stock, categoryId, tags } = req.body
    const file = req.file as Express.Multer.File

    let image: string | undefined
    if (file) {
      image = await uploadToCloudinary(file.buffer)
    }

    const slug = generateSlug(name)

    await prisma.productTag.deleteMany({ where: { productId: id } })

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        status: true,
        categoryId: categoryId ? String(categoryId) : undefined,
        ...(image && { image }),
        tags: tags?.length
          ? { create: tags.map((tagId: string) => ({ tagId })) }
          : undefined
      },
      include: { category: true, tags: { include: { tag: true } }, variations: true }
    })

    return res.json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
})

router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = String(req.params.id)
    await prisma.product.update({ where: { id }, data: { status: false } })
    return res.json({ message: 'Produto ocultado' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover produto' })
  }
})

export default router
