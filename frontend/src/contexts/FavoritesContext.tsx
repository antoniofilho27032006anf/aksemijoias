'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

import { api } from '../services/api'

import { useAuth } from './AuthContext'

interface FavoriteItem {

  id: string
  name: string
  image: string
  price: number

}

interface FavoritesContextData {

  favorites: FavoriteItem[]

  addFavorite: (
    product: FavoriteItem
  ) => Promise<void>

  removeFavorite: (
    id: string
  ) => Promise<void>

  isFavorite: (
    id: string
  ) => boolean

}

const FavoritesContext = createContext(
  {} as FavoritesContextData
)

export function FavoritesProvider({
  children
}: {
  children: ReactNode
}) {

  const { user } = useAuth() as any

  const [favorites, setFavorites] =
    useState<FavoriteItem[]>([])

  useEffect(() => {

    async function loadFavorites() {

      try {

        if (!user) {
          return
        }

        const response =
          await api.get(
            `/favorites/${user.id}`
          )

        const formattedFavorites =
          response.data.map(
            (favorite: any) => ({

              id:
                favorite.product.id,

              name:
                favorite.product.name,

              image:
                favorite.product.image,

              price:
                favorite.product.price

            })
          )

        setFavorites(
          formattedFavorites
        )

      } catch (error) {

        console.log(error)

      }

    }

    loadFavorites()

  }, [user])

  async function addFavorite(
    product: FavoriteItem
  ) {

    try {

      if (!user) {
        return
      }

      const alreadyExists =
        favorites.find(
          (item) =>
            item.id === product.id
        )

      if (alreadyExists) {
        return
      }

      await api.post(
        '/favorites',
        {

          userId: user.id,

          productId: product.id

        }
      )

      setFavorites([
        ...favorites,
        product
      ])

    } catch (error) {

      console.log(error)

    }

  }

  async function removeFavorite(
    id: string
  ) {

    try {

      if (!user) {
        return
      }

      await api.delete(
        '/favorites',
        {

          data: {

            userId: user.id,

            productId: id

          }

        }
      )

      const updatedFavorites =
        favorites.filter(
          (item) => item.id !== id
        )

      setFavorites(
        updatedFavorites
      )

    } catch (error) {

      console.log(error)

    }

  }

  function isFavorite(id: string) {

    return favorites.some(
      (item) => item.id === id
    )

  }

  return (

    <FavoritesContext.Provider
      value={{

        favorites,

        addFavorite,

        removeFavorite,

        isFavorite

      }}
    >

      {children}

    </FavoritesContext.Provider>

  )

}

export function useFavorites() {
  return useContext(FavoritesContext)
}