'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [filters, setFilters] = useState({
    category: null,
    subCategory: null,
    priceMin: null,
    priceMax: null,
    brand: null,
    rating: null,
    sortBy: 'relevance', // relevance, price_low, price_high, newest, rating
  })
  const router = useRouter()

  // Load search history from localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('searchHistory')
        if (saved) {
          setSearchHistory(JSON.parse(saved))
        }
      } catch (error) {
      }
    }
  }, [])

  const search = useCallback((query) => {
    if (!query || query.trim() === '') return

    const trimmedQuery = query.trim()
    setSearchQuery(trimmedQuery)

    // Add to search history (avoid duplicates)
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== trimmedQuery)
      const updated = [trimmedQuery, ...filtered].slice(0, 10) // Keep only last 10
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(updated))
      }
      
      return updated
    })

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }, [router])

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: null,
      subCategory: null,
      priceMin: null,
      priceMax: null,
      brand: null,
      rating: null,
      sortBy: 'relevance',
    })
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory')
    }
  }

  const removeFromHistory = (query) => {
    setSearchHistory(prev => {
      const updated = prev.filter(item => item !== query)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(updated))
      }
      
      return updated
    })
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        search,
        searchHistory,
        clearSearchHistory,
        removeFromHistory,
        filters,
        updateFilter,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}
