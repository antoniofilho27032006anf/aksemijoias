import { Router } from 'express'

import { prisma } from '../lib/prisma'
import { mercadopago } from '../services/mercadoPago'

const router = Router()

router.post('/orders', async (req, res) => {

  try {

    const {
      userId,
      items
    } = req.body

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId
        }
      })

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      })
    }

    let total = 0

    const formattedItems =
      await Promise.all(

        items.map(async (item: any) => {

          const product =
            await prisma.product.findUnique({
              where: {
                id: item.productId
              }
            })

          if (!product) {
            throw new Error(
              'Produto não encontrado'
            )
          }

          const subtotal =
            product.price * item.quantity

          total += subtotal

          return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price
          }

        })

      )

    const paymentData =
      await mercadopago.payment.create({

        transaction_amount: total,

        description:
          'Pedido AKsemijoias',

        payment_method_id: 'pix',

        payer: {
          email: user.email
        }

      })

    const paymentId =
      paymentData.body.id.toString()

    const order =
      await prisma.order.create({

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

      })

    return res.json({

      order,

      pix: {

        qr_code:
          paymentData.body
            .point_of_interaction
            ?.transaction_data
            ?.qr_code,

        qr_code_base64:
          paymentData.body
            .point_of_interaction
            ?.transaction_data
            ?.qr_code_base64

      }

    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar pedido'
    })
  }

})

router.get('/orders', async (req, res) => {

  const orders =
    await prisma.order.findMany({

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

    })

  return res.json(orders)

})

export default router