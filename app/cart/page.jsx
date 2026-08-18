'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Trash2, Package } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useCart } from '../../src/context/CartContext'
import { useCountry } from '../../src/context/CountryContext'
import { useAuth } from '../../src/context/AuthContext'

function CartContent() {
  const [isMobile, setIsMobile] = useState(false)
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const { price: formatPrice } = useCountry()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShoppingCart className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-fg mb-2">Your cart is empty!</h2>
      <p className="text-sm text-fg-muted mb-6">Add some products to get started.</p>
      <button
        onClick={() => router.push('/')}
        className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
      >
        Browse Products
      </button>
    </div>
  )

  const renderCartItemMobile = (item) => {
    const price = parseFloat(item.offer_price || item.price || 0)
    const totalPrice = price * item.quantity
    const targetProductId = item.product_id || item.id
    const itemKey = `${item.id}_${item.attribute_id || ''}`

    return (
      <div key={itemKey} className="flex gap-3 p-3 bg-surface rounded-lg border border-line mb-3">
        <div
          onClick={() => router.push(`/product/${targetProductId}`)}
          className="relative w-24 h-24 bg-[#FAF5FF] rounded flex-shrink-0 cursor-pointer overflow-hidden flex items-center justify-center p-1.5"
        >
          {item.product_img_url ? (
            <img
              src={item.product_img_url}
              alt={item.product_name}
              className="h-full w-full object-contain rounded"
            />
          ) : (
            <div className="grid place-items-center">
              <Package className="h-8 w-8 text-fg-subtle" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4
              onClick={() => router.push(`/product/${targetProductId}`)}
              className="text-sm font-medium text-fg line-clamp-2 cursor-pointer hover:text-orange transition-colors"
            >
              {item.product_name}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-xs text-fg-muted">{item.store_name || item.brand || 'Jeni Deals'}</span>
              {item.selected_attribute && typeof item.selected_attribute === 'object' && (
                Object.entries(item.selected_attribute).map(([k, v]) => (
                  <span key={k} className="inline-block text-[10.5px] font-bold bg-orange-tint/40 text-orange-deep px-1.5 py-0.5 rounded border border-orange/20">
                    {k}: {v}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-sm font-bold text-fg">{formatPrice(totalPrice)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1, item.attribute_id)}
                className="h-7 w-7 grid place-items-center rounded bg-surface-2 text-fg active:bg-line"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <span className="text-sm font-medium text-fg w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1, item.attribute_id)}
                className="h-7 w-7 grid place-items-center rounded bg-navy text-white active:bg-orange-deep"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => removeFromCart(item.id, item.attribute_id)}
                className="h-7 w-7 grid place-items-center rounded text-fg-muted hover:text-sale"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCartItemDesktop = (item) => {
    const price = parseFloat(item.offer_price || item.price || 0)
    const totalPrice = price * item.quantity
    const targetProductId = item.product_id || item.id
    const itemKey = `${item.id}_${item.attribute_id || ''}`

    return (
      <div key={itemKey} className="flex items-center gap-5 p-4 bg-surface rounded-xl border border-line mb-3.5 shadow-2xs hover:border-line/80 transition-all">
        <div
          onClick={() => router.push(`/product/${targetProductId}`)}
          className="relative w-24 h-24 bg-[#FAF5FF] rounded-lg flex-shrink-0 cursor-pointer overflow-hidden flex items-center justify-center p-2 border border-line/40"
        >
          {item.product_img_url ? (
            <img
              src={item.product_img_url}
              alt={item.product_name}
              className="h-full w-full object-contain rounded hover:scale-105 transition-transform"
            />
          ) : (
            <div className="grid place-items-center">
              <Package className="h-8 w-8 text-fg-subtle" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <h4
            onClick={() => router.push(`/product/${targetProductId}`)}
            title={item.product_name}
            className="text-[15px] font-semibold text-fg line-clamp-2 cursor-pointer hover:text-orange transition-colors leading-snug"
          >
            {item.product_name}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs text-fg-muted">{item.store_name || item.brand || 'Jeni Deals'}</span>
            {item.selected_attribute && typeof item.selected_attribute === 'object' && (
              Object.entries(item.selected_attribute).map(([k, v]) => (
                <span key={k} className="inline-flex items-center text-[11px] font-bold bg-orange-tint/40 text-orange-deep px-2 py-0.5 rounded-md border border-orange/20">
                  {k}: {v}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="text-sm font-bold text-fg flex-shrink-0 text-right min-w-[85px]">{formatPrice(price)}</div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1, item.attribute_id)}
            className="h-8 w-8 grid place-items-center rounded-lg bg-surface-2 text-fg hover:bg-line transition-colors active:scale-95"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <span className="text-sm font-bold text-fg w-7 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.attribute_id)}
            className="h-8 w-8 grid place-items-center rounded-lg bg-navy text-white hover:bg-orange-deep transition-colors active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="text-base font-bold text-fg flex-shrink-0 text-right min-w-[100px]">{formatPrice(totalPrice)}</div>
        <button
          onClick={() => removeFromCart(item.id, item.attribute_id)}
          className="h-8 w-8 grid place-items-center rounded-lg text-fg-muted hover:text-sale hover:bg-sale/10 transition-colors flex-shrink-0 active:scale-95"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    )
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-orange" />
              <h1 className="text-2xl font-bold text-fg">Shopping Cart</h1>
              {cart.length > 0 && (
                <span className="text-sm text-fg-muted">({cart.length} items)</span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-fg-muted hover:text-sale"
              >
                Clear Cart
              </button>
            )}
          </div>
          {cart.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {cart.map(renderCartItemDesktop)}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-surface border border-line rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-bold text-fg mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-fg">
                      <span>Subtotal</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="border-t border-line pt-3 flex justify-between text-base font-bold text-fg">
                      <span>Total</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push('/user/login')
                      } else {
                        router.push('/checkout')
                      }
                    }}
                    className="w-full rounded-lg bg-orange px-6 py-3 text-sm font-bold text-white hover:bg-orange-deep transition-colors"
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login To Checkout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      <main className="flex-1 px-4 py-6 pb-32">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange" />
            <h1 className="text-lg font-bold text-fg">Shopping Cart</h1>
            {cart.length > 0 && (
              <span className="text-xs text-fg-muted">({cart.length})</span>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-fg-muted hover:text-sale"
            >
              Clear Cart
            </button>
          )}
        </div>
        {cart.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {cart.map(renderCartItemMobile)}
            <div className="mt-6 bg-surface border border-line rounded-lg p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-fg">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="border-t border-line pt-2 flex justify-between text-base font-bold text-fg">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/user/login')
                  } else {
                    router.push('/checkout')
                  }
                }}
                className="w-full rounded-lg bg-orange px-6 py-3 text-sm font-bold text-white active:bg-orange-deep"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login To Checkout'}
              </button>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <CartContent />
    </Suspense>
  )
}
