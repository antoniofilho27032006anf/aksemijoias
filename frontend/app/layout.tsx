import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'

import { AuthProvider } from '../src/contexts/AuthContext'
import { FavoritesProvider } from '../src/contexts/FavoritesContext'
import { CartProvider } from '../src/contexts/CartContext'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { Footer } from '../src/components/Footer'

import './globals.css'

import { Toaster } from 'sonner'

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
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
      data-theme="light"
      className={`${montserrat.variable} ${cormorant.variable}`}
    >

      <body>

        <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            {children}
            <Footer />
            <Toaster richColors position="top-right" />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>

      </body>

    </html>

  )
}