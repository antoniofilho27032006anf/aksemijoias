'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'

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

  addToCart: (product: Product) => void

  removeFromCart: (
    id: string
  ) => void

  clearCart: () => void

  isCartOpen: boolean

  openCart: () => void

  closeCart: () => void
}

const CartContext =
  createContext({} as CartContextData)

export function CartProvider({
  children
}: {
  children: ReactNode
}) {

  const [cart, setCart] =
    useState<CartItem[]>([])

  const [isCartOpen, setIsCartOpen] =
    useState(false)

  useEffect(() => {

    const storedCart =
      localStorage.getItem(
        '@aksemijoias-cart'
      )

    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }

  }, [])

  useEffect(() => {

    localStorage.setItem(
      '@aksemijoias-cart',
      JSON.stringify(cart)
    )

  }, [cart])

  function addToCart(
    product: Product
  ) {

    const productExists =
      cart.find(
        (item) =>
          item.id === product.id
      )

    if (productExists) {

      const updatedCart =
        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }

            : item
        )

      setCart(updatedCart)

      return
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1
      }
    ])
  }

  function removeFromCart(
    id: string
  ) {

    const updatedCart =
      cart
        .map((item) => {

          if (item.id === id) {

            return {
              ...item,
              quantity:
                item.quantity - 1
            }
          }

          return item
        })

        .filter(
          (item) =>
            item.quantity > 0
        )

    setCart(updatedCart)
  }

  function clearCart() {

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

        removeFromCart,

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