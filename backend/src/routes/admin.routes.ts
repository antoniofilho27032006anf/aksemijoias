import { Router } from 'express'

import { prisma } from '../lib/prisma'

const router = Router()

router.get(
  '/admin/dashboard',
  async (req, res) => {

    try {

      const products =
        await prisma.product.count()

      const orders =
        await prisma.order.count()

      const users =
        await prisma.user.count()

      return res.json({

        products,
        orders,
        users

      })

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro no dashboard'
      })
    }

  }
)

export default router