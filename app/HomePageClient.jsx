'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '../src/components/mobile/MobileHeader'
import { CategoryCircles } from '../src/components/mobile/CategoryCircles'
import { HeroBanner } from '../src/components/mobile/HeroBanner'
import { PromoCards } from '../src/components/mobile/PromoCards'
import { MFlashDeals } from '../src/components/mobile/MFlashDeals'
import { MTrending } from '../src/components/mobile/MTrending'
import { MBrands } from '../src/components/mobile/MBrands'
import { MSellerCTA } from '../src/components/mobile/MSellerCTA'
import { BottomNav } from '../src/components/mobile/BottomNav'
import { DesktopHome, Header, Footer } from '../src/components/desktop'
import { JeniTravelDeals } from '../src/components/JeniTravelDeals'
import { FeaturedCategoryBanners } from '../src/components/FeaturedCategoryBanners'
import { useCountry } from '../src/context/CountryContext'

// Skeleton components for loading state
const SkeletonCategoryCircles = () => (
  <div className="px-4 pt-3">
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
          <div className="w-10 h-2 rounded-full bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonPromoCards = () => (
  <div className="px-4 pt-4">
    <div className="grid grid-cols-2 gap-3">
      {[1, 2].map(i => (
        <div key={i} className="h-32 rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
      ))}
    </div>
  </div>
);

const SkeletonFlashDeals = () => (
  <div className="px-4 pt-5">
    <div className="flex items-center justify-between mb-3">
      <div className="w-32 h-5 rounded-full bg-slate-200 animate-pulse" />
      <div className="w-20 h-4 rounded-full bg-slate-200 animate-pulse" />
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="min-w-[140px] rounded-xl bg-white border border-line p-2">
          <div className="w-full aspect-square rounded-lg bg-slate-200 animate-pulse mb-2" />
          <div className="w-3/4 h-3 rounded-full bg-slate-200 animate-pulse mb-1" />
          <div className="w-1/2 h-3 rounded-full bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonBrands = () => (
  <div className="px-4 pt-5">
    <div className="w-24 h-5 rounded-full bg-slate-200 animate-pulse mb-3" />
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-square rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
      ))}
    </div>
  </div>
);

export default function HomePageClient({ homeData, loading = false }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Handler for menu - navigate to categories page
  const handleOpenMenu = () => {
    router.push('/categories')
  }

  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    setIsMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
          <p className="text-sm text-fg-muted font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Loading state with skeletons
  if (loading || !homeData) {
    if (!isMobile) {
      // Desktop skeleton
      return (
        <div className="min-h-screen bg-bg">
          <Header />
          <main className="mx-auto max-w-shell">
            <div className="px-4 md:px-6 pt-5">
              {/* Hero skeleton */}
              <div className="rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" style={{ aspectRatio: '1920/540' }} />
              {/* Flash deals skeleton */}
              <div className="mt-8">
                <div className="w-40 h-6 rounded-full bg-slate-200 animate-pulse mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="rounded-xl bg-white border border-line p-3">
                      <div className="w-full aspect-square rounded-lg bg-slate-200 animate-pulse mb-2" />
                      <div className="w-3/4 h-3 rounded-full bg-slate-200 animate-pulse mb-1" />
                      <div className="w-1/2 h-3 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )
    }

    // Mobile skeleton
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileHeader onOpenMenu={handleOpenMenu} />
        <main className="flex-1">
          <SkeletonCategoryCircles />
          <HeroBanner loading={true} />
          <SkeletonPromoCards />
          <SkeletonFlashDeals />
          <SkeletonBrands />
        </main>
        <BottomNav />
      </div>
    )
  }

  // Render desktop version for non-mobile devices
  if (!isMobile) {
    return <DesktopHome data={homeData} loading={false} />
  }

  // Mobile layout
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} />

      <main className="flex-1">
        <CategoryCircles categories={homeData?.categories} />
        <HeroBanner banners={homeData?.mobileBanners} webBanners={homeData?.webBanners} />
        {/* <PromoCards /> */}
        <MFlashDeals
          products={homeData?.flash_deals}
          remainingSeconds={homeData?.flashsale_info?.remaining_seconds}
        />
        <FeaturedCategoryBanners featuredCollections={homeData?.featured_collections} categories={homeData?.categories} />
        <MBrands brands={homeData?.brand} />
        <JeniTravelDeals />
        <MTrending allData={homeData} />
        <MSellerCTA />
        <div className="h-6" />
      </main>

      <BottomNav />
    </div>
  )
}
