'use client'

import { useState, useEffect } from 'react'
import { Truck, AlertCircle, ShieldAlert, Mail } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function ShippingPolicyPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMounted) return null

  const content = (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-6 text-left animate-fade-in">
        <span className="text-orange text-[10px] font-extrabold uppercase tracking-widest bg-orange/10 px-2.5 py-1 rounded-full w-fit mb-3 flex items-center gap-1.5">
          <Truck className="h-3 w-3" /> Delivery Services
        </span>
        <h1 className="font-display text-2xl lg:text-3xl font-black text-navy tracking-tight">
          Shipping Policy
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-1">
          Last Updated: July 2026
        </p>
      </div>

      {/* Policy Card Wrapper */}
      <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 lg:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.015)] text-left leading-relaxed text-gray-650 space-y-5 text-xs lg:text-sm">
        
        {/* Main points */}
        <div className="space-y-3">
          <div className="flex gap-3.5 items-start p-3.5 rounded-xl border border-gray-100 bg-gray-50/30">
            <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs lg:text-sm text-navy">Nationwide Shipping</h3>
              <p className="text-[11px] lg:text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                We offer nationwide shipping across India and domestic regions. Orders are typically processed and dispatched within <strong>2–3 business days</strong> from the date of purchase.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start p-3.5 rounded-xl border border-gray-100 bg-gray-50/30">
            <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs lg:text-sm text-navy">Estimated Delivery Times</h3>
              <p className="text-[11px] lg:text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                Delivery times may vary depending on your location but generally range between <strong>5–7 business days</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start p-3.5 rounded-xl border border-gray-100 bg-gray-50/30">
            <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs lg:text-sm text-navy">Shipping Fees & Estimation</h3>
              <p className="text-[11px] lg:text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                Shipping fees are automatically calculated at checkout based on your <strong>delivery location</strong> and <strong>order weight or package size</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="flex gap-3 rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 text-xs font-semibold text-amber-700 leading-relaxed">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
          <p>
            While we strive for timely delivery, please note that we are not responsible for delays caused by third-party courier or logistics partners.
          </p>
        </div>

        {/* Footer closing block */}
        <div className="pt-3 border-t border-gray-150/45 text-center lg:text-left">
          <h3 className="text-xs lg:text-sm font-black text-navy">Thank you for shopping with Jenideals!</h3>
          <p className="text-[11px] text-gray-400 mt-1">
            Your satisfaction is our absolute priority. For shipping tracking requests, please reach out to <a href="mailto:support@jenideals.com" className="text-orange font-bold hover:underline">support@jenideals.com</a>.
          </p>
        </div>

      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-10 -left-24 w-80 h-80 bg-orange opacity-[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-24 w-80 h-80 bg-orange-deep opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

      {isMobile ? (
        <>
          <MobileHeader onOpenMenu={() => setMenuOpen(true)} />
          <main className="flex-1 pb-20 z-10">
            {content}
          </main>
          <BottomNav />
          <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      ) : (
        <>
          <Header />
          <main className="flex-1 z-10 bg-gradient-to-br from-orange-50/5 via-bg to-orange-50/5">
            {content}
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
