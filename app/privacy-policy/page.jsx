'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Mail, AlertCircle, Lock } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="h-3 w-3" /> Security & Privacy
        </span>
        <h1 className="font-display text-2xl lg:text-3xl font-black text-navy tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-1">
          Last Updated: July 2026
        </p>
      </div>

      {/* Policy Card Wrapper */}
      <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 lg:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.015)] text-left leading-relaxed text-gray-650 space-y-5 text-xs lg:text-sm">
        
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> General
          </h2>
          <p>
            This website is owned and operated by <strong className="text-navy">Jenideals</strong>. We take the privacy of our visitors and customers seriously and have outlined how we collect, store, and utilize your information below.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>Personal Information:</strong> We collect details such as your name, email address, shipping address, phone number, and payment information when you make a purchase, create an account, or contact us.</li>
            <li><strong>Non-Personal Information:</strong> We may collect non-personal data such as browser type, operating system, and browsing behavior to improve our website and services.</li>
          </ul>
        </div>

        {/* 2. How We Use Your Information */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>To Process Orders:</strong> We use your personal information to process and fulfill your orders efficiently.</li>
            <li><strong>To Communicate:</strong> We use your contact details to send order updates, respond to inquiries, and share promotional materials (if you’ve opted in).</li>
            <li><strong>To Improve Our Services:</strong> We analyze non-personal data to enhance user experience and website performance.</li>
          </ul>
        </div>

        {/* 3. Information Sharing */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 3. Information Sharing
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>Third-Party Service Providers:</strong> We may share your information with trusted service providers who assist in payment processing, order delivery, and website maintenance.</li>
            <li><strong>Legal Requirements:</strong> Your data may be disclosed when required by law or necessary to protect our legal rights.</li>
          </ul>
        </div>

        {/* 4. Data Security */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 4. Data Security
          </h2>
          <p>
            We implement <strong className="text-navy">robust security measures</strong> (such as SSL encryption and firewall protection) to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        {/* 5. Your Rights */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 5. Your Rights
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>Access and Correction:</strong> You can review and update your personal information anytime via your account settings.</li>
            <li><strong>Opt-Out:</strong> You can unsubscribe from promotional emails using the “Unsubscribe” link in our emails.</li>
          </ul>
        </div>

        {/* 6. Changes to This Policy */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 6. Changes to This Policy
          </h2>
          <p>
            We may update this <strong className="text-navy">Privacy Policy</strong> periodically. All updates will appear on this page, with the revised date indicated at the top.
          </p>
        </div>

        <div className="pt-3 border-t border-gray-150/45 text-center lg:text-left">
          <h3 className="text-xs lg:text-sm font-black text-navy">Privacy Concerns?</h3>
          <p className="text-[11px] text-gray-400 mt-1">
            For questions regarding our Privacy Policy or data storage practices, please write to us at <a href="mailto:customersupport@jenideals.com" className="text-orange font-bold hover:underline">customersupport@jenideals.com</a>.
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
