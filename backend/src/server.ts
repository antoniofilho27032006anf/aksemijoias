import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import Stripe from 'stripe'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'
import adminRoutes from './routes/admin.routes'
import uploadRoutes from './routes/upload.routes'
import favoriteRoutes from './routes/favorite.routes'
import cartRoutes from './routes/cart.routes'
import categoryRoutes from './routes/category.routes'
import tagRoutes from './routes/tag.routes'
import variationRoutes from './routes/variation.routes'
import webhookRoutes from './routes/webhook.routes'

import { prisma } from './lib/prisma'
import { sendOrderStatusEmail } from './services/email'
import { authMiddleware } from './middlewares/auth'
import { adminMiddleware } from './middlewares/admin'
import { requestLogger } from './middlewares/logger'
import { sanitizeMiddleware } from './middlewares/sanitize'

const app = express()
const PORT = process.env.PORT || 3333

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' as any })
  : null

app.use(cors({ origin: '*' }))
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
  })
)
app.use(requestLogger)

// Stripe webhook precisa do raw body, antes do express.json()
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.sendStatus(400)

  const sig = req.headers['stripe-signature'] as string
  let event: any

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
            include: { user: true }
          })
          await prisma.orderEvent.create({
            data: { orderId, status: 'PAID', description: 'Pagamento confirmado via Stripe' }
          })
          sendOrderStatusEmail(order.user.email, {
            orderId,
            status: 'PAID',
            description: 'Seu pagamento foi confirmado!'
          }).catch(console.error)
        }
        break
      }
    }
  } catch (error) {
    console.log(error)
  }

  return res.sendStatus(200)
})

app.use(sanitizeMiddleware)
app.use(express.json({ limit: '10mb' }))

app.use('/orders', authMiddleware)
app.use('/cart', authMiddleware)
app.use('/favorites', authMiddleware)
app.use('/admin', authMiddleware, adminMiddleware)
app.use('/upload', authMiddleware)

app.use(orderRoutes)
app.use(cartRoutes)
app.use(favoriteRoutes)
app.use(adminRoutes)
app.use(userRoutes)
app.use(productRoutes)
app.use(uploadRoutes)
app.use(categoryRoutes)
app.use(tagRoutes)
app.use(variationRoutes)
app.use(webhookRoutes)

app.get('/', (_req, res) => {
  return res.json({ message: 'API AKsemijoias funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
