'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wallet, Loader2, ArrowUpRight, ArrowDownLeft, Package } from 'lucide-react'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { useAuth } from '../../../src/context/AuthContext'
import { useCountry } from '../../../src/context/CountryContext'
import { authService } from '../../../src/services/authService'

function WalletHistoryContent() {
  const [isMobile, setIsMobile] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user, isAuthenticated, loading: authLoading } = useAuth()
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
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/user/login')
      return
    }

    if (user?.id) {
      fetchWalletHistory()
    }
  }, [isAuthenticated, user?.id, authLoading])

  const fetchWalletHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authService.getWalletHistory(user.id)

      if (response && (response.status || response.code === 200 || response.success)) {
        const historyData = response.Data || response.data || response.walletHistory || response.history || []
        setHistory(Array.isArray(historyData) ? historyData : [])
      } else if (Array.isArray(response)) {
        setHistory(response)
      } else {
        setHistory([])
        if (response?.message) {
          setError(response.message)
        }
      }
    } catch (err) {
      setError('Failed to load wallet history')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <Loader2 className="h-9 w-9 text-orange animate-spin mb-3" />
          <p className="text-sm font-semibold text-fg-muted">Loading wallet history...</p>
        </div>
      )
    }

    if (history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-orange-tint flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-orange" />
          </div>
          <h2 className="text-lg font-bold text-fg mb-1">No Wallet History</h2>
          <p className="text-xs text-fg-muted max-w-xs">
            You don&apos;t have any wallet transactions recorded yet.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {history.map((item, index) => {
          const typeStr = String(item.type || item.transaction_type || item.status || '').toLowerCase()
          const isCredit = typeStr.includes('credit') || typeStr.includes('add') || typeStr.includes('earn') || typeStr.includes('bonus') || item.is_credit == 1 || (parseFloat(item.amount || 0) > 0 && !typeStr.includes('debit'))
          
          const amountVal = Math.abs(parseFloat(item.amount || item.points || item.value || 0))
          const formattedAmount = isCredit 
            ? `+${formatPrice(amountVal)}` 
            : `-${formatPrice(amountVal)}`
          
          const titleText = item.message || item.remark || item.title || item.description || item.comment || item.type || item.reason || 'Wallet Transaction'
          const dateText = item.created_at || item.date || item.datetime || item.time || ''
          
          const itemOrderId = item.orderId || 
                              item.order_id || 
                              item.payment_order_id || 
                              item.orderNumber || 
                              item.order_number || 
                              item.orderNo || 
                              item.order_no || 
                              null

          return (
            <div
              key={item.id || index}
              className="bg-white border border-line rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Icon Badge */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isCredit 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {isCredit ? (
                    <ArrowDownLeft className="h-5 w-5" strokeWidth={2.2} />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {titleText}
                    </h4>
                    {itemOrderId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/order-details?id=${itemOrderId}`)
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md hover:bg-green-100 transition-colors cursor-pointer"
                      >
                        <Package className="h-3 w-3 text-green-600" />
                        <span>#{itemOrderId}</span>
                      </button>
                    )}
                  </div>
                  {dateText && (
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {dateText}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0 pl-3">
                <span className={`text-base font-extrabold ${
                  isCredit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formattedAmount}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileHeader 
          onOpenMenu={() => router.push('/categories')} 
          showSearch={false} 
        />
        <main className="flex-1 px-4 py-5 pb-32">
          {/* Top Bar with Back Arrow */}
          <div className="flex items-center gap-3 mb-5">
            <button 
              onClick={() => router.back()} 
              className="p-1.5 rounded-full hover:bg-surface-2 active:scale-95 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-fg" />
            </button>
            <h1 className="font-display text-xl font-bold text-fg">Wallet History</h1>
          </div>

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
        <div className="max-w-2xl mx-auto">
          {/* Back Button & Header */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-xl bg-white border border-line hover:border-orange text-fg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-2xl font-bold text-fg">Wallet History</h1>
          </div>

          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function WalletHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <WalletHistoryContent />
    </Suspense>
  )
}
