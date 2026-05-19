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

router.get(
  '/admin/orders',
  async (req, res) => {

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

  }
)

router.patch(
  '/admin/orders/:id',
  async (req, res) => {

    try {

      const { id } = req.params

      const { status } = req.body

      const order =
        await prisma.order.update({

          where: {
            id
          },

          data: {
            status
          }

        })

      return res.json(order)

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro ao atualizar pedido'
      })
    }

  }
)

router.get(
  '/admin/products',
  async (req, res) => {

    try {

      const products =
        await prisma.product.findMany({

          orderBy: {
            createdAt: 'desc'
          }

        })

      return res.json(products)

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro ao buscar produtos'
      })
    }

  }
)

router.delete(
  '/admin/products/:id',
  async (req, res) => {

    try {

      const { id } = req.params

      await prisma.product.delete({

        where: {
          id
        }

      })

      return res.json({
        message: 'Produto excluído'
      })

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro ao excluir produto'
      })
    }

  }
)

router.put(
  '/admin/products/:id',
  async (req, res) => {

    try {

      const { id } = req.params

      const {
        name,
        description,
        price,
        stock,
        image
      } = req.body

      const product =
        await prisma.product.update({

          where: {
            id
          },

          data: {

            name,

            description,

            price: Number(price),

            stock: Number(stock),

            image

          }

        })

      return res.json(product)

    } catch (error) {

      console.log(error)

      return res.status(500).json({

        error:
          'Erro ao editar produto'

      })
    }

  }
)

export default router