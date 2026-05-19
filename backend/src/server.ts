import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'

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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})