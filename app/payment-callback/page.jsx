'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useCart } from '../../src/context/CartContext'

function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState('processing') // processing, success, failed, cancelled

  useEffect(() => {
    const paymentStatus = searchParams.get('status') || searchParams.get('payment_status')
    const orderId = searchParams.get('order_id') || searchParams.get('orderId')
    const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId')

    // Determine status based on URL parameters
    if (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === '1') {
      setStatus('success')

      // Clean up ordered products from cart in localStorage if specific IDs were saved
      try {
        const lastOrderedJson = sessionStorage.getItem('last_ordered_product_ids')
        if (lastOrderedJson) {
          const orderedIds = JSON.parse(lastOrderedJson).map(id => String(id))
          const savedCart = localStorage.getItem('shopping_cart')
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            const filteredCart = parsedCart.filter(item => !orderedIds.includes(String(item.id)))
            localStorage.setItem('shopping_cart', JSON.stringify(filteredCart))
          }
          sessionStorage.removeItem('last_ordered_product_ids')
        }
      } catch (err) {
      }

      // Clear cart on successful payment
      clearCart()
      sessionStorage.removeItem('buyNowItem')
      localStorage.removeItem('buyNowItem')

      // Redirect to order success page after 2 seconds
      setTimeout(() => {
        router.push(`/order-success?orderId=${orderId || ''}`)
      }, 2000)
    } else if (paymentStatus === 'failed' || paymentStatus === 'failure' || paymentStatus === '0') {
      setStatus('failed')
    } else if (paymentStatus === 'cancelled' || paymentStatus === 'cancel') {
      setStatus('cancelled')
    } else {
      // If no status parameter, assume cancelled/failed
      setStatus('cancelled')
    }
  }, [searchParams, router, clearCart])

  const handleBackToCheckout = () => {
    router.push('/checkout')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <Loader2 className="h-16 w-16 text-orange animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-fg mb-2">Processing Payment...</h2>
        <p className="text-sm text-fg-muted text-center">
          Please wait while we verify your payment
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold text-fg mb-2">Payment Successful!</h2>
        <p className="text-sm text-fg-muted text-center mb-6">
          Your order has been placed successfully. Redirecting...
        </p>
        <button
          onClick={() => router.push(`/order-success?orderId=${searchParams.get('order_id') || searchParams.get('orderId') || ''}`)}
          className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
        >
          View Order Details
        </button>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-fg mb-2">Payment Failed</h2>
        <p className="text-sm text-fg-muted text-center mb-6">
          Your payment could not be processed. Please try again or use a different payment method.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleBackToCheckout}
            className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToHome}
            className="rounded-lg bg-surface border border-line px-6 py-2.5 text-sm font-medium text-fg active:bg-surface-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (status === 'cancelled') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <XCircle className="h-16 w-16 text-fg-muted mb-4" />
        <h2 className="text-xl font-semibold text-fg mb-2">Payment Cancelled</h2>
        <p className="text-sm text-fg-muted text-center mb-6">
          You have cancelled the payment. Your order has not been placed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleBackToCheckout}
            className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
          >
            Back to Checkout
          </button>
          <button
            onClick={handleBackToHome}
            className="rounded-lg bg-surface border border-line px-6 py-2.5 text-sm font-medium text-fg active:bg-surface-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <Loader2 className="h-16 w-16 text-orange animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-fg mb-2">Loading...</h2>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
