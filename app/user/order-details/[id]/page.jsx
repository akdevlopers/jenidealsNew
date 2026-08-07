'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MobileHeader } from '../../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../../src/components/mobile/BottomNav'
import { Header } from '../../../../src/components/desktop/Header'
import { Footer } from '../../../../src/components/desktop/Footer'
import { useAuth } from '../../../../src/context/AuthContext'
import { useCountry } from '../../../../src/context/CountryContext'
import { orderService } from '../../../../src/services/orderService'
import { ArrowLeft, Package, MapPin, Loader2 } from 'lucide-react'



// Helper function to map order status numbers to labels
const getOrderStatusLabel = (orderDetails) => {
  const status = orderDetails.order_detail_shipping_status ?? orderDetails.order_status
  const statusMap = {
    0: 'Pending',
    2: 'In Progress',
    3: 'Ready For Shipping',
    4: 'Shipping',
    5: 'Delivered',
    6: 'Returned'
  }
  return statusMap[status] || 'Pending'
}

// Helper function to get status color
const getOrderStatusColor = (orderDetails) => {
  const status = orderDetails.order_detail_shipping_status ?? orderDetails.order_status
  const colorMap = {
    0: 'bg-yellow-100 text-yellow-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-purple-100 text-purple-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-green-100 text-green-800',
    6: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-yellow/10 text-yellow-800'
}

function MobileOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user && params.id) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, user, params.id, router, authLoading])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrderDetails(params.id, user.id, country.id)
      
      if (response.status && response.Data) {
        setOrderData(response.Data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading order details...</p>
      </div>
    )
  }

  const orderDetails = orderData?.orderDetails || {}
  const productDetails = orderData?.productDetails || []
  const shippingDetails = orderData?.shippingDetails || {}

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={() => router.push('/categories')} showSearch={false} />
      <main className="flex-1 px-4 py-6 pb-32">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/user/dashboard')} className="p-1">
            <ArrowLeft className="h-5 w-5 text-fg" />
          </button>
          <h1 className="font-display text-lg font-bold text-fg">Order #{orderDetails.id || params.id}</h1>
        </div>

        {orderData ? (
          <div className="space-y-4">
            {/* Order Status */}
            <div className="bg-white rounded-xl border border-line p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-fg-muted">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(orderDetails)}`}>
                  {getOrderStatusLabel(orderDetails)}
                </span>
              </div>
              <p className="text-sm text-fg">Ordered on: {orderDetails.created_at || 'N/A'}</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-line p-4">
              <h3 className="text-sm font-bold text-fg mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h3>
              <p className="text-sm text-fg">
                {shippingDetails.shipping_name}<br/>
                {shippingDetails.shipping_phone}<br/>
                {shippingDetails.shipping_address}, {shippingDetails.city || ''}, {shippingDetails.state || ''} {shippingDetails.pincode || ''}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-line p-4">
              <h3 className="text-sm font-bold text-fg mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items
              </h3>
              <div className="space-y-3">
                {productDetails.map((item, index) => (
                  <div key={index} className="flex gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                    {item.productImage && (
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-16 h-16 object-cover rounded-lg bg-bg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-fg line-clamp-2">{item.productName}</h4>
                      <p className="text-xs text-fg-muted mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-orange mt-1">
                        {formatPrice(parseFloat(item.totalPrice))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-line p-4">
              <h3 className="text-sm font-bold text-fg mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="border-t border-line pt-2 flex justify-between">
                  <span className="font-bold text-fg">Total</span>
                  <span className="font-bold text-orange">{formatPrice(parseFloat(orderDetails.totaltransactionamount || 0))}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-fg-muted">Order not found</p>
            <button 
              onClick={() => router.push('/user/dashboard')}
              className="mt-4 px-4 py-2 bg-orange text-white rounded-lg text-sm font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

function DesktopOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user && params.id) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, user, params.id, router, authLoading])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrderDetails(params.id, user.id, country.id)
      
      if (response.status && response.Data) {
        setOrderData(response.Data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading order details...</p>
      </div>
    )
  }

  const orderDetails = orderData?.orderDetails || {}
  const productDetails = orderData?.productDetails || []
  const shippingDetails = orderData?.shippingDetails || {}

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <button onClick={() => router.push('/user/dashboard')} className="p-1 hover:text-orange">
            <ArrowLeft className="h-5 w-5 text-fg" />
          </button>
          <h1 className="font-display text-2xl font-bold text-fg">Order #{orderDetails.id || params.id}</h1>
        </div>

        {orderData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Order Items & Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl border border-line p-6">
                <h3 className="text-base font-bold text-fg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </h3>
                <p className="text-sm text-fg">
                  {shippingDetails.shipping_name}<br/>
                  {shippingDetails.shipping_phone}<br/>
                  {shippingDetails.shipping_address}, {shippingDetails.city || ''}, {shippingDetails.state || ''} {shippingDetails.pincode || ''}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl border border-line p-6">
                <h3 className="text-base font-bold text-fg mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {productDetails.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="w-24 h-24 object-cover rounded-lg bg-bg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-fg line-clamp-2">{item.productName}</h4>
                        <p className="text-sm text-fg-muted mt-2">Qty: {item.quantity}</p>
                        <p className="text-base font-bold text-orange mt-2">
                          {formatPrice(parseFloat(item.totalPrice))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Status */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl border border-line p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-fg-muted">Status</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getOrderStatusColor(orderDetails)}`}>
                  {getOrderStatusLabel(orderDetails)}
                </span>
                </div>
                <p className="text-sm text-fg">Ordered on: {orderDetails.created_at || 'N/A'}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl border border-line p-6">
                <h3 className="text-base font-bold text-fg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-t border-line pt-3 flex justify-between">
                    <span className="text-base font-bold text-fg">Total</span>
                    <span className="text-base font-bold text-orange">{formatPrice(parseFloat(orderDetails.totaltransactionamount || 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-fg-muted text-lg">Order not found</p>
            <button 
              onClick={() => router.push('/user/dashboard')}
              className="mt-6 px-6 py-3 bg-orange text-white rounded-lg text-base font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function OrderDetailPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return isMobile ? <MobileOrderDetailPage /> : <DesktopOrderDetailPage />
}
