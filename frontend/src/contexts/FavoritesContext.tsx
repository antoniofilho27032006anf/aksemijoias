'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

interface FavoriteItem {
  id: string
  name: string
  image: string
  price: number
}

interface FavoritesContextData {
  favorites: FavoriteItem[]

  addFavorite: (product: FavoriteItem) => void
  removeFavorite: (id: string) => void

  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext(
  {} as FavoritesContextData
)

export function FavoritesProvider({
  children
}: {
  children: ReactNode
}) {

  const [favorites, setFavorites] = useState<
    FavoriteItem[]
  >([])

  useEffect(() => {

    const storedFavorites =
      localStorage.getItem('@ak-favorites')

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

  }, [])

  useEffect(() => {

    localStorage.setItem(
      '@ak-favorites',
      JSON.stringify(favorites)
    )

  }, [favorites])

  function addFavorite(product: FavoriteItem) {

    const alreadyExists = favorites.find(
      (item) => item.id === product.id
    )

    if (alreadyExists) {
      return
    }

    setFavorites([
      ...favorites,
      product
    ])
  }

  function removeFavorite(id: string) {

    const updatedFavorites =
      favorites.filter(
        (item) => item.id !== id
      )

    setFavorites(updatedFavorites)
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