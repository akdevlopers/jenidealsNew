'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, AlertCircle, Mail, CheckCircle2 } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function RefundPolicyPage() {
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
          <RotateCcw className="h-3 w-3" /> Returns & Exchanges
        </span>
        <h1 className="font-display text-2xl lg:text-3xl font-black text-navy tracking-tight">
          Return & Refund Policy
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-1">
          Last Updated: July 2026
        </p>
      </div>

      {/* Policy Card Wrapper */}
      <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 lg:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.015)] text-left leading-relaxed text-gray-650 space-y-5 text-xs lg:text-sm">
        
        {/* Intro */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> Customer Protection
          </h2>
          <p>
            At <strong className="text-navy">Jenideals</strong>, we strive to ensure that you are completely satisfied with your purchase. Please read our return and refund policy carefully before placing your order.
          </p>
        </div>

        {/* 1. Returns & Replacements */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 1. Returns & Replacements
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>Products can be returned or replaced only in case of a <strong className="text-orange-deep">damaged, defective, or incorrect</strong> item delivered.</li>
            <li>If you receive a damaged or wrong product, please contact us within <strong className="text-navy">48 hours of delivery</strong> with clear photos or videos of the issue.</li>
            <li>Upon verification, we will arrange a replacement for the item.</li>
            <li>Replaced products will be delivered within <strong className="text-navy">5–7 working days</strong> after approval of the replacement request.</li>
          </ul>
        </div>

        {/* 2. No Refunds for Change of Mind */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 2. No Refunds for Change of Mind
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>We do not offer refunds or exchanges for orders due to change of mind, incorrect selection, or personal preference.</li>
            <li>Refunds are applicable only in cases where the ordered item is <strong className="text-orange-deep">out of stock</strong> or cannot be replaced due to unforeseen circumstances.</li>
            <li>Once a refund is approved, the amount will be credited to the original payment method within <strong className="text-navy">5–7 business days</strong>.</li>
          </ul>
        </div>

        {/* 3. Conditions for Replacement */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 3. Conditions for Replacement
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>Items must be returned in their <strong className="text-navy">original packaging</strong>, unused, and with all tags intact.</li>
            <li>The product must be sent back through a trackable courier service as advised by our support team.</li>
          </ul>
        </div>

        {/* 4. How to Request a Replacement */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 4. How to Request a Replacement
          </h2>
          <ol className="list-decimal pl-5 space-y-2 font-medium">
            <li>Email us at <a href="mailto:support@jenideals.com" className="text-orange hover:underline font-bold">support@jenideals.com</a>.</li>
            <li>Include your <strong className="text-navy">order ID</strong>, a brief description of the issue, and photo/video proof of the defect or damage.</li>
            <li>Our support team will review your submission and guide you on the next steps.</li>
          </ol>
        </div>

        {/* Support Alert Area */}
        <div className="pt-3 border-t border-gray-150/45 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <h3 className="text-xs lg:text-sm font-black text-navy">Have any questions?</h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Contact our support team at <a href="mailto:customersupport@jenideals.com" className="text-orange font-bold hover:underline">customersupport@jenideals.com</a>.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="mailto:customersupport@jenideals.com"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange text-white font-bold text-xs hover:bg-orange-deep transition-all shadow-md shadow-orange-500/10 active:scale-95"
            >
              <Mail className="h-3.5 w-3.5" /> Email Support
            </a>
          </div>
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
