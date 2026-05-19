import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { validateBody } from '../middlewares/validate'

const router = Router()

const orderStatusSchema = z.object({
  status: z.string().min(3)
})

function getMonthLabel(date: Date) {
  return date.toLocaleString('pt-BR', {
    month: 'short',
    year: '2-digit'
  })
}

function buildMonthlySeries(orders: Array<{ createdAt: Date; total: number }>) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return {
      label: getMonthLabel(date),
      year: date.getFullYear(),
      month: date.getMonth(),
      orderCount: 0,
      revenue: 0
    }
  })

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt)
    const monthItem = months.find(
      (month) =>
        month.year === orderDate.getFullYear() &&
        month.month === orderDate.getMonth()
    )

    if (monthItem) {
      monthItem.orderCount += 1
      monthItem.revenue += order.total
    }
  })

  return months
}

router.get('/admin/dashboard', async (req, res) => {
  try {
    const products = await prisma.product.count({
      where: { status: true }
    })

    const orders = await prisma.order.count()
    const users = await prisma.user.count()

    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' }
    })

    const revenue = paidOrders.reduce((acc, order) => acc + order.total, 0)
    const averageTicket = paidOrders.length ? revenue / paidOrders.length : 0

    const activeUsersRaw = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
        }
      },
      select: {
        userId: true
      }
    })

    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    })

    const monthlyStats = buildMonthlySeries(
      monthlyOrders.map((order) => ({
        createdAt: order.createdAt,
        total: order.total
      }))
    )

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    const productIds = topProducts.map((item) => item.productId)
    const productsData = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    const bestSellers = topProducts.map((item) => ({
      quantity: item._sum.quantity ?? 0,
      product: productsData.find((product) => product.id === item.productId)
    }))

    return res.json({
      products,
      orders,
      users,
      revenue,
      paidOrders: paidOrders.length,
      averageTicket,
      activeUsers: new Set(activeUsersRaw.map((item) => item.userId)).size,
      monthlyStats,
      bestSellers
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro no dashboard' })
  }
})

router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
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
    return res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
})

router.patch('/admin/orders/:id', validateBody(orderStatusSchema), async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })

    await prisma.orderEvent.create({
      data: {
        orderId: id,
        status,
        description: 'Status atualizado pelo administrador'
      }
    })

    return res.json(order)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar pedido' })
  }
})

router.get('/admin/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' }
    })

    return res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
})

router.delete('/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.product.update({
      where: { id },
      data: { status: false }
    })

    return res.json({ message: 'Produto excluído' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao excluir produto' })
  }
})

router.put('/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, stock, image } = req.body

    const product = await prisma.product.update({
      where: { id },
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
    return res.status(500).json({ error: 'Erro ao editar produto' })
  }
})

router.get('/admin/reports/export', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })

    const header = 'Pedido Id,Cliente,Status,Total,Cupom,Data\n'
    const rows = orders
      .map((order) =>
        [
          order.id,
          order.user.email,
          order.status,
          order.total.toFixed(2),
          order.couponCode ?? '',
          order.createdAt.toISOString()
        ]
          .map((cell) => `"${cell}"`)
          .join(',')
      )
      .join('\n')

    res.header('Content-Type', 'text/csv')
    res.attachment('relatorio-pedidos.csv')
    return res.send(header + rows)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao gerar relatório' })
  }
})

export default router
