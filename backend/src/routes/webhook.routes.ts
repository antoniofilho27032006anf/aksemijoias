import { Router } from 'express'

import { prisma } from '../lib/prisma'
import { paymentClient } from '../services/mercadoPago'
import { sendOrderStatusEmail } from '../services/email'

const router = Router()

router.post('/webhooks/mercadopago', async (req, res) => {
  try {
    const paymentId = req.body?.data?.id

    if (!paymentId) return res.sendStatus(200)

    const payment = await paymentClient.get({ id: paymentId })

    if (payment.status === 'approved') {
      const order = await prisma.order.findFirst({
        where: { paymentId: paymentId.toString() },
        include: { user: true }
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID' }
        })

        await prisma.orderEvent.create({
          data: {
            orderId: order.id,
            status: 'PAID',
            description: 'Pagamento PIX confirmado via Mercado Pago'
          }
        })

        sendOrderStatusEmail(order.user.email, {
          orderId: order.id,
          status: 'PAID',
          description: 'Seu pagamento PIX foi confirmado!'
        }).catch(console.error)
      }
    }

    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

export default router
