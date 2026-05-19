'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'

import { api } from '../services/api'
import { useAuth } from './AuthContext'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextData {
  cart: CartItem[]
  addToCart: (product: Product) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  deleteFromCart: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext({} as CartContextData)

export function CartProvider({
  children
}: {
  children: ReactNode
}) {
  const { user } = useAuth() as any
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    async function loadCart() {
      if (user) {
        try {
          const storedCart = localStorage.getItem('@aksemijoias-cart')
          if (storedCart) {
            const localItems: CartItem[] = JSON.parse(storedCart)
            for (const item of localItems) {
              await api.post('/cart', {
                userId: user.id,
                productId: item.id,
                quantity: item.quantity
              })
            }
            localStorage.removeItem('@aksemijoias-cart')
          }

          const response = await api.get(`/cart/${user.id}`)
          const items = response.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity
          }))

          setCart(items)
        } catch (error) {
          console.log(error)
        }
      } else {
        const storedCart = localStorage.getItem('@aksemijoias-cart')
        if (storedCart) {
          setCart(JSON.parse(storedCart))
        }
      }
    }

    loadCart()
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem('@aksemijoias-cart', JSON.stringify(cart))
    }
  }, [cart, user])

  async function addToCart(product: Product) {
    if (user) {
      try {
        const response = await api.post('/cart', {
          userId: user.id,
          productId: product.id,
          quantity: 1
        })

        const items = response.data.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }))

        setCart(items)
      } catch (error) {
        console.log(error)
      }
      return
    }

    const productExists = cart.find((item) => item.id === product.id)

    if (productExists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
      return
    }

    setCart([...cart, { ...product, quantity: 1 }])
  }

  async function updateQuantity(id: string, quantity: number) {
    if (user) {
      try {
        const response = await api.patch('/cart', {
          userId: user.id,
          productId: id,
          quantity
        })

        const items = response.data.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }))

        setCart(items)
      } catch (error) {
        console.log(error)
      }
      return
    }

    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  async function removeFromCart(id: string) {
    if (user) {
      const item = cart.find((row) => row.id === id)
      if (!item) {
        return
      }
      await updateQuantity(id, item.quantity - 1)
      return
    }

    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  async function deleteFromCart(id: string) {
    if (user) {
      try {
        const response = await api.delete('/cart', {
          data: {
            userId: user.id,
            productId: id
          }
        })

        const items = response.data.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }))

        setCart(items)
      } catch (error) {
        console.log(error)
      }
      return
    }

    setCart(cart.filter((item) => item.id !== id))
  }

  async function clearCart() {
    if (user) {
      try {
        const response = await api.delete('/cart', {
          data: {
            userId: user.id
          }
        })

        const items = response.data.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }))

        setCart(items)
      } catch (error) {
        console.log(error)
      }
      return
    }

    setCart([])
  }

  function openCart() {
    setIsCartOpen(true)
  }

  function closeCart() {
    setIsCartOpen(false)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        deleteFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
