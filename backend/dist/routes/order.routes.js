"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const mercadoPago_1 = require("../services/mercadoPago");
const router = (0, express_1.Router)();
router.post('/orders', async (req, res) => {
    try {
        const { userId, items } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
        let total = 0;
        const formattedItems = await Promise.all(items.map(async (item) => {
            const product = await prisma_1.prisma.product.findUnique({
                where: {
                    id: item.productId
                }
            });
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            const subtotal = product.price * item.quantity;
            total += subtotal;
            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            };
        }));
        const paymentData = await mercadoPago_1.paymentClient.create({
            body: {
                transaction_amount: total,
                description: 'Pedido AKsemijoias',
                payment_method_id: 'pix',
                payer: {
                    email: user.email
                }
            }
        });
        const paymentId = paymentData.id?.toString();
        const order = await prisma_1.prisma.order.create({
            data: {
                userId,
                total,
                paymentId,
                status: 'PENDING',
                items: {
                    create: formattedItems
                }
            },
            include: {
                items: true
            }
        });
        return res.json({
            order,
            pix: {
                qr_code: paymentData
                    .point_of_interaction
                    ?.transaction_data
                    ?.qr_code,
                qr_code_base64: paymentData
                    .point_of_interaction
                    ?.transaction_data
                    ?.qr_code_base64
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Erro ao criar pedido'
        });
    }
});
router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.json(orders);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Erro ao buscar pedidos'
        });
    }
});
exports.default = router;
