import { Router } from 'express'

import { prisma } from '../lib/prisma'

const router = Router()

router.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const cart = await prisma.cart.findUnique({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      return res.json({ items: [] })
    }

    return res.json({ items: cart.items })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar carrinho' })
  }
})

router.post('/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    if (!userId || !productId || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Dados do carrinho inválidos' })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: {
              productId,
              quantity
            }
          }
        }
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return res.json({ items: updatedCart?.items ?? [] })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao adicionar ao carrinho' })
  }
})

router.patch('/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    if (!userId || !productId || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Dados do carrinho inválidos' })
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    })

    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' })
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: existingItem.id
        }
      })
    } else {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity
        }
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return res.json({ items: updatedCart?.items ?? [] })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar carrinho' })
  }
})

router.delete('/cart', async (req, res) => {
  try {
    const { userId, productId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Dados do carrinho inválidos' })
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    })

    if (!cart) {
      return res.json({ items: [] })
    }

    if (productId) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId
        }
      })
    } else {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id
        }
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return res.json({ items: updatedCart?.items ?? [] })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao remover item do carrinho' })
  }
})

router.get('/coupons/:code', async (req, res) => {
  try {
    const { code } = req.params

    const coupon = await prisma.coupon.findUnique({
      where: {
        code
      }
    })

    if (!coupon || !coupon.active) {
      return res.status(404).json({ error: 'Cupom inválido ou expirado' })
    }

    return res.json(coupon)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao validar cupom' })
  }
})

export default router
