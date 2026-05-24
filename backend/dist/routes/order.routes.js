"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const mercadoPago_1 = require("../services/mercadoPago");
const validate_1 = require("../middlewares/validate");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        quantity: zod_1.z.number().int().positive()
    }))
        .min(1),
    couponCode: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum(['pix', 'mercadopago', 'stripe']).optional(),
    returnUrl: zod_1.z.string().url().optional()
});
const cancelOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().max(200).optional()
});
const stripe = process.env.STRIPE_SECRET_KEY
    ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-04-22.dahlia'
    })
    : null;
async function createOrderEvent(orderId, status, description) {
    await prisma_1.prisma.orderEvent.create({
        data: {
            orderId,
            status,
            description
        }
    });
}
router.post('/orders', (0, validate_1.validateBody)(createOrderSchema), async (req, res) => {
    try {
        const authUser = req.user;
        const { items, couponCode, paymentMethod = 'pix', returnUrl } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: authUser.id }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        let total = 0;
        const formattedItems = await Promise.all(items.map(async (item) => {
            const product = await prisma_1.prisma.product.findUnique({
                where: { id: item.productId }
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
        let discount = 0;
        if (couponCode) {
            const coupon = await prisma_1.prisma.coupon.findUnique({
                where: { code: couponCode }
            });
            if (!coupon || !coupon.active) {
                return res.status(400).json({ error: 'Cupom inválido ou expirado' });
            }
            if (coupon.type === 'PERCENT') {
                discount = total * (coupon.value / 100);
            }
            else {
                discount = coupon.value;
            }
            if (discount > total) {
                discount = total;
            }
        }
        const finalTotal = Math.max(0, total - discount);
        const order = await prisma_1.prisma.order.create({
            data: {
                userId: authUser.id,
                total: finalTotal,
                discount,
                couponCode,
                status: 'PENDING',
                items: {
                    create: formattedItems
                }
            },
            include: {
                items: true
            }
        });
        await createOrderEvent(order.id, 'PENDING', 'Pedido criado e aguardando pagamento');
        (0, email_1.sendOrderCreatedEmail)(user.email, { orderId: order.id, total: finalTotal }).catch(console.error);
        if (paymentMethod === 'stripe') {
            if (!stripe) {
                return res.status(500).json({ error: 'Stripe não configurado' });
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: formattedItems.map((item) => ({
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: item.productId
                        },
                        unit_amount: Math.round(item.price * 100)
                    },
                    quantity: item.quantity
                })),
                mode: 'payment',
                success_url: returnUrl || `${process.env.APP_URL || 'http://localhost:3000'}/checkout/success`,
                cancel_url: returnUrl ? `${returnUrl}/failure` : `${process.env.APP_URL || 'http://localhost:3000'}/checkout/failure`,
                metadata: {
                    orderId: order.id
                }
            });
            return res.json({ order, stripeUrl: session.url });
        }
        const paymentData = await mercadoPago_1.paymentClient.create({
            body: {
                transaction_amount: finalTotal,
                description: 'Pedido AKsemijoias',
                payment_method_id: 'pix',
                payer: {
                    email: user.email
                }
            }
        });
        const paymentId = paymentData.id?.toString();
        await prisma_1.prisma.order.update({
            where: { id: order.id },
            data: { paymentId }
        });
        await createOrderEvent(order.id, 'PENDING', `Pagamento iniciado via ${paymentMethod}`);
        return res.json({
            order,
            pix: {
                qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});
router.get('/orders', async (req, res) => {
    try {
        const authUser = req.user;
        const orders = await prisma_1.prisma.order.findMany({
            where: authUser.role === 'ADMIN' ? {} : { userId: authUser.id },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                },
                orderEvents: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.json(orders);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
});
router.get('/orders/:id', async (req, res) => {
    try {
        const authUser = req.user;
        const id = String(req.params.id);
        const order = await prisma_1.prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                },
                orderEvents: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        if (authUser.role !== 'ADMIN' && order.userId !== authUser.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        return res.json(order);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
});
router.patch('/orders/:id/cancel', (0, validate_1.validateBody)(cancelOrderSchema), async (req, res) => {
    try {
        const authUser = req.user;
        const id = String(req.params.id);
        const { reason } = req.body;
        const existingOrder = await prisma_1.prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!existingOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        if (authUser.role !== 'ADMIN' && existingOrder.userId !== authUser.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        const order = await prisma_1.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
        await createOrderEvent(order.id, 'CANCELLED', reason || 'Pedido cancelado pelo usuário');
        (0, email_1.sendOrderStatusEmail)(existingOrder.user.email, {
            orderId: order.id,
            status: 'CANCELLED',
            description: reason || 'Seu pedido foi cancelado.'
        }).catch(console.error);
        return res.json(order);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
});
exports.default = router;
