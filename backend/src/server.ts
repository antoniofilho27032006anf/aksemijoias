import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'
import adminRoutes from './routes/admin.routes'

import { prisma } from './lib/prisma'
import { paymentClient } from './services/mercadoPago'

import uploadRoutes from './routes/upload.routes'
import favoriteRoutes from './routes/favorite.routes'
import cartRoutes from './routes/cart.routes'

const app = express()

const PORT = process.env.PORT || 3333

console.log({
  userRoutes,
  productRoutes,
  orderRoutes,
  adminRoutes
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
app.use(adminRoutes)
app.use(uploadRoutes)
app.use(favoriteRoutes)
app.use(cartRoutes)

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
        await paymentClient.get({

          id: paymentId

        })

      const status =
        payment.status

      if (status === 'approved') {

        await prisma.order.updateMany({

          where: {
            paymentId:
              paymentId.toString()
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

  console.log(
    `Servidor rodando na porta ${PORT}`
  )

})