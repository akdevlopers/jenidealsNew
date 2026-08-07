'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  BadgeCheck,
  ChevronRight,
  ShieldCheck,
  ThumbsUp,
  CheckCircle2,
  MessageSquare
} from 'lucide-react'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { useCountry } from '../../../src/context/CountryContext'
import { useCart } from '../../../src/context/CartContext'
import { useWishlist } from '../../../src/context/WishlistContext'
import { getProductDetails, getAllProducts } from '../../../src/services/homeService'
import { Header as DesktopHeader, Footer as DesktopFooter } from '../../../src/components/desktop'
import { formatDiscountLabel } from '../../../src/utils/formatters'

function EnhancedProductReviews({ product, rating, reviewsCount }) {
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all', 5, 4, 3, 2, 1
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'highest', 'lowest'
  const [visibleCount, setVisibleCount] = useState(4)
  const [helpfulMap, setHelpfulMap] = useState({})

  const reviewsList = Array.isArray(product?.reviews_list) ? product.reviews_list : []

  // Calculate star counts
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviewsList.forEach(r => {
    const s = Math.min(5, Math.max(1, Math.round(parseFloat(r.star_count || r.starCount || r.rating || r.star || 5))))
    starCounts[s] = (starCounts[s] || 0) + 1
  })
  
  // Calculate recommendation percentage (reviews with 4 or 5 stars)
  const totalReviews = reviewsList.length || 0
  const recommendedCount = (starCounts[5] || 0) + (starCounts[4] || 0)
  const recommendationPercentage = totalReviews > 0 ? Math.round((recommendedCount / totalReviews) * 100) : 95

  // Filter reviews
  let filteredReviews = reviewsList.filter(r => {
    if (selectedFilter === 'all') return true
    const s = Math.min(5, Math.max(1, Math.round(parseFloat(r.star_count || r.starCount || r.rating || r.star || 5))))
    return s === Number(selectedFilter)
  })

  // Sort reviews
  filteredReviews = [...filteredReviews].sort((a, b) => {
    const starA = parseFloat(a.star_count || a.starCount || a.rating || 5)
    const starB = parseFloat(b.star_count || b.starCount || b.rating || 5)
    if (sortBy === 'highest') return starB - starA
    if (sortBy === 'lowest') return starA - starB
    return 0 // default order (most recent)
  })

  const displayedReviews = filteredReviews.slice(0, visibleCount)
  const hasMore = filteredReviews.length > visibleCount

  const handleHelpful = (id) => {
    setHelpfulMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-3.5 md:p-5 shadow-xs text-left">
      <div className="flex items-center justify-between gap-2.5 mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare className="h-4.5 w-4.5 text-orange shrink-0" />
          <h3 className="font-display text-base md:text-lg font-bold text-fg leading-tight">
            Ratings & Reviews
          </h3>
        </div>

        {reviewsList.length > 0 && (
          <span className="text-xs font-extrabold bg-orange-tint text-orange-deep px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
            {reviewsList.length} {reviewsList.length === 1 ? 'Review' : 'Reviews'}
          </span>
        )}
      </div>

      {/* Top Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-5 pb-5 border-b border-line">
        {/* Rating Score Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-orange-tint/30 to-surface border border-orange/15 text-center">
          <span className="text-4xl font-black text-navy leading-none">
            {rating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 justify-center my-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star 
                key={i} 
                className="h-3.5 w-3.5" 
                strokeWidth={0} 
                style={{ fill: i <= Math.round(rating) && rating > 0 ? "#F59E0B" : "#E5E7EB" }} 
              />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-fg-muted">
            Based on {reviewsCount || reviewsList.length} reviews
          </p>
          {rating >= 4.0 && (
            <div className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>Many people recommend this</span>
            </div>
          )}
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const cnt = starCounts[star] || 0
            const total = reviewsList.length || 1
            const pct = Math.round((cnt / total) * 100)

            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedFilter(selectedFilter === star ? 'all' : star)}
                className={`w-full flex items-center gap-2.5 text-[11.5px] transition-opacity hover:opacity-80 cursor-pointer ${
                  selectedFilter === star ? 'font-bold text-orange' : 'text-fg-muted'
                }`}
              >
                <div className="flex items-center gap-1 w-10 shrink-0 font-bold text-xs">
                  <span>{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                </div>

                <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-8 text-right shrink-0 text-[10.5px] font-medium text-fg-subtle">
                  {cnt}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter & Sort Controls */}
      {reviewsList.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          {/* Star Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-surface-2 text-fg-muted hover:bg-surface-3'
              }`}
            >
              All ({reviewsList.length})
            </button>
            {[5, 4, 3, 2, 1].map((st) => {
              if (!starCounts[st] && selectedFilter !== st) return null
              return (
                <button
                  key={st}
                  onClick={() => setSelectedFilter(selectedFilter === st ? 'all' : st)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFilter === st
                      ? 'bg-orange text-white shadow-xs'
                      : 'bg-surface-2 text-fg-muted hover:bg-surface-3'
                  }`}
                >
                  <span>{st}★</span>
                  <span>({starCounts[st] || 0})</span>
                </button>
              )
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-fg-subtle font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] font-bold text-fg bg-surface-2 border border-line rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Review Cards List */}
      {displayedReviews.length > 0 ? (
        <div className="space-y-2.5">
          {displayedReviews.map((rev, rIdx) => {
            const revId = rev.id || rIdx
            const starVal = parseFloat(rev.star_count || rev.starCount || rev.rating || rev.star || 5)
            const rawComment = rev.command || rev.comment || rev.review || ''
            const cleanComment = String(rawComment).replace(/^["'“‘]+|["'”’]+$/g, '').trim()
            const reviewerName = rev.user_name || rev.userName || rev.name || rev.customer_name || rev.user || 'Verified Customer'
            const initials = reviewerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
            const revDate = rev.created_at || rev.date || rev.datetime || ''

            const isLiked = !!helpfulMap[revId]

            return (
              <div 
                key={revId} 
                className="bg-white border border-line rounded-xl p-3 md:p-3.5 transition-all hover:border-line-strong hover:shadow-2xs text-left"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-navy to-slate-800 text-white font-bold text-[11px] shadow-xs">
                      {initials}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-[12px] font-bold text-fg leading-tight">
                          {reviewerName}
                        </h4>

                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="h-2.5 w-2.5"
                              strokeWidth={0}
                              style={{ fill: s <= Math.round(starVal) ? "#F59E0B" : "#E5E7EB" }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold text-fg-muted">{starVal.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {revDate && (
                    <span className="text-[10px] text-fg-subtle font-medium shrink-0 whitespace-nowrap">
                      {revDate}
                    </span>
                  )}
                </div>

                {cleanComment && (
                  <div className="mt-2 pt-2 border-t border-line/40">
                    <p className="text-[12px] text-fg-muted leading-snug font-normal">
                      {`"${cleanComment}"`}
                    </p>
                  </div>
                )}

                {/* Helpful Button Bar */}
                <div className="mt-2 flex items-center justify-between pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleHelpful(revId)}
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold transition-colors cursor-pointer ${
                      isLiked ? 'text-orange font-bold' : 'text-fg-subtle hover:text-fg'
                    }`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${isLiked ? 'fill-orange text-orange' : ''}`} strokeWidth={1.75} />
                    <span>{isLiked ? 'Helpful (1)' : 'Was this helpful?'}</span>
                  </button>
                </div>
              </div>
            )
          })}

          {/* Show More Reviews Button */}
          {hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full border border-orange text-orange bg-orange-tint/40 hover:bg-orange hover:text-white text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <span>Show More Reviews ({filteredReviews.length - visibleCount} remaining)</span>
                <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-fg-subtle rounded-xl bg-surface-2/40 border border-line">
          {selectedFilter !== 'all' 
            ? `No ${selectedFilter}-star reviews found.` 
            : 'No customer reviews written yet for this product.'}
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart, getCartCount, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const deliveryText = product?.delivery || product?.delivery_policy || product?.deliveryPolicy
  const returnPolicyText = product?.returnPolicy || product?.return_policy || product?.returnpolicy
  const warrantyText = product?.warranty || product?.warranty_period
  
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleAddToCart = (product, qty) => {
    if (isInCart(product.id)) {
      router.push('/cart')
      return
    }
    addToCart(product, qty)
    setToastMessage('Added to Cart!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: product?.product_name || 'Jeni Deals',
      text: `Check out ${product?.product_name} on Jeni Deals!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setToastMessage('Link copied to clipboard!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href)
          setToastMessage('Link copied to clipboard!')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2000)
        } catch (clipErr) {
        }
      }
    }
  }
  
  const [expandedSections, setExpandedSections] = useState({
    general: true,
  })

  const { country, isLoading: isCountryLoading, price: formatPrice } = useCountry()
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  useEffect(() => {
    if (productId && !isCountryLoading && country) {
      fetchProductData()
    }
  }, [productId, country?.id, isCountryLoading])

  const fetchProductData = async () => {
    if (!country) return
    try {
      setLoading(true)
      let productData
      let targetCountryId = country.id
      
      try {
        productData = await getProductDetails(productId, targetCountryId)
      } catch (err) {
        const fallbackCountryId = targetCountryId === '1' ? '2' : '1'
        try {
          productData = await getProductDetails(productId, fallbackCountryId)
          targetCountryId = fallbackCountryId
        } catch (fbErr) {
          throw new Error('Product not found in either country')
        }
      }
      
      setProduct(productData)
      
      if (productData?.category_id && productData?.subcategory) {
        try {
          const related = await getAllProducts({
            category: productData.category_id,
            subcategory: productData.subcategory,
            country: targetCountryId
          })
          setRelatedProducts(related.filter(p => String(p.id) !== String(productId)).slice(0, 6))
        } catch (err) {
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <>
        {/* Mobile Loading Skeleton */}
        <div className="md:hidden flex min-h-screen flex-col bg-bg">
          <MobileHeader onOpenMenu={() => setMenuOpen(true)} />
          <main className="flex-1 px-4 py-4 space-y-4">
            {/* Image Skeleton */}
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            
            {/* Product Info Skeleton */}
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                <div className="h-6 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
            
            {/* Action Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="h-12 flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
            </div>
            
            {/* Details Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            </div>
          </main>
          <BottomNav />
        </div>
        
        {/* Desktop Loading Skeleton */}
        <div className="hidden md:block min-h-screen bg-bg">
          <DesktopHeader />
          <div className="mx-auto max-w-[1320px] px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)_340px]">
              {/* Image Skeleton */}
              <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
              
              {/* Product Info Skeleton */}
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                <div className="h-6 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                  <div className="h-8 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2 pt-4">
                  <div className="h-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Action Buttons Skeleton */}
              <div className="space-y-3">
                <div className="h-12 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
          <DesktopFooter />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <div className="md:hidden flex min-h-screen flex-col bg-bg">
          <MobileHeader onOpenMenu={() => setMenuOpen(true)} />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Package className="h-16 w-16 text-fg-subtle mb-3 mx-auto" strokeWidth={1.25} />
              <p className="text-sm text-fg-muted">Product not found</p>
            </div>
          </main>
          <BottomNav />
        </div>
        
        <div className="hidden md:block min-h-screen bg-bg">
          <DesktopHeader />
          <main className="flex flex-1 items-center justify-center py-20">
            <div className="text-center">
              <Package className="h-16 w-16 text-fg-subtle mb-3 mx-auto" strokeWidth={1.25} />
              <p className="text-sm text-fg-muted">Product not found</p>
            </div>
          </main>
          <DesktopFooter />
        </div>
      </>
    )
  }

  const offerPrice = parseFloat(product.offer_price || product.price || 0)
  const originalPrice = parseFloat(product.orginal_rate || product.mrp || 0)
  
  const discount = originalPrice > offerPrice ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) : 0
  const rating = product.rating || product.average_rating || 0
  const reviewsCount = product.reviews || product.review_count || 0

  const images = product.multi_image ? JSON.parse(product.multi_image) : []
  const allImages = Array.from(new Set([product.product_img_url, ...images].filter(Boolean)))

  const MobileUI = () => (
    <div className="md:hidden flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-3 py-3 text-white shadow-md">
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 font-display text-[15px] font-bold truncate text-white ml-2 text-left">
          {product.product_name}
        </h1>
        <div className="flex gap-1">
          <button 
            onClick={() => router.push('/cart')}
            className="relative grid h-9 w-9 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white shadow-md">
                {getCartCount()}
              </span>
            )}
          </button>
          <button 
            onClick={handleShare}
            className="grid h-9 w-9 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
          >
            <Share2 className="h-5 w-5" strokeWidth={2} />
          </button>
          <button 
            onClick={() => product && toggleWishlist(product)}
            className="grid h-9 w-9 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
          >
            <Heart className={`h-5 w-5 ${product && isInWishlist(product.id) ? 'fill-sale text-sale' : 'text-white'}`} strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <div className="relative bg-[#FAF5FF] flex flex-col items-center py-6 px-4">
          <div className="w-full aspect-square max-w-[340px] flex items-center justify-center">
            {allImages.length > 0 ? (
              <img
                src={allImages[selectedImage]}
                alt={product.product_name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="grid h-full place-items-center">
                <Package className="h-20 w-20 text-fg-subtle" strokeWidth={1.25} />
              </div>
            )}
          </div>

          {discount > 0 && (
            <div className="absolute left-4 top-4 rounded-lg bg-sale px-2.5 py-1 text-sm font-bold text-white shadow-lg">
              {formatDiscountLabel(`${discount}%`)}
            </div>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="bg-surface border-b border-line px-4 py-3 flex justify-center gap-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-14 w-14 overflow-hidden rounded-md transition-all ${
                  idx === selectedImage ? 'ring-2 ring-orange ring-offset-1' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}

        <div className="bg-surface px-4 py-4 border-b border-line">
          {product.brand && (
            <span className="text-success font-semibold text-[13px] flex items-center gap-1.5 mb-1.5">
              <Check className="h-4 w-4 shrink-0 bg-success-tint p-0.5 rounded-full text-success" strokeWidth={3} />
              {product.brand}
            </span>
          )}

          <h2 className="text-[19px] font-bold text-fg leading-snug mb-2">
            {product.product_name}
          </h2>

          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  strokeWidth={0}
                  style={{ fill: i <= Math.round(rating) && rating > 0 ? "#F59E0B" : "#E5E7EB" }}
                />
              ))}
            </div>
            <span className="text-[13px] font-semibold text-fg ml-1">{rating.toFixed(1)}</span>
            <span className="text-[13px] text-fg-muted">({reviewsCount.toLocaleString()})</span>
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="font-display text-2xl font-bold text-fg">
              {formatPrice(offerPrice)}
            </span>
            {originalPrice > offerPrice && (
              <>
                <span className="text-base text-fg-subtle line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-semibold text-sale bg-sale/10 px-2 py-0.5 rounded">
                  Save {formatPrice(originalPrice - offerPrice)}
                </span>
              </>
            )}
          </div>
          <p className="text-[12px] text-fg-muted mb-1">Inclusive of all taxes</p>
        </div>

        {(deliveryText || returnPolicyText || warrantyText) && (
          <div className="bg-surface px-4 py-4 border-b border-line flex flex-col gap-3">
            <div className={`grid ${[deliveryText, returnPolicyText, warrantyText].filter(Boolean).length === 3 ? 'grid-cols-3' : [deliveryText, returnPolicyText, warrantyText].filter(Boolean).length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
              {deliveryText && (
                <div className="flex flex-col items-center text-center gap-1.5 rounded-lg border border-line bg-surface px-1.5 py-3">
                  <Truck className="h-5 w-5 text-fg-muted" strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold text-fg leading-tight">{deliveryText}</span>
                </div>
              )}
              {returnPolicyText && (
                <div className="flex flex-col items-center text-center gap-1.5 rounded-lg border border-line bg-surface px-1.5 py-3">
                  <RotateCcw className="h-5 w-5 text-fg-muted" strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold text-fg leading-tight">{returnPolicyText}</span>
                </div>
              )}
              {warrantyText && (
                <div className="flex flex-col items-center text-center gap-1.5 rounded-lg border border-line bg-surface px-1.5 py-3">
                  <Shield className="h-5 w-5 text-fg-muted" strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold text-fg leading-tight">{warrantyText}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {product.description && (
          <div className="bg-surface px-4 py-4 border-b border-line">
            <h3 className="text-[13px] font-bold text-fg-muted uppercase tracking-wider mb-2.5">
              Product Description
            </h3>
            <div 
              className="text-sm text-fg-muted leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        <div className="bg-surface border-b border-line">
          <h3 className="text-[13px] font-bold text-fg-muted uppercase tracking-wider px-4 pt-4 mb-1">
            Full specifications
          </h3>
          
          <div className="border-b border-line/50">
            <button
              onClick={() => toggleSection('general')}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-surface-2 transition-colors"
            >
              <span className="text-[13.5px] font-bold text-fg">General</span>
              {expandedSections.general ? <ChevronUp className="h-4 w-4 text-fg-muted" /> : <ChevronDown className="h-4 w-4 text-fg-muted" />}
            </button>
            {expandedSections.general && (
              <div className="px-4 pb-3.5 flex flex-col gap-2.5">
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-fg-muted text-[13px]">Name</span>
                  <span className="text-fg font-medium text-[13px] truncate max-w-[60%]">{product.product_name}</span>
                </div>
                {product.brand && (
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-fg-muted text-[13px]">Brand</span>
                    <span className="text-fg font-medium text-[13px]">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-1">
                    <span className="text-fg-muted text-[13px]">SKU</span>
                    <span className="text-fg font-medium text-[13px]">{product.sku}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Ratings & Customer Reviews Section */}
        <div className="mt-3 px-3">
          <EnhancedProductReviews product={product} rating={rating} reviewsCount={reviewsCount} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-surface px-4 py-4 mt-3 border-t border-line">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[16px] font-bold text-fg">
                Related products
              </h3>
              <button className="text-[13px] font-bold text-[#F97316] flex items-center gap-0.5 active:opacity-75">
                See all
                <span className="text-[11px] font-semibold">&gt;</span>
              </button>
            </div>
            <div className="no-scrollbar flex gap-3.5 overflow-x-auto pb-2">
              {relatedProducts.map((p) => {
                const original = parseFloat(p.orginal_rate || p.mrp || 0)
                const offer = parseFloat(p.offer_price || p.price || 0)
                const discountPct = original > offer ? Math.round(((original - offer) / original) * 100) : 0
                
                return (
                  <div 
                    key={p.id} 
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="w-[140px] shrink-0 rounded-2xl border border-line bg-surface overflow-hidden cursor-pointer active:opacity-95"
                  >
                    <div className="relative aspect-square bg-[#FAF5FF] flex items-center justify-center p-2.5">
                      {p.product_img_url ? (
                        <img src={p.product_img_url} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Package className="h-10 w-10 text-fg-subtle" strokeWidth={1.25} />
                      )}
                      {discountPct > 0 && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-sale px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                          {formatDiscountLabel(`${discountPct}%`)}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <h4 className="text-[12.5px] font-medium text-fg line-clamp-2 leading-snug min-h-[34px]">
                        {p.product_name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-[14px] font-bold text-fg">
                          {formatPrice(offer)}
                        </span>
                        {original > offer && (
                          <span className="text-[11px] text-fg-subtle line-through">
                            {formatPrice(original)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line px-4 py-3 pb-safe shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="grid h-9 w-8 place-items-center active:bg-surface-3 rounded transition-colors"
          >
            <Minus className="h-3.5 w-3.5 text-fg" strokeWidth={2.5} />
          </button>
          <span className="min-w-[18px] text-center text-[13px] font-bold text-fg">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="grid h-9 w-8 place-items-center active:bg-surface-3 rounded transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-fg" strokeWidth={2.5} />
          </button>
        </div>

        <button
          onClick={() => product && handleAddToCart(product, quantity)}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg border py-2.5 px-1.5 text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap ${
            product && isInCart(product.id)
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
              : 'border-navy bg-surface text-navy active:bg-navy active:text-white'
          }`}
        >
          {product && isInCart(product.id) ? (
            <>
              <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
              <span className="whitespace-nowrap">Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="whitespace-nowrap">Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            if (product) {
              const checkoutItem = {
                ...product,
                quantity: quantity,
                selected_quantity: quantity
              }
              // Store in BOTH sessionStorage and localStorage for persistence across login
              sessionStorage.setItem('buyNowItem', JSON.stringify(checkoutItem))
              localStorage.setItem('buyNowItem', JSON.stringify(checkoutItem))
              router.push('/checkout?buynow=true')
            }
          }}
          className="flex-1 rounded-lg bg-orange py-2.5 px-2 text-[12px] sm:text-[13px] font-bold text-white active:bg-orange-deep transition-colors shadow whitespace-nowrap"
        >
          Buy now
        </button>
      </div>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );

  const DesktopUI = () => (
    <div className="hidden md:block min-h-screen bg-bg">
      <DesktopHeader />

      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-6 py-3 text-[13px] text-fg-muted">
          <div className="flex min-w-0 items-center gap-1.5">
            <button onClick={() => router.push('/')} className="hover:text-orange-deep">Home</button>
            <ChevronRight className="h-3.5 w-3.5 text-fg-subtle" />
            <span className="truncate font-medium text-fg">{product.product_name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)_340px]">

          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
              <div className="relative aspect-square bg-[#FAF5FF] flex items-center justify-center p-4">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.product_name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <Package className="h-20 w-20 text-fg-subtle" strokeWidth={1.25} />
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-md bg-sale px-2.5 py-1 text-[12px] font-bold text-white">{formatDiscountLabel(`${discount}%`)}</span>
                )}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <button onClick={() => product && toggleWishlist(product)} className="grid h-9 w-9 place-items-center rounded-full bg-white text-fg-muted shadow-sm transition-colors hover:text-sale">
                    <Heart className={`h-4 w-4 ${product && isInWishlist(product.id) ? 'fill-sale text-sale' : 'text-fg-muted'}`} strokeWidth={1.75} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-fg-muted shadow-sm transition-colors hover:text-navy"
                  >
                    <Share2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-16 w-16 overflow-hidden rounded-md transition-all ${
                      selectedImage === idx ? 'ring-2 ring-orange ring-offset-1' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            {product.brand && (
              <div className="flex items-center gap-2 text-[13px]">
                <span className="inline-flex items-center gap-1 font-medium text-success">
                  <BadgeCheck className="h-4 w-4" strokeWidth={2} />{product.brand}
                </span>
              </div>
            )}

            <h1 className="mt-2 font-display text-[26px] font-bold leading-tight text-fg">{product.product_name}</h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      strokeWidth={0}
                      style={{ fill: i <= Math.round(rating) && rating > 0 ? "#F59E0B" : "#E5E7EB" }}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-fg ml-1">{rating.toFixed(1)}</span>
                <span className="text-[13px] text-fg-muted">({reviewsCount.toLocaleString()} reviews)</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="font-display text-[30px] font-bold text-fg">{formatPrice(offerPrice)}</span>
              {originalPrice > offerPrice && (
                <>
                  <span className="text-[15px] text-fg-subtle line-through">{formatPrice(originalPrice)}</span>
                  <span className="rounded-md bg-sale/10 px-2 py-0.5 text-[13px] font-bold text-sale">Save {formatPrice(originalPrice - offerPrice)}</span>
                </>
              )}
            </div>
            <p className="mt-1 text-[12.5px] text-fg-muted">Inclusive of all taxes · prices shown in {country.currency}</p>

            <div className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-xs">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-fg-muted">Why you&apos;ll love it</h3>
              <ul className="mt-2.5 space-y-2">
                {[
                  "Verified authentic — ships from an official Jenideals seller",
                  returnPolicyText ? `${returnPolicyText}, no questions asked` : null,
                  warrantyText ? `${warrantyText} warranty available` : null,
                ].filter(Boolean).map((hl) => (
                  <li key={hl} className="flex items-start gap-2 text-[13.5px] text-fg">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success bg-success-tint p-0.5 rounded-full" strokeWidth={3} />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(deliveryText || returnPolicyText || warrantyText) && (
              <div className={`mt-4 grid ${[deliveryText, returnPolicyText, warrantyText].filter(Boolean).length === 3 ? 'grid-cols-3' : [deliveryText, returnPolicyText, warrantyText].filter(Boolean).length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                {[
                  ...(deliveryText ? [{ icon: Truck, t: deliveryText, s: "On this order" }] : []),
                  ...(returnPolicyText ? [{ icon: RotateCcw, t: returnPolicyText, s: "Free & easy" }] : []),
                  ...(warrantyText ? [{ icon: ShieldCheck, t: warrantyText, s: "Brand backed" }] : [])
                ].map((b) => {
                  const BIcon = b.icon;
                  return (
                    <div key={b.t} className="flex flex-col items-start gap-1 rounded-lg border border-line bg-surface p-3">
                      <BIcon className="h-5 w-5 text-navy" strokeWidth={1.75} />
                      <span className="text-[12.5px] font-semibold text-fg">{b.t}</span>
                      <span className="text-[11px] text-fg-muted">{b.s}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {product.description && (
              <div className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-xs">
                <h3 className="text-[13px] font-bold text-fg-muted uppercase tracking-wider mb-2.5">
                  Product Description
                </h3>
                <div 
                  className="text-sm text-fg-muted leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>

          <div className="xl:sticky xl:top-4 xl:self-start">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
              <div className="p-4">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="font-display text-[30px] font-bold text-fg">{formatPrice(offerPrice)}</span>
                  {originalPrice > offerPrice && (
                    <span className="text-[15px] text-fg-subtle line-through">{formatPrice(originalPrice)}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-[13px] font-semibold text-fg-muted mb-2 block">Quantity</label>
                  <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-1 w-fit">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="grid h-9 w-8 place-items-center active:bg-surface-3 rounded transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5 text-fg" strokeWidth={2.5} />
                    </button>
                    <span className="min-w-[30px] text-center text-[13px] font-bold text-fg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="grid h-9 w-8 place-items-center active:bg-surface-3 rounded transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-fg" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => product && handleAddToCart(product, quantity)}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg border py-3 px-3 text-[14px] font-bold transition-all mb-2 shadow-xs ${
                    product && isInCart(product.id)
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80'
                      : 'border-navy bg-surface text-navy active:bg-navy active:text-white'
                  }`}
                >
                  {product && isInCart(product.id) ? (
                    <>
                      <Check className="h-4.5 w-4.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
                      <span className="whitespace-nowrap">Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4.5 w-4.5 shrink-0" strokeWidth={2.5} />
                      <span className="whitespace-nowrap">Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (product) {
                      const checkoutItem = {
                        ...product,
                        quantity: quantity,
                        selected_quantity: quantity
                      }
                      // Store in BOTH sessionStorage and localStorage for persistence across login
                      sessionStorage.setItem('buyNowItem', JSON.stringify(checkoutItem))
                      localStorage.setItem('buyNowItem', JSON.stringify(checkoutItem))
                      router.push('/checkout?buynow=true')
                    }
                  }}
                  className="w-full rounded-lg bg-orange py-3 text-[14px] font-bold text-white active:bg-orange-deep transition-colors shadow"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-[18px] font-bold text-fg mb-4">Related products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {relatedProducts.map((p) => {
                const original = parseFloat(p.orginal_rate || p.mrp || 0)
                const offer = parseFloat(p.offer_price || p.price || 0)
                const discountPct = original > offer ? Math.round(((original - offer) / original) * 100) : 0
                
                return (
                  <div 
                    key={p.id} 
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="rounded-2xl border border-line bg-surface overflow-hidden cursor-pointer active:opacity-95"
                  >
                    <div className="relative aspect-square bg-[#FAF5FF] flex items-center justify-center p-3">
                      {p.product_img_url ? (
                        <img src={p.product_img_url} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Package className="h-10 w-10 text-fg-subtle" strokeWidth={1.25} />
                      )}
                      {discountPct > 0 && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-sale px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                          {formatDiscountLabel(`${discountPct}%`)}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <h4 className="text-[12.5px] font-medium text-fg line-clamp-2 leading-snug min-h-[34px]">
                        {p.product_name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-[14px] font-bold text-fg">
                          {formatPrice(offer)}
                        </span>
                        {original > offer && (
                          <span className="text-[11px] text-fg-subtle line-through">
                            {formatPrice(original)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Desktop Ratings & Customer Reviews Section */}
        <div className="mt-8">
          <EnhancedProductReviews product={product} rating={rating} reviewsCount={reviewsCount} />
        </div>
      </div>
      
      <DesktopFooter />
    </div>
  );

  return (
    <>
      <MobileUI />
      <DesktopUI />
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce transition-all duration-300">
          <Check className="h-4.5 w-4.5 bg-white/20 p-0.5 rounded-full text-white" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  )
}
