"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const mercadoPago_1 = require("../services/mercadoPago");
const router = (0, express_1.Router)();
router.post('/orders', async (req, res) => {
    const { userId, items } = req.body;
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
    const paymentData = await mercadoPago_1.mercadopago.payment.create({
        transaction_amount: total,
        description: 'Pedido AKsemijoias',
        payment_method_id: 'pix',
        payer: {
            email: 'cliente@email.com'
        }
    });
    const order = await prisma_1.prisma.order.create({
        data: {
            userId,
            total,
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
            qr_code: paymentData.body
                .point_of_interaction
                ?.transaction_data
                ?.qr_code,
            qr_code_base64: paymentData.body
                .point_of_interaction
                ?.transaction_data
                ?.qr_code_base64
        }
    });
});
router.get('/orders', async (req, res) => {
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
});
exports.default = router;
