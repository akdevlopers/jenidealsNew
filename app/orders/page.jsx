'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, ChevronRight, ShoppingBag, Loader2, Clock } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useAuth } from '../../src/context/AuthContext'
import { useCountry } from '../../src/context/CountryContext'
import { orderService } from '../../src/services/orderService'

export default function OrdersPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { price: formatPrice, country } = useCountry()
  const router = useRouter()

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
    // Wait for auth to finish loading before checking
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/user/login')
      return
    }
    
    // Only fetch on initial load when user is available
    if (isInitialLoad && user && country) {
      setIsInitialLoad(false)
      fetchOrders(false)
    }
  }, [isAuthenticated, user, country, router, authLoading])

  useEffect(() => {
    // Fetch more orders when page changes (but not on initial load)
    if (!isInitialLoad && page > 1 && user && country) {
      fetchOrders(true)
    }
  }, [page])

  const fetchOrders = async (loadMore = false) => {
    if (!user || !country) return
    
    try {
      setLoading(!loadMore) // Only show main loader for initial load
      const currentPage = loadMore ? page : 1
      const response = await orderService.getOrders(user.id, currentPage, 10, country.id)
      
      if (response.status && response.Data && response.Data.orderDetails) {
        const ordersData = response.Data.orderDetails
        
        if (loadMore) {
          setOrders(prev => [...prev, ...ordersData])
        } else {
          setOrders(ordersData)
        }
        
        // Check pagination
        if (response.Data.pagination) {
          const { currentPage, lastPage } = response.Data.pagination
          setHasMore(currentPage < lastPage)
        } else {
          setHasMore(ordersData.length >= 10)
        }
      } else {
        if (!loadMore) setOrders([])
        setHasMore(false)
      }
    } catch (error) {
      if (!loadMore) setOrders([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const getStatusText = (order) => {
    const status = order.order_detail_shipping_status ?? order.order_status
    const statusMap = {
      0: 'Pending',
      2: 'Inprogress',
      3: 'Shipping',
      4: 'Delivered',
      5: 'Returned',
      6: 'Ready For Shipping'
    }
    return statusMap[status] || (order.payment_status === 'pending' ? 'Pending Payment' : 'Pending')
  }

  const getStatusColor = (order) => {
    const status = order.order_detail_shipping_status ?? order.order_status
    const colorMap = {
      0: 'text-yellow-600 bg-yellow-100',
      2: 'text-blue-600 bg-blue-100',
      3: 'text-orange-600 bg-orange-100',
      4: 'text-green-600 bg-green-100',
      5: 'text-red-600 bg-red-100',
      6: 'text-purple-600 bg-purple-100'
    }
    return colorMap[status] || (order.payment_status === 'pending' ? 'text-orange bg-orange-tint' : 'text-fg-muted bg-surface-2')
  }

  const loadMoreOrders = () => {
    setPage(prev => prev + 1)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShoppingBag className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-fg mb-2">No Orders Yet!</h2>
      <p className="text-sm text-fg-muted mb-6">You haven&apos;t placed any orders yet.</p>
      <button
        onClick={() => router.push('/')}
        className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
      >
        Start Shopping
      </button>
    </div>
  )

  const renderOrderCard = (order) => {
    const statusText = getStatusText(order)
    const statusColor = getStatusColor(order)
    
    // Get total items count from productDetails array
    const totalItems = order.productDetails?.length || 1
    
    // Parse total amount from totaltransactionamount (remove " ( COD )" or similar)
    const amountText = order.totaltransactionamount || '0'
    const amount = parseFloat(amountText.replace(/[^\d.]/g, ''))

    // Different rendering for mobile vs desktop
    if (isMobile) {
      return (
        <div
          key={order.id}
          onClick={() => router.push(`/order-details?id=${order.id}`)}
          className="bg-white border border-line rounded-2xl p-4 mb-3 active:bg-surface-2 shadow-sm"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-orange mb-1">
                #{order.payment_order_id}
              </p>
              <p className="text-xs text-fg-muted flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.created_at}
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor} whitespace-nowrap`}>
              {statusText}
            </span>
          </div>

          {/* Product Section */}
          <div className="flex gap-3 mb-3 pb-3 border-b border-line">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
              <img
                src={order.productImage || '/placeholder-product.png'}
                alt={order.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-fg line-clamp-2 mb-2">
                {order.productName}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-fg-muted bg-surface-2 px-2 py-0.5 rounded">
                  Qty: {order.quantity}
                </span>
                {totalItems > 1 && (
                  <span className="text-xs text-orange bg-orange-tint px-2 py-0.5 rounded font-semibold">
                    +{totalItems - 1} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-fg-muted mb-1">
                {order.payment_method === 'COD' || order.payment_method === 'cod' 
                  ? 'Cash on Delivery' 
                  : order.payment_method === 'nomod' 
                    ? 'Online Payment' 
                    : order.payment_method?.toUpperCase() || 'N/A'}
              </p>
              <p className="text-lg font-bold text-fg">
                {formatPrice(amount)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-orange">
              <span className="text-xs font-semibold">View</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      )
    }

    // Desktop version
    return (
      <div
        key={order.id}
        onClick={() => router.push(`/order-details?id=${order.id}`)}
        className="group bg-white border-2 border-line rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-orange/40 hover:-translate-y-1 active:scale-[0.98]"
      >
        <div className="flex items-center gap-6">
          {/* Product Image */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-surface-2 flex-shrink-0 shadow-md ring-2 ring-line group-hover:ring-orange/30 transition-all">
            <img
              src={order.productImage || '/placeholder-product.png'}
              alt={order.productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/placeholder-product.png'
              }}
            />
          </div>

          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-orange mb-1 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  #{order.payment_order_id}
                </p>
                <p className="text-xs text-fg-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {order.created_at}
                </p>
              </div>
              <span className={`text-sm font-bold px-4 py-2 rounded-xl shadow-sm ${statusColor}`}>
                {statusText}
              </span>
            </div>

            <h3 className="text-base font-bold text-fg line-clamp-2 mb-3 group-hover:text-orange transition-colors">
              {order.productName}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-fg-muted bg-surface-2 px-3 py-1.5 rounded-lg font-medium">
                  Qty: {order.quantity}
                </span>
                {totalItems > 1 && (
                  <span className="text-sm text-orange bg-orange-tint px-3 py-1.5 rounded-lg font-bold">
                    +{totalItems - 1} more item{totalItems - 1 > 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-xs text-fg-muted bg-surface-2 px-3 py-1.5 rounded-lg">
                  {order.payment_method === 'COD' || order.payment_method === 'cod' 
                    ? 'Cash on Delivery' 
                    : order.payment_method === 'nomod' 
                      ? 'Online Payment' 
                      : order.payment_method?.toUpperCase() || 'N/A'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-fg-muted mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-fg">
                    {formatPrice(amount)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-orange bg-orange-tint px-4 py-3 rounded-xl group-hover:bg-orange group-hover:text-white transition-all">
                  <span className="text-sm font-bold">View</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
        <main className="flex-1 px-3 py-4 pb-24">
          {/* Mobile Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-orange-tint rounded-xl">
                <Package className="h-5 w-5 text-orange" />
              </div>
              <h1 className="text-xl font-bold text-fg">My Orders</h1>
            </div>
            <p className="text-xs text-fg-muted ml-11">Track and manage your orders</p>
          </div>
          
          {orders.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {orders.map(renderOrderCard)}
              {hasMore && (
                <button
                  onClick={loadMoreOrders}
                  className="w-full rounded-xl bg-surface border-2 border-line px-4 py-3 text-sm font-semibold text-fg active:bg-surface-2 mt-3 flex items-center justify-center gap-2"
                >
                  <Loader2 className="h-4 w-4" />
                  Load More Orders
                </button>
              )}
            </>
          )}
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-bg to-surface-2/30 py-12">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-orange to-orange-deep rounded-2xl shadow-lg">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-fg">My Orders</h1>
                <p className="text-fg-muted text-sm mt-1">Track and manage all your orders</p>
              </div>
            </div>
          </div>
          
          {/* Orders Content */}
          {orders.length === 0 ? (
            <div className="max-w-5xl mx-auto">
              {renderEmptyState()}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 gap-5">
                {orders.map(renderOrderCard)}
              </div>
              {hasMore && (
                <button
                  onClick={loadMoreOrders}
                  className="w-full rounded-2xl bg-surface border-2 border-line px-6 py-5 text-base font-semibold text-fg hover:bg-surface-2 hover:border-orange hover:shadow-lg transition-all mt-6 flex items-center justify-center gap-3 group"
                >
                  <Loader2 className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Load More Orders
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
