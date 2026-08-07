'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useCountry } from './CountryContext'

const WishlistContext = createContext(null)

const WISHLIST_STORAGE_KEY = 'user_wishlist'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { country, isLoading: countryLoading } = useCountry()
  const [prevCountryId, setPrevCountryId] = useState(null)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (saved) {
        setWishlist(JSON.parse(saved))
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  // Set initial previous country once country is loaded
  useEffect(() => {
    if (!countryLoading && country && prevCountryId === null) {
      setPrevCountryId(country.id)
    }
  }, [country, countryLoading, prevCountryId])

  // Reset wishlist when country changes (not on initial load)
  useEffect(() => {
    if (!loading && !countryLoading && country && prevCountryId !== null && country.id !== prevCountryId) {
      setWishlist([])
      setPrevCountryId(country.id)
    }
  }, [country, countryLoading, loading, prevCountryId])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    }
  }, [wishlist, loading])

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      // Prevent duplicates
      if (prevWishlist.some(item => item.id === product.id)) {
        return prevWishlist
      }
      return [...prevWishlist, { ...product, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(item => item.id !== productId)
    )
  }

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      return false // removed
    } else {
      addToWishlist(product)
      return true // added
    }
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const getWishlistCount = () => {
    return wishlist.length
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
