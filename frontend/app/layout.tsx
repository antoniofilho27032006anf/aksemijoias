import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { AuthProvider } from '../src/contexts/AuthContext'
import { FavoritesProvider } from '../src/contexts/FavoritesContext'
import { CartProvider } from '../src/contexts/CartContext'

import './globals.css'

import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AKsemijoias',
  description: 'Loja de semijoias premium',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >

      <body>

        <AuthProvider>

          <FavoritesProvider>

            <CartProvider>

              {children}

              <Toaster
                richColors
                position="top-right"
              />

            </CartProvider>

          </FavoritesProvider>

        </AuthProvider>

      </body>

    </html>

  )
}