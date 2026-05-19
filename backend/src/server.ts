import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'

import { prisma } from './lib/prisma'
import { mercadopago } from './services/mercadoPago'

const app = express()

const PORT = process.env.PORT || 3333

console.log({
  userRoutes,
  productRoutes,
  orderRoutes
})

app.use(
  cors({
    origin: '*'
  })
)

app.use(express.json())

app.use(orderRoutes)
app.use(userRoutes)
app.use(productRoutes)

app.get('/', (req, res) => {
  return res.json({
    message: 'API AKsemijoias funcionando'
  })
})

app.post(
  '/webhook/mercadopago',
  async (req, res) => {

    try {

      const paymentId =
        req.body?.data?.id

      if (!paymentId) {
        return res.sendStatus(200)
      }

      const payment =
        await mercadopago.payment.findById(
          paymentId
        )

      const status =
        payment.body.status

      if (status === 'approved') {

        await prisma.order.updateMany({

          where: {
            paymentId: paymentId.toString()
          },

          data: {
            status: 'PAID'
          }

        })

      }

      return res.sendStatus(200)

    } catch (error) {

      console.log(error)

      return res.sendStatus(500)
    }

  }
)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})