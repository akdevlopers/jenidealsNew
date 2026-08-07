'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Plus, Star, BadgeCheck, Package, Trash2 } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useWishlist } from '../../src/context/WishlistContext'
import { useCountry } from '../../src/context/CountryContext'

function FavouritesContent() {
  const [isMobile, setIsMobile] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { price: formatPrice } = useCountry()
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: 'success' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.message])

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const handleRemoveFromWishlist = (e, productId) => {
    e.stopPropagation()
    removeFromWishlist(productId)
    setToast({ message: 'Removed from favourites.', type: 'success' })
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    setToast({ message: 'Added to cart!', type: 'success' })
  }

  const renderProductCardMobile = (product) => {
    const originalPrice = parseFloat(product.orginal_rate || product.mrp || 0)
    const offerPrice = parseFloat(product.offer_price || product.price || 0)
    const off = originalPrice > offerPrice ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) : 0
    const rating = parseFloat(product.rating || product.average_rating || 0)
    const reviews = product.reviews || 0

    return (
      <div
        key={product.id}
        onClick={() => router.push(`/product/${product.id}`)}
        className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface active:opacity-95 cursor-pointer"
        style={{ boxShadow: 'var(--shadow-xs)' }}
      >
        <div className="relative aspect-square bg-surface-2">
          <div className="absolute inset-0 grid place-items-center">
            <Package className="h-14 w-14 text-fg-subtle" strokeWidth={1.25} />
          </div>
          {product.product_img_url && (
            <img
              src={product.product_img_url}
              alt={product.product_name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {off > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-sale px-2 py-1 text-xs font-bold text-white">
              -{off}%
            </span>
          )}
          <button
            onClick={(e) => handleRemoveFromWishlist(e, product.id)}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-sale shadow-sm"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-3 text-left">
          {product.store_name && (
            <div className="flex items-center gap-1 text-xs text-fg-muted mb-1.5">
              <BadgeCheck className="h-3 w-3 shrink-0 text-success" strokeWidth={2} />
              <span className="truncate">{product.store_name}</span>
            </div>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-fg mb-2">
            {product.product_name}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="inline-flex items-center gap-0.5 rounded bg-success-tint px-1.5 py-0.5">
                <Star className="h-3 w-3 fill-success text-success" strokeWidth={0} />
                <span className="text-xs font-semibold text-success">{rating.toFixed(1)}</span>
              </span>
              {reviews > 0 && (
                <span className="text-xs text-fg-muted">
                  ({reviews > 999 ? (reviews / 1000).toFixed(1) + 'k' : reviews})
                </span>
              )}
            </div>
          )}
          <div className="mt-auto flex items-end justify-between pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-fg">
                {formatPrice(offerPrice)}
              </span>
              {originalPrice > offerPrice && (
                <span className="text-xs text-fg-subtle line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-white active:bg-orange-deep"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderProductCardDesktop = (product) => {
    const name = product.product_name || product.name || ""
    const mrpVal = parseFloat(product.orginal_rate || product.mrp || 0)
    const priceVal = parseFloat(product.offer_price || product.price || 0)
    const ratingVal = parseFloat(product.rating || product.average_rating || 0)
    const reviewsCount = product.reviews || product.review_count || 0
    const sellerName = product.brand || product.seller || "Jeni Deals"
    const imgUrl = product.product_img_url || product.product_img
    const off = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0

    return (
      <div
        key={product.id}
        onClick={() => router.push(`/product/${product.id}`)}
        className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all hover:border-line-strong hover:-translate-y-0.5 cursor-pointer"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF5FF]">
          <div className="absolute inset-0 grid place-items-center p-3">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={name}
                className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <Package className="h-12 w-12 text-fg-subtle" strokeWidth={1.25} />
            )}
          </div>
          {off > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-sale px-2 py-1 text-[11px] font-bold text-white">
              -{off}%
            </span>
          )}
          <button
            onClick={(e) => handleRemoveFromWishlist(e, product.id)}
            className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-white text-sale shadow-sm"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-3.5 text-left">
          <div className="flex items-center gap-1 text-[12px] text-fg-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-success" strokeWidth={2} />
            <span className="truncate">{sellerName}</span>
          </div>
          <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[14px] font-medium leading-snug text-fg">
            {name}
          </h3>
          {ratingVal > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-success-tint px-1.5 py-0.5 text-[12px] font-semibold text-success">
                <Star className="h-3 w-3 fill-success" strokeWidth={0} />
                {ratingVal.toFixed(1)}
              </span>
              <span className="text-[12px] text-fg-subtle">({reviewsCount.toLocaleString()})</span>
            </div>
          )}
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-bold text-fg">{formatPrice(priceVal)}</span>
                {mrpVal > priceVal && (
                  <span className="text-[12px] text-fg-subtle line-through">{formatPrice(mrpVal)}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-white transition-colors hover:bg-orange-deep"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Heart className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-fg mb-2">No favourites yet!</h2>
      <p className="text-sm text-fg-muted mb-6">Start adding products you like to your favourites list.</p>
      <button
        onClick={() => router.push('/')}
        className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
      >
        Browse Products
      </button>
    </div>
  )

  const renderMobileView = () => (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      <main className="flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-sale" />
            <h1 className="text-lg font-bold text-fg">My Favourites</h1>
            {wishlist.length > 0 && (
              <span className="text-xs text-fg-muted">({wishlist.length})</span>
            )}
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-fg-muted hover:text-sale"
            >
              Clear All
            </button>
          )}
        </div>
        {wishlist.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlist.map(renderProductCardMobile)}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )

  const renderDesktopView = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-sale" />
            <h1 className="text-2xl font-bold text-fg">My Favourites</h1>
            {wishlist.length > 0 && (
              <span className="text-sm text-fg-muted">({wishlist.length} items)</span>
            )}
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm text-fg-muted hover:text-sale"
            >
              Clear All
            </button>
          )}
        </div>
        {wishlist.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlist.map(renderProductCardDesktop)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {toast.message && (
        <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[100000] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-xl animate-fade-in">
          <span className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  )
}

export default function FavouritesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <FavouritesContent />
    </Suspense>
  )
}
