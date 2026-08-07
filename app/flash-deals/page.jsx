'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap } from 'lucide-react'
import { useCountry } from '../../src/context/CountryContext'
import { getFlashSaleProducts } from '../../src/services/homeService'
import { MProductCard } from '../../src/components/mobile/MProductCard'
import { ProductCard } from '../../src/components/desktop/ProductCard'

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function FlashDealsPage() {
  const [flashDeals, setFlashDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [left, setLeft] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { country, price, isLoading: isCountryLoading } = useCountry()
  const router = useRouter()
 
  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
 
  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setLeft((p) => (p <= 0 ? 0 : p - 1)), 1000)
    return () => clearInterval(t)
  }, [])
 
  // Fetch flash deals
  useEffect(() => {
    const fetchFlashDeals = async () => {
      if (!country) return
      try {
        setLoading(true)
        const data = await getFlashSaleProducts(country.id)
        setFlashDeals(data.products || [])
        if (data.remaining_seconds !== null && data.remaining_seconds !== undefined) {
          setLeft(Number(data.remaining_seconds))
        } else {
          setLeft(7 * 3600 + 42 * 60 + 15)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
 
    if (!isCountryLoading && country) {
      fetchFlashDeals()
    }
  }, [country?.id, isCountryLoading])

  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
          <p className="text-sm text-fg-muted font-medium">Loading Flash Deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile Header */}
      {isMobile ? (
        <header className="sticky top-0 z-20 bg-navy px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white active:bg-white/20"
            >
              <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-2 flex-1">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-orange">
                <Zap className="h-4 w-4 fill-white text-white" strokeWidth={0} />
              </span>
              <h1 className="font-display text-lg font-bold text-white">Flash Deals</h1>
            </div>

            <div className="flex items-center gap-1">
              {[h, m, s].map((v, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="grid min-w-[26px] place-items-center rounded bg-white/10 px-1 py-0.5 text-[12px] font-bold tabular-nums text-white ring-1 ring-white/15">
                    {pad(v)}
                  </span>
                  {idx < 2 && <span className="text-[12px] font-bold text-orange-ring">:</span>}
                </div>
              ))}
            </div>
          </div>
        </header>
      ) : (
        /* Desktop Header */
        <header className="bg-navy border-b border-white/10">
          <div className="mx-auto max-w-shell px-4 md:px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                </button>
                
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange">
                    <Zap className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                  </span>
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">Flash Deals</h1>
                    <p className="text-sm text-on-navy">Limited time offers - Grab them fast!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-navy">Ends in:</span>
                <div className="flex items-center gap-1.5">
                  {[h, m, s].map((v, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="grid min-w-[36px] place-items-center rounded-md bg-white/10 px-2 py-1.5 text-sm font-bold tabular-nums text-white ring-1 ring-white/15">
                        {pad(v)}
                      </span>
                      {idx < 2 && <span className="text-sm font-bold text-orange-ring">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Products Grid */}
      <main className={isMobile ? "px-4 py-4" : "mx-auto max-w-shell px-4 md:px-6 py-8"}>
        {flashDeals.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-fg">No Flash Deals Available</h3>
            <p className="text-sm text-fg-muted">Check back later for amazing offers!</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-fg-muted">
                {flashDeals.length} {flashDeals.length === 1 ? 'deal' : 'deals'} available
              </p>
            </div>
            
            <div className={isMobile 
              ? "grid grid-cols-2 gap-3" 
              : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            }>
              {flashDeals.map((product) => (
                isMobile ? (
                  <MProductCard key={product.id} product={product} />
                ) : (
                  <ProductCard key={product.id} product={product} />
                )
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
