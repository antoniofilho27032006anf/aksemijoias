import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'
import adminRoutes from './routes/admin.routes'

import { prisma } from './lib/prisma'
import { paymentClient } from './services/mercadoPago'

import uploadRoutes from './routes/upload.routes'
import favoriteRoutes from './routes/favorite.routes'
import cartRoutes from './routes/cart.routes'
import categoryRoutes from './routes/category.routes'
import tagRoutes from './routes/tag.routes'
import variationRoutes from './routes/variation.routes'

import { authMiddleware } from './middlewares/auth'
import { adminMiddleware } from './middlewares/admin'
import { requestLogger } from './middlewares/logger'
import { sanitizeMiddleware } from './middlewares/sanitize'

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

app.use(helmet())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Muitas requisições. Tente novamente mais tarde.'
    }
  })
)

app.use(requestLogger)
app.use(sanitizeMiddleware)
app.use(express.json({ limit: '10mb' }))

app.use('/orders', authMiddleware, orderRoutes)
app.use('/cart', authMiddleware, cartRoutes)
app.use('/favorites', authMiddleware, favoriteRoutes)
app.use('/admin', authMiddleware, adminMiddleware, adminRoutes)
app.use('/users', userRoutes)
app.use(productRoutes)
app.use(uploadRoutes)
app.use(categoryRoutes)
app.use(tagRoutes)
app.use(variationRoutes)

app.get('/', (_req, res) => {
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