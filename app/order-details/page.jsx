'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ShoppingBag,
  Star,
  X
} from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useAuth } from '../../src/context/AuthContext'
import { useCountry } from '../../src/context/CountryContext'
import { orderService } from '../../src/services/orderService'

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

function OrderDetailsContent() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Rate & Review State
  const [activeReviewProduct, setActiveReviewProduct] = useState(null)
  const [viewRatingProduct, setViewRatingProduct] = useState(null)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewedMap, setReviewedMap] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { price: formatPrice, country } = useCountry()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user && orderId) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, user, orderId, authLoading])

  // Clear toast automatically
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await orderService.getOrderDetails(orderId, user.id, country.id)
      
      if (response.status && response.Data) {
        const orderData = {
          ...response.Data.orderDetails,
          productDetails: response.Data.productDetails,
          shippingDetails: response.Data.shippingDetails,
          ...response.Data.shippingDetails
        }
        setOrder(orderData)
      } else {
        setError(response.message || 'Failed to load order details')
      }
    } catch (error) {
      setError(error.message || 'An error occurred while loading order details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!activeReviewProduct || !user) return

    const detailId = activeReviewProduct.orderDetailId || activeReviewProduct.id || activeReviewProduct.order_detail_id

    setIsSubmittingReview(true)
    try {
      const response = await orderService.reviewProduct({
        userId: user.id,
        orderDetailId: detailId,
        orderId: order?.id || orderId,
        rating: rating,
        review: reviewText
      })

      const isAlreadyReviewed = response.message && (
        response.message.toLowerCase().includes('already reviewed') || 
        response.message.toLowerCase().includes('already rate') || 
        response.message.toLowerCase().includes('already')
      )

      if (response.status || response.code === 200 || response.success || isAlreadyReviewed) {
        const updatedMap = { ...reviewedMap, [detailId]: true }
        setReviewedMap(updatedMap)

        if (isAlreadyReviewed) {
          setToastMessage({ type: 'info', text: 'You have already reviewed this product.' })
        } else {
          setToastMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' })
        }
        
        // Clear order cache & refetch order details from API to get updated product rating & review from server
        try {
          orderService.clearOrderCache()
          fetchOrderDetails()
        } catch (e) {}

        setActiveReviewProduct(null)
        setReviewText('')
        setRating(5)
      } else {
        setToastMessage({ type: 'error', text: response.message || 'Failed to submit review. Please try again.' })
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to submit review. Please try again.' })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getStatusText = (shippingStatus) => {
    const statusMap = {
      0: 'Pending',
      2: 'Inprogress',
      3: 'Shipping',
      4: 'Delivered',
      5: 'Returned',
      6: 'Ready For Shipping'
    }
    return statusMap[shippingStatus] || 'Pending'
  }

  const getStatusIcon = (shippingStatus) => {
    const iconMap = {
      0: <Clock className="h-5 w-5 text-yellow-600" />,
      2: <Package className="h-5 w-5 text-blue-600" />,
      3: <Truck className="h-5 w-5 text-orange-600" />,
      4: <CheckCircle className="h-5 w-5 text-green-600" />,
      5: <XCircle className="h-5 w-5 text-red-600" />,
      6: <CheckCircle className="h-5 w-5 text-purple-600" />
    }
    return iconMap[shippingStatus] || <Clock className="h-5 w-5 text-yellow-600" />
  }

  const getStatusColor = (shippingStatus) => {
    const colorMap = {
      0: 'text-yellow-600 bg-yellow-100',
      2: 'text-blue-600 bg-blue-100',
      3: 'text-orange-600 bg-orange-100',
      4: 'text-green-600 bg-green-100',
      5: 'text-red-600 bg-red-100',
      6: 'text-purple-600 bg-purple-100'
    }
    return colorMap[shippingStatus] || 'text-yellow-600 bg-yellow-100'
  }

  const getOverallShippingStatus = (products) => {
    if (!products || products.length === 0) return 0
    const statuses = products.map(p => p.order_detail_shipping_status || 0)
    return Math.min(...statuses)
  }

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <Package className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold text-fg mb-2">Order Not Found</h2>
        <p className="text-sm text-fg-muted mb-2">
          {error || "The order you're looking for doesn't exist."}
        </p>
        {orderId && (
          <p className="text-xs text-fg-muted mb-6">Order ID: {orderId}</p>
        )}
        <button
          onClick={() => router.push('/orders')}
          className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const products = order.productDetails || []
  const overallShippingStatus = getOverallShippingStatus(products)
  
  const statusText = getStatusText(overallShippingStatus)
  const statusIcon = getStatusIcon(overallShippingStatus)
  const statusColor = getStatusColor(overallShippingStatus)
  
  const amountText = order.totaltransactionamount || '0'
  const totalAmount = parseFloat(amountText.replace(/[^\d.]/g, ''))

  const renderContent = () => (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce ${
          toastMessage.type === 'success' ? 'bg-green-600 text-white' : toastMessage.type === 'info' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-fg mb-4 hover:text-orange transition-colors group"
        >
          <div className="p-2 rounded-lg bg-surface border border-line group-hover:border-orange transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Back to Orders</span>
        </button>
        
        <div className="bg-gradient-to-br from-orange/10 to-orange-tint rounded-2xl p-6 border border-orange/20 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-fg text-xl sm:text-2xl mb-2">
                Order Details
              </h1>
              <div className="flex items-center gap-2 text-orange mb-1">
                <Package className="h-4.5 w-4.5" />
                <p className="text-base font-bold">#{order.payment_order_id}</p>
              </div>
              <p className="text-xs text-fg-muted flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Placed on {order.created_at}
              </p>
            </div>
            <div className={`self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl ${statusColor} shadow-xs border border-current/10`}>
              {statusIcon}
              <span className="text-sm font-extrabold">{statusText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Grid Layout: Single Column on Mobile, 3 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Main Column: Items & Order Progress Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Section */}
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-fg mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange" />
                Order Items
              </span>
              <span className="text-sm text-fg-muted font-normal">({products.length} {products.length === 1 ? 'item' : 'items'})</span>
            </h2>
            <div className="space-y-5">
              {products.map((product, index) => {
                const productAmount = parseFloat(product.totalPrice || 0)
                const productStatus = product.order_detail_shipping_status || 0
                const productStatusText = getStatusText(productStatus)
                const productStatusColor = getStatusColor(productStatus)

                const detailId = product.orderDetailId || product.id || product.order_detail_id || index
                const isItemDelivered = productStatus == 4 || overallShippingStatus == 4 || String(product.status) === '4'
                const isReviewed = Boolean(
                  product.isReviewed == 1 || 
                  product.isReviewed === '1' || 
                  product.isReviewed === true || 
                  product.is_reviewed == 1 || 
                  product.reviewed == 1 || 
                  product.is_reviewed === '1' || 
                  product.review_status == 1 || 
                  product.review_status === '1' ||
                  (product.starCount && parseFloat(product.starCount) > 0) ||
                  (product.rating && parseFloat(product.rating) > 0) ||
                  (product.star_count && parseFloat(product.star_count) > 0) ||
                  (product.user_rating && parseFloat(product.user_rating) > 0) ||
                  (product.command && String(product.command).trim() !== '') ||
                  (product.review && String(product.review).trim() !== '') ||
                  reviewedMap[detailId]
                )
                
                return (
                  <div key={detailId} className="flex flex-col gap-3 pb-5 border-b border-line last:border-0 last:pb-0">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0 border border-line/60 p-1">
                        <img
                          src={product.productImage || '/placeholder-product.png'}
                          alt={product.productName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png'
                          }}
                        />
                        <div className={`absolute bottom-0 left-0 right-0 px-1 py-0.5 text-[9px] font-bold text-center ${productStatusColor.split(' ')[0]} bg-opacity-95`}>
                          {productStatusText}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-fg line-clamp-2 mb-1">
                          {product.productName}
                        </p>
                        {product.attributeName && (
                          <p className="text-xs text-fg-muted bg-surface-2 inline-block px-2 py-0.5 rounded mb-1.5">{product.attributeName}</p>
                        )}
                        <p className="text-xs text-fg-muted font-medium mb-1">
                          Qty: {product.quantity}
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-navy">
                          {formatPrice(productAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Rate Product Button - Only show if delivered */}
                    {isItemDelivered && (
                      <div className="flex justify-end pt-1">
                        {isReviewed ? (
                          <button
                            type="button"
                            onClick={() => setViewRatingProduct(product)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-orange bg-orange-tint/40 hover:bg-orange-tint text-orange font-bold text-xs sm:text-sm shadow-2xs active:scale-95 transition-all cursor-pointer"
                          >
                            <Star className="h-4 w-4 fill-orange text-orange" />
                            <span>View your Ratings</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReviewProduct(product)
                              setRating(5)
                              setReviewText('')
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-orange bg-white text-orange hover:bg-orange/5 font-bold text-xs sm:text-sm shadow-2xs active:scale-95 transition-all cursor-pointer"
                          >
                            <Star className="h-4 w-4 fill-orange text-orange" />
                            <span>Rate Product</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Progress Timeline */}
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-fg mb-6 flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange" />
              Order Status
            </h2>
            <div className="space-y-4">
              {/* Step 1: Pending (status 0) */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallShippingStatus >= 0 ? 'bg-yellow-500 text-white' : 'bg-surface-2 text-fg-muted'} shadow-sm`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  {overallShippingStatus > 0 && overallShippingStatus !== 5 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200"></div>}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-semibold text-fg">Order Placed</p>
                  <p className="text-xs text-fg-muted mt-1">Your order has been received</p>
                  <p className="text-[11px] text-fg-subtle">{order.created_at}</p>
                </div>
              </div>
              
              {/* Step 2: In Progress (status 2) */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallShippingStatus >= 2 ? 'bg-blue-500 text-white' : 'bg-surface-2 text-fg-muted'} shadow-sm`}>
                    <Package className="h-5 w-5" />
                  </div>
                  {overallShippingStatus >= 2 && overallShippingStatus !== 5 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200"></div>}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-semibold text-fg">Inprogress</p>
                  <p className="text-xs text-fg-muted mt-1">Order confirmed and in progress</p>
                </div>
              </div>
              
              {/* Step 3: Ready For Shipping (status 6) */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallShippingStatus >= 6 || overallShippingStatus === 3 || overallShippingStatus === 4 ? 'bg-purple-500 text-white' : 'bg-surface-2 text-fg-muted'} shadow-sm`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  {(overallShippingStatus >= 6 || overallShippingStatus === 3 || overallShippingStatus === 4) && overallShippingStatus !== 5 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200"></div>}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-semibold text-fg">Ready for Shipping</p>
                  <p className="text-xs text-fg-muted mt-1">Order is ready for shipping</p>
                </div>
              </div>
              
              {/* Step 4: Shipping (status 3) */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallShippingStatus === 3 || overallShippingStatus === 4 ? 'bg-orange-500 text-white' : 'bg-surface-2 text-fg-muted'} shadow-sm`}>
                    <Truck className="h-5 w-5" />
                  </div>
                  {(overallShippingStatus === 3 || overallShippingStatus === 4) && overallShippingStatus !== 5 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200"></div>}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-semibold text-fg">Shipping</p>
                  <p className="text-xs text-fg-muted mt-1">Order is out for shipping</p>
                </div>
              </div>
              
              {/* Step 5: Delivered (status 4) */}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallShippingStatus === 4 ? 'bg-green-500 text-white' : 'bg-surface-2 text-fg-muted'} shadow-sm`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-semibold text-fg">Delivered</p>
                  {overallShippingStatus === 4 && <p className="text-xs text-green-600 font-medium mt-1">Order has been delivered successfully</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Secondary Column: Address, Payment & Order Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {(order.shipping_name || order.shipping_address) && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-tint rounded-lg">
                  <MapPin className="h-4 w-4 text-orange" />
                </div>
                <h2 className="text-base font-bold text-fg">Delivery Address</h2>
              </div>
              <div className="bg-surface-2 rounded-xl p-4">
                <p className="text-sm font-semibold text-fg mb-1">{order.shipping_name}</p>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {order.shipping_address}, {order.city || ''}, {order.state || ''} {order.pincode || ''}
                </p>
                {order.shipping_phone && (
                  <p className="text-sm text-fg-muted mt-2 flex items-center gap-2">
                    <span className="font-medium">Phone:</span> {order.shipping_phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-tint rounded-lg">
                <CreditCard className="h-4 w-4 text-orange" />
              </div>
              <h2 className="text-base font-bold text-fg">Payment Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-surface-2 rounded-xl p-3">
                <p className="text-sm text-fg-muted">Payment Status</p>
                <p className={`text-sm font-bold ${
                  order.payment_status === 'pending' ? 'text-orange' : 'text-green-600'
                }`}>
                  {order.payment_status?.toUpperCase() || 'N/A'}
                </p>
              </div>
              {order.transaction_id && (
                <div className="flex items-center justify-between bg-surface-2 rounded-xl p-3">
                  <p className="text-sm text-fg-muted">Transaction ID</p>
                  <p className="text-xs font-mono text-fg font-semibold">{order.transaction_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-orange/5 to-orange-tint/50 border-2 border-orange/20 rounded-2xl p-6 shadow-md">
            <h2 className="text-base font-bold text-fg mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg-muted">Subtotal</p>
                <p className="text-sm font-semibold text-fg">{formatPrice(totalAmount)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg-muted">Shipping</p>
                <p className="text-sm font-semibold text-green-600">FREE</p>
              </div>
              <div className="h-px bg-orange/20 my-3"></div>
              <div className="flex items-center justify-between bg-white/60 rounded-xl p-4 shadow-2xs">
                <p className="text-base font-bold text-fg">Total Amount</p>
                <p className="text-xl font-bold text-orange">{formatPrice(totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Product Modal / Bottom Sheet */}
      {activeReviewProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={() => !isSubmittingReview && setActiveReviewProduct(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Pill Header */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => !isSubmittingReview && setActiveReviewProduct(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Title & Product Name */}
            <div className="text-center mb-6 pt-1">
              <h3 className="font-display text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Rate Your Experience
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 line-clamp-1 max-w-[280px] mx-auto">
                {activeReviewProduct.productName}
              </p>
            </div>

            {/* Star Rating Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFilled = (hoverRating || rating) >= starIndex
                  return (
                    <button
                      key={starIndex}
                      type="button"
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starIndex)}
                      className="p-1 cursor-pointer transition-transform active:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-9 w-9 sm:h-10 sm:w-10 transition-all ${
                          isFilled
                            ? 'fill-orange text-orange drop-shadow-xs'
                            : 'fill-gray-100 text-gray-200'
                        }`}
                        strokeWidth={1}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Rating Label */}
              <p className="text-base font-extrabold text-orange mt-2.5 min-h-[24px] transition-all">
                {RATING_LABELS[hoverRating || rating] || ''}
              </p>
            </div>

            {/* Care to share more? Textarea */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
                Care to share more?
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={250}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your order experience..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all resize-none"
                />
                <span className="block text-[11px] font-semibold text-gray-400 text-right mt-1.5">
                  {reviewText.length}/250
                </span>
              </div>
            </div>

            {/* Submit Review Button */}
            <button
              type="button"
              disabled={isSubmittingReview}
              onClick={handleSubmitReview}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange hover:bg-orange-deep text-white font-bold py-3.5 text-sm sm:text-base shadow-md active:scale-[0.98] transition-all disabled:opacity-60 shadow-orange-500/20"
            >
              {isSubmittingReview ? (
                <>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* View Rating Modal / Bottom Sheet */}
      {viewRatingProduct && (() => {
        const displayRating = parseFloat(viewRatingProduct.starCount) || 
                              parseFloat(viewRatingProduct.rating) || 
                              parseFloat(viewRatingProduct.star_count) || 
                              parseFloat(viewRatingProduct.user_rating) || 
                              parseFloat(viewRatingProduct.star) || 
                              parseFloat(viewRatingProduct.rating_value) || 5
        const rawReview = viewRatingProduct.command || 
                          viewRatingProduct.comments || 
                          viewRatingProduct.comment || 
                          viewRatingProduct.review || 
                          viewRatingProduct.user_review || 
                          viewRatingProduct.review_text || 
                          viewRatingProduct.review_comment || 
                          viewRatingProduct.user_comment || 
                          viewRatingProduct.feedback || ''
        
        // Strip any existing surrounding quotes from string
        const displayReview = String(rawReview || '').replace(/^["'“‘]+|["'”’]+$/g, '').trim()

        const displayDate = viewRatingProduct.review_date || 
                            viewRatingProduct.reviewed_at || 
                            viewRatingProduct.rating_date || 
                            viewRatingProduct.created_at || null

        return (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
            onClick={() => setViewRatingProduct(null)}
          >
            <div 
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Drag Pill Header */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setViewRatingProduct(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>

              {/* Title & Product Name */}
              <div className="text-center mb-6 pt-1">
                <h3 className="font-display text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Your Product Review
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 line-clamp-1 max-w-[280px] mx-auto">
                  {viewRatingProduct.productName}
                </p>
              </div>

              {/* Rating Display */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const isFilled = displayRating >= starIndex
                    return (
                      <Star
                        key={starIndex}
                        className={`h-9 w-9 sm:h-10 sm:w-10 transition-all ${
                          isFilled
                            ? 'fill-orange text-orange drop-shadow-xs'
                            : 'fill-gray-100 text-gray-200'
                        }`}
                        strokeWidth={1}
                      />
                    )
                  })}
                </div>
                <p className="text-base font-extrabold text-orange mt-2.5">
                  {RATING_LABELS[Math.round(displayRating)] || 'Rating Submitted'}
                </p>
                {displayDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on {displayDate}
                  </p>
                )}
              </div>

              {/* Written Review */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Your Comment
                </label>
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-xs sm:text-sm text-gray-800 leading-relaxed italic min-h-[70px]">
                  {displayReview ? (
                    <span>&ldquo;{displayReview}&rdquo;</span>
                  ) : (
                    <span className="text-gray-400 not-italic">No written review comment provided.</span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setViewRatingProduct(null)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange hover:bg-orange-deep text-white font-bold py-3.5 text-sm sm:text-base shadow-md active:scale-[0.98] transition-all cursor-pointer shadow-orange-500/20"
              >
                Close
              </button>
            </div>
          </div>
        )
      })()}
    </>
  )

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileHeader 
          onOpenMenu={() => router.push('/categories')} 
          showSearch={false} 
        />
        <main className="flex-1 px-4 py-6 pb-32">
          {renderContent()}
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailsContent />
    </Suspense>
  )
}
