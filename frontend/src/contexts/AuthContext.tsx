'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

import { api } from '../services/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextData {
  user: User | null

  signIn: (
    email: string,
    password: string
  ) => Promise<void>

  logout: () => void
}

const AuthContext = createContext(
  {} as AuthContextData
)

export function AuthProvider({
  children
}: {
  children: ReactNode
}) {

  const [user, setUser] =
    useState<User | null>(null)

  useEffect(() => {

    const storedUser =
      localStorage.getItem('@ak-user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

  }, [])

  async function signIn(
  email: string,
  password: string
) {

  try {

    console.log('tentando login')

    const response = await api.post(
      '/login',
      {
        email: email.trim(),
        password: password.trim()
      }
    )

    console.log('resposta backend')

    console.log(response.data)

    const { token, user } = response.data

    localStorage.setItem(
      '@ak-token',
      token
    )

    localStorage.setItem(
      '@ak-user',
      JSON.stringify(user)
    )

    console.log('salvou localstorage')

    setUser(user)

  } catch (error) {

    console.log(error)

    throw error
  }
}

  function logout() {

    localStorage.removeItem('@ak-token')

    localStorage.removeItem('@ak-user')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}