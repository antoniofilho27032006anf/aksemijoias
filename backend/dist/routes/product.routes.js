"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const upload_1 = require("../middlewares/upload");
const admin_1 = require("../middlewares/admin");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const router = (0, express_1.Router)();
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}
async function uniqueSlug(base, excludeId) {
    let slug = base;
    let i = 1;
    while (true) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
            select: { id: true }
        });
        if (!existing)
            return slug;
        slug = `${base}-${i++}`;
    }
}
async function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: 'aksemijoias' }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result.secure_url);
        })
            .end(buffer);
    });
}
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().positive()),
    stock: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().int().nonnegative()),
    categoryId: zod_1.z.string().optional(),
    tags: zod_1.z.preprocess((v) => {
        if (!v || v === '')
            return undefined;
        if (typeof v === 'string') {
            try {
                return JSON.parse(v);
            }
            catch {
                return undefined;
            }
        }
        return v;
    }, zod_1.z.array(zod_1.z.string()).optional())
});
router.post('/products', auth_1.authMiddleware, admin_1.adminMiddleware, upload_1.upload.single('image'), (0, validate_1.validateBody)(productSchema), async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, tags } = req.body;
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: 'Imagem obrigatória' });
        const image = await uploadToCloudinary(file.buffer);
        const slug = await uniqueSlug(generateSlug(name));
        const product = await prisma_1.prisma.product.create({
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
                        create: tags.map((tagId) => ({ tagId }))
                    }
                    : undefined
            },
            include: { category: true, tags: { include: { tag: true } }, variations: true }
        });
        return res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao criar produto' });
    }
});
router.get('/products', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, tags, page = '1', limit = '20' } = req.query;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;
        const where = { status: true };
        if (q) {
            where.OR = [
                { name: { contains: String(q), mode: 'insensitive' } },
                { description: { contains: String(q), mode: 'insensitive' } }
            ];
        }
        if (category) {
            where.category = { slug: String(category) };
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = Number(minPrice);
            if (maxPrice)
                where.price.lte = Number(maxPrice);
        }
        if (tags) {
            const tagList = String(tags).split(',');
            where.tags = { some: { tag: { name: { in: tagList } } } };
        }
        const [products, total] = await Promise.all([
            prisma_1.prisma.product.findMany({
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
            prisma_1.prisma.product.count({ where })
        ]);
        return res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        const product = await prisma_1.prisma.product.findFirst({
            where: { OR: [{ id }, { slug: id }], status: true },
            include: {
                category: true,
                tags: { include: { tag: true } },
                variations: true
            }
        });
        if (!product)
            return res.status(404).json({ error: 'Produto não encontrado' });
        return res.json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});
router.put('/products/:id', auth_1.authMiddleware, admin_1.adminMiddleware, upload_1.upload.single('image'), (0, validate_1.validateBody)(productSchema), async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, description, price, stock, categoryId, tags } = req.body;
        const file = req.file;
        let image;
        if (file) {
            image = await uploadToCloudinary(file.buffer);
        }
        const slug = await uniqueSlug(generateSlug(name), id);
        await prisma_1.prisma.productTag.deleteMany({ where: { productId: id } });
        const product = await prisma_1.prisma.product.update({
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
                    ? { create: tags.map((tagId) => ({ tagId })) }
                    : undefined
            },
            include: { category: true, tags: { include: { tag: true } }, variations: true }
        });
        return res.json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});
router.delete('/products/:id', auth_1.authMiddleware, admin_1.adminMiddleware, async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.prisma.product.update({ where: { id }, data: { status: false } });
        return res.json({ message: 'Produto ocultado' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao remover produto' });
    }
});
exports.default = router;
