import { Router } from 'express'

import { prisma } from '../lib/prisma'
import { paymentClient } from '../services/mercadoPago'

const router = Router()

router.post('/orders', async (req, res) => {

  try {

    const {
      userId,
      items,
      couponCode
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

    let discount = 0

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode
        }
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

    const paymentData =
      await paymentClient.create({

        body: {

          transaction_amount: finalTotal,

          description:
            'Pedido AKsemijoias',

          payment_method_id: 'pix',

          payer: {
            email: user.email
          }

        }

      })

    const paymentId =
      paymentData.id?.toString()

    const order =
      await prisma.order.create({

        data: {

          userId,

          total: finalTotal,

          discount,

          couponCode,

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
          paymentData
            .point_of_interaction
            ?.transaction_data
            ?.qr_code,

        qr_code_base64:
          paymentData
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

  try {

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

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: 'Erro ao buscar pedidos'
    })
  }

})

export default router