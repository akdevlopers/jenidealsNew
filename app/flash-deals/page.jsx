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
        <header className="sticky top-0 z-20 bg-navy px-3.5 py-3 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <button
                onClick={() => router.back()}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white active:bg-white/20"
              >
                <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
              
              <div className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-md bg-orange shadow-xs">
                <Zap className="h-4.5 w-4.5 fill-white text-white" strokeWidth={0} />
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-[14px] font-bold text-white leading-tight truncate">Flash Sale</h1>
                <span className="text-[8.5px] font-bold tracking-wider text-slate-400 uppercase leading-none mt-0.5">ENDS IN:</span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-1 shrink-0">
              {/* HRS */}
              <div className="flex min-w-[32px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-black/5">
                <span className="text-[13px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(h)}
                </span>
                <span className="text-[8px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  HRS
                </span>
              </div>

              <span className="text-white font-black text-xs select-none">:</span>

              {/* MIN */}
              <div className="flex min-w-[32px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-black/5">
                <span className="text-[13px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(m)}
                </span>
                <span className="text-[8px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  MIN
                </span>
              </div>

              <span className="text-white font-black text-xs select-none">:</span>

              {/* SEC */}
              <div className="flex min-w-[32px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-black/5">
                <span className="text-[13px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(s)}
                </span>
                <span className="text-[8px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  SEC
                </span>
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* Desktop Header */
        <header className="bg-navy border-b border-white/10">
          <div className="mx-auto max-w-shell px-4 md:px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-orange shadow-xs">
                    <Zap className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white leading-tight">Flash Sale</h1>
                    <p className="text-xs text-slate-400">Limited time offers - Grab them fast!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">ENDS IN:</span>
                <div className="flex items-center gap-1.5">
                  {/* HRS */}
                  <div className="flex min-w-[40px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                    <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                      {pad(h)}
                    </span>
                    <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                      HRS
                    </span>
                  </div>

                  <span className="text-white font-black text-xs select-none">:</span>

                  {/* MIN */}
                  <div className="flex min-w-[40px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                    <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                      {pad(m)}
                    </span>
                    <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                      MIN
                    </span>
                  </div>

                  <span className="text-white font-black text-xs select-none">:</span>

                  {/* SEC */}
                  <div className="flex min-w-[40px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                    <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                      {pad(s)}
                    </span>
                    <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                      SEC
                    </span>
                  </div>
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
