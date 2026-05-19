import { Router } from 'express'
import Stripe from 'stripe'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { paymentClient } from '../services/mercadoPago'
import { validateBody } from '../middlewares/validate'

const router = Router()

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['pix', 'mercadopago', 'stripe']).optional(),
  returnUrl: z.string().url().optional()
})

const cancelOrderSchema = z.object({
  reason: z.string().max(200).optional()
})

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15'
    })
  : null

async function createOrderEvent(orderId: string, status: string, description?: string) {
  await prisma.orderEvent.create({
    data: {
      orderId,
      status,
      description
    }
  })
}

router.post('/orders', validateBody(createOrderSchema), async (req, res) => {
  try {
    const authUser = (req as any).user
    const {
      items,
      couponCode,
      paymentMethod = 'pix',
      returnUrl
    } = req.body

    const user = await prisma.user.findUnique({
      where: { id: authUser.id }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    let total = 0

    const formattedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error('Produto não encontrado')
        }

        const subtotal = product.price * item.quantity
        total += subtotal

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        }
      })
    )

    let discount = 0

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      })

      if (!coupon || !coupon.active) {
        return res.status(400).json({ error: 'Cupom inválido ou expirado' })
      }

      if (coupon.type === 'PERCENT') {
        discount = total * (coupon.value / 100)
      } else {
        discount = coupon.value
      }

      if (discount > total) {
        discount = total
      }
    }

    const finalTotal = Math.max(0, total - discount)

    const order = await prisma.order.create({
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
    })

    await createOrderEvent(order.id, 'PENDING', 'Pedido criado e aguardando pagamento')

    if (paymentMethod === 'stripe') {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe não configurado' })
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
      })

      return res.json({ order, stripeUrl: session.url })
    }

    const paymentData = await paymentClient.create({
      body: {
        transaction_amount: finalTotal,
        description: 'Pedido AKsemijoias',
        payment_method_id: paymentMethod === 'mercadopago' ? 'pix' : 'pix',
        payer: {
          email: user.email
        }
      }
    })

    const paymentId = paymentData.id?.toString()

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId }
    })

    await createOrderEvent(order.id, 'PENDING', `Pagamento iniciado via ${paymentMethod}`)

    return res.json({
      order,
      pix: {
        qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao criar pedido' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const authUser = (req as any).user

    const orders = await prisma.order.findMany({
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
    })

    return res.json(orders)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
})

router.get('/orders/:id', async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params

    const order = await prisma.order.findUnique({
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
    })

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    if (authUser.role !== 'ADMIN' && order.userId !== authUser.id) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    return res.json(order)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar pedido' })
  }
})

router.patch('/orders/:id/cancel', validateBody(cancelOrderSchema), async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params
    const { reason } = req.body

    const existingOrder = await prisma.order.findUnique({ where: { id } })

    if (!existingOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    if (authUser.role !== 'ADMIN' && existingOrder.userId !== authUser.id) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    await createOrderEvent(order.id, 'CANCELLED', reason || 'Pedido cancelado pelo usuário')

    return res.json(order)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao cancelar pedido' })
  }
})

export default router