'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Search, X, Package } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MProductCard } from '../../src/components/mobile/MProductCard'
import { Header } from '../../src/components/desktop/Header'
import { ProductCard } from '../../src/components/desktop/ProductCard'
import { Footer } from '../../src/components/desktop/Footer'
import { useCountry } from '../../src/context/CountryContext'
import { searchProducts } from '../../src/services/homeService'

const RECENT_SEARCHES_KEY = 'recentSearches'

function SearchContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  
  const { country, isLoading: isCountryLoading } = useCountry()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q')

  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
      }
    }
  }, [])

  useEffect(() => {
    if (queryParam && !isCountryLoading && country) {
      setSearchQuery(queryParam)
      performSearch(queryParam)
      saveToRecentSearches(queryParam)
    }
  }, [queryParam, country?.id, isCountryLoading])

  const performSearch = async (query) => {
    if (!query.trim() || !country) return
    
    try {
      setLoading(true)
      const results = await searchProducts(query, country.id)
      setProducts(results)
    } catch (error) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const saveToRecentSearches = (query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    
    const updated = [
      trimmed,
      ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())
    ].slice(0, 10) // Keep only last 10 searches
    
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleRecentSearchClick = (query) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter(s => s !== query)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  // Desktop version
  if (!isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />

        <main className="flex-1 mx-auto w-full max-w-shell px-4 md:px-6 py-6">
          {/* Search Header */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl">
              <button
                type="button"
                onClick={() => router.back()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line hover:bg-surface-2"
              >
                <ChevronLeft className="h-5 w-5 text-fg" strokeWidth={2} />
              </button>
              <div className="flex-1 flex items-center gap-3 rounded-lg border border-line bg-surface px-4 h-11">
                <Search className="h-5 w-5 shrink-0 text-fg-subtle" strokeWidth={2} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-surface-2"
                  >
                    <X className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-deep transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Content */}
          {!queryParam && recentSearches.length > 0 ? (
            // Recent Searches
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-fg">Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm font-semibold text-orange-deep hover:text-orange transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((query, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3"
                  >
                    <Search className="h-4.5 w-4.5 shrink-0 text-fg-subtle" strokeWidth={2} />
                    <button
                      onClick={() => handleRecentSearchClick(query)}
                      className="flex-1 text-left text-sm text-fg hover:text-orange transition-colors"
                    >
                      {query}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(query)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-surface-2"
                    >
                      <X className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            // Loading
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
                <p className="text-sm text-fg-muted font-medium">Searching...</p>
              </div>
            </div>
          ) : queryParam && products.length === 0 ? (
            // No Results
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.25} />
              <p className="text-base font-semibold text-fg mb-2">No products found</p>
              <p className="text-sm text-fg-muted">
                Try searching with different keywords
              </p>
            </div>
          ) : queryParam && products.length > 0 ? (
            // Search Results
            <>
              <div className="mb-5">
                <p className="text-sm text-fg-muted">
                  <span className="font-semibold text-fg">{products.length}</span> results for &quot;{queryParam}&quot;
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : null}
        </main>

        <Footer />
      </div>
    )
  }

  // Mobile version
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} />

      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-surface border-b border-line px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line active:bg-surface-2"
            >
              <ChevronLeft className="h-5 w-5 text-fg" strokeWidth={2} />
            </button>
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-line bg-bg px-3 h-10">
              <Search className="h-4.5 w-4.5 shrink-0 text-fg-subtle" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full hover:bg-surface-2"
                >
                  <X className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Content */}
        {!queryParam && recentSearches.length > 0 ? (
          // Recent Searches
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-fg">Recent Searches</h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs font-semibold text-orange-deep active:opacity-70"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((query, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5"
                >
                  <Search className="h-4 w-4 shrink-0 text-fg-subtle" strokeWidth={2} />
                  <button
                    onClick={() => handleRecentSearchClick(query)}
                    className="flex-1 text-left text-sm text-fg"
                  >
                    {query}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(query)}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full hover:bg-surface-2"
                  >
                    <X className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : loading ? (
          // Loading
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
              <p className="text-sm text-fg-muted">Searching...</p>
            </div>
          </div>
        ) : queryParam && products.length === 0 ? (
          // No Results
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-fg-subtle mb-3" strokeWidth={1.25} />
            <p className="text-sm font-medium text-fg mb-1">No products found</p>
            <p className="text-xs text-fg-muted text-center px-4">
              Try searching with different keywords
            </p>
          </div>
        ) : queryParam && products.length > 0 ? (
          // Search Results
          <>
            <div className="px-4 py-3 border-b border-line">
              <p className="text-sm text-fg-muted">
                {products.length} results for &quot;{queryParam}&quot;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {products.map((product) => (
                <MProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : null}
      </main>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
