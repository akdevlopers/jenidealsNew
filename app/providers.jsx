'use client'

import { CountryProvider } from '../src/context/CountryContext'
import { CartProvider } from '../src/context/CartContext'
import { AuthProvider } from '../src/context/AuthContext'
import { WishlistProvider } from '../src/context/WishlistContext'
import { SearchProvider } from '../src/context/SearchContext'

export function Providers({ children }) {
  return (
    <AuthProvider>
      <CountryProvider>
        <SearchProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </SearchProvider>
      </CountryProvider>
    </AuthProvider>
  )
}
