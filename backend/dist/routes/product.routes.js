"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const upload_1 = require("../middlewares/upload");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dkv1fo87n',
    api_key: '954673969238786',
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const router = (0, express_1.Router)();
router.post('/products', upload_1.upload.single('image'), async (req, res) => {
    const { name, description, price, stock } = req.body;
    const file = req.file;
    const uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({
            folder: 'aksemijoias'
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        })
            .end(file.buffer);
    });
    const image = uploadedImage.secure_url;
    const product = await prisma_1.prisma.product.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            image,
            status: true
        }
    });
    return res.json(product);
});
router.get('/products', async (req, res) => {
    const products = await prisma_1.prisma.product.findMany();
    return res.json(products);
});
router.put('/products/:id', upload_1.upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    let image;
    const file = req.file;
    if (file) {
        const uploadedImage = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({
                folder: 'aksemijoias'
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            })
                .end(file.buffer);
        });
        image =
            uploadedImage.secure_url;
    }
    const product = await prisma_1.prisma.product.update({
        where: {
            id: Array.isArray(id) ? id[0] : id
        },
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            image,
            status: true
        }
    });
    return res.json(product);
});
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.prisma.product.delete({
        where: {
            id
        }
    });
    return res.json({
        message: 'Produto deletado'
    });
});
exports.default = router;
