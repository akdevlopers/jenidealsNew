'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, ArrowRight, Truck, ShieldCheck, Clock, Copy, Check, Sparkles } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useCart } from '../../src/context/CartContext'
import { authService } from '../../src/services/authService'

function OrderSuccessContent() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { clearCart } = useCart()

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
    // Clear cart & sync latest user wallet balance when order is successful
    if (isMounted) {
      // Clean up ordered products from cart in localStorage if specific IDs were saved
      try {
        const lastOrderedJson = sessionStorage.getItem('last_ordered_product_ids')
        if (lastOrderedJson) {
          const orderedIds = JSON.parse(lastOrderedJson).map(id => String(id))
          const savedCart = localStorage.getItem('shopping_cart')
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            if (Array.isArray(parsedCart)) {
              const filteredCart = parsedCart.filter(item => item && item.id && !orderedIds.includes(String(item.id)))
              localStorage.setItem('shopping_cart', JSON.stringify(filteredCart))
            }
          }
          sessionStorage.removeItem('last_ordered_product_ids')
        }
      } catch (err) {
      }

      clearCart()
      sessionStorage.removeItem('buyNowItem')
      localStorage.removeItem('buyNowItem')

      const syncWalletBalance = async () => {
        try {
          const user = authService.getUserData()
          const savedCountryCode = typeof window !== 'undefined' ? localStorage.getItem('selectedCountry') : 'ae'
          const countryId = savedCountryCode === 'in' ? '1' : '2'

          if (user?.id) {
            const response = await authService.viewProfile(user.id, countryId)
            if (response && (response.status || response.Data)) {
              const userDetail = response.Data?.userDetails?.[0] || response.Data || response.data
              const bal = userDetail?.wallet_amount ?? userDetail?.walletAmount ?? response.Data?.wallet_amount ?? response.Data?.walletAmount ?? response.Data?.walletUsage?.value ?? 0
              const updatedUser = { ...user, wallet_amount: bal.toString() }
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }
          }
        } catch (err) {
        }
      }

      syncWalletBalance()
    }
  }, [isMounted, orderId, clearCart])

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleViewOrders = (e) => {
    if (e) e.preventDefault()
    try {
      router.push('/orders')
    } catch (err) {
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/orders'
    }
  }

  const handleContinueShopping = (e) => {
    if (e) e.preventDefault()
    try {
      router.push('/')
    } catch (err) {
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  if (!isMounted) {
    return null
  }

  const renderContent = () => (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-10 sm:py-16 text-center max-w-xl mx-auto relative z-10">
      {/* Animated Hero Icon Container */}
      <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
        {/* Pulsing Outer Glow Sphere */}
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-500/20 blur-xl animate-pulse pointer-events-none" />
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-ping opacity-40 pointer-events-none" />
        
        {/* Central Success Badge Icon */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_12px_28px_rgba(16,185,129,0.4)] border-4 border-white transition-transform duration-500 hover:scale-105">
          <CheckCircle2 className="h-10 sm:h-12 w-10 sm:w-12 text-white stroke-[2.5]" />
        </div>
      </div>

      {/* Main Title & Message */}
      <div className="space-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 font-bold text-xs uppercase tracking-wider">
          Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight font-display">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-base text-fg-muted font-medium max-w-md mx-auto">
          Thank you for shopping with us! We've received your order and we're preparing it for dispatch.
        </p>
      </div>

      {/* Order Info Glass Card */}
      {orderId && (
        <div className="w-full bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-xs mb-7 relative z-10">
          <div className="flex items-center justify-between gap-3 bg-surface p-3 sm:p-3.5 rounded-xl border border-line/60">
            <div className="text-left">
              <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-wider">Order Reference ID</p>
              <p className="text-base sm:text-lg font-black text-navy tracking-wide mt-0.5">#{orderId}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-navy hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-fg-muted" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-line/50">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4 text-orange" />
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-fg-muted uppercase">Fast Delivery</p>
                <p className="text-xs font-bold text-navy">2 - 4 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-fg-muted uppercase">Payment</p>
                <p className="text-xs font-bold text-emerald-600">Verified & Confirmed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-20">
        <button
          type="button"
          onClick={handleViewOrders}
          className="flex-1 py-3.5 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange via-amber-500 to-orange text-white text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-lg shadow-orange/20 hover:shadow-xl hover:shadow-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none"
        >
          <Package className="h-4 sm:h-5 w-4 sm:w-5 pointer-events-none" strokeWidth={2.5} />
          <span className="pointer-events-none">View Orders</span>
        </button>
        <button
          type="button"
          onClick={handleContinueShopping}
          className="flex-1 py-3.5 px-6 rounded-xl sm:rounded-2xl bg-navy text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all border border-navy/20 cursor-pointer select-none"
        >
          <span className="pointer-events-none">Continue Shopping</span>
          <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 pointer-events-none" strokeWidth={2.5} />
        </button>
      </div>

      {/* Footer Assurance Badges */}
      <div className="mt-10 pt-6 border-t border-line/60 w-full flex items-center justify-center gap-6 text-xs text-fg-muted font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          100% Genuine Products
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-orange" />
          24/7 Order Support
        </span>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
        <main className="flex-1">
          {renderContent()}
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
