'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, MapPin } from 'lucide-react'
import { useCountry, countries, flagUrl } from '../../src/context/CountryContext'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header as DesktopHeader, Footer as DesktopFooter } from '../../src/components/desktop'

export default function ChangeCountryPage() {
  const router = useRouter()
  const { country, setCountry, isLoading } = useCountry()
  const [menuOpen, setMenuOpen] = useState(false)
  // Initialize selectedCountry to first country if country is null (since countries array is static)
  const [selectedCountry, setSelectedCountry] = useState(country || countries[0])

  // Update selected country when the context country changes (e.g. when saved country loads)
  useEffect(() => {
    if (country) {
      setSelectedCountry(country)
    }
  }, [country])

  const handleCountrySelect = (newCountry) => {
    setSelectedCountry(newCountry)
  }

  const handleConfirm = () => {
    // Get current pathname before changing country
    const currentPath = window.location.pathname;
    
    // Check if current page is login, register, verify-otp, or forgot-password
    const authPages = ['/user/login', '/user/register', '/user/verify-otp', '/user/forgot-password'];
    const isAuthPage = authPages.some(page => currentPath.includes(page));
    
    // Change country (context will handle localStorage clear and redirect)
    setCountry(selectedCountry)
    
    // If on auth page, go back instead of redirecting
    if (isAuthPage) {
      router.back()
    }
    // Otherwise, the context will redirect to home page
  }

  const MobileUI = () => (
    <div className="md:hidden flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-3 py-3 text-white shadow-md">
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 font-display text-[15px] font-bold text-white ml-2 text-left">
          Change Country
        </h1>
        <div className="w-9" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 px-4">
        <div className="py-6">
          <div className="mb-6">
            <h2 className="text-[19px] font-bold text-fg mb-2">Select your country</h2>
            <p className="text-sm text-fg-muted">
              Choose your delivery location to see products available in your area
            </p>
          </div>

          <div className="space-y-3">
            {countries.map((ctry) => (
              <button
                key={ctry.id}
                onClick={() => handleCountrySelect(ctry)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedCountry.id === ctry.id
                    ? 'border-orange bg-orange/5'
                    : 'border-line bg-surface hover:border-orange/30'
                }`}
              >
                {/* Flag */}
                <div className="relative shrink-0">
                  <img
                    src={flagUrl(ctry.code)}
                    alt={ctry.name}
                    className="h-10 w-14 object-cover ring-1 ring-line shadow-sm"
                  />
                  {selectedCountry.id === ctry.id && (
                    <div className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-orange shadow-md">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Country Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-fg">{ctry.name}</h3>
                    <span className="text-xs font-semibold text-fg-subtle bg-surface-2 px-2 py-0.5 rounded">
                      {ctry.phoneCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-fg-muted">
                    <span>Currency: {ctry.currency}</span>
                  </div>
                </div>

                {/* Checkmark indicator */}
                {selectedCountry.id === ctry.id && (
                  <div className="shrink-0">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-orange">
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 rounded-xl border border-line bg-surface p-4">
            <h3 className="text-sm font-bold text-fg mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange" strokeWidth={2} />
              Why we need this
            </h3>
            <ul className="space-y-1.5 text-xs text-fg-muted">
              <li className="flex items-start gap-2">
                <span className="text-orange mt-0.5">•</span>
                <span>Show products available in your country</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange mt-0.5">•</span>
                <span>Display prices in your local currency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange mt-0.5">•</span>
                <span>Calculate accurate shipping and delivery times</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line px-4 py-3 pb-safe shadow-lg">
        <button
          onClick={handleConfirm}
          className="w-full rounded-lg bg-orange py-3.5 text-[15px] font-bold text-white active:bg-orange-deep transition-colors shadow"
        >
          Confirm & Continue
        </button>
      </div>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )

  const DesktopUI = () => (
    <div className="hidden md:block min-h-screen bg-bg">
      <DesktopHeader />

      <div className="mx-auto max-w-[800px] px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-fg mb-3">Select your country</h1>
          <p className="text-base text-fg-muted">
            Choose your delivery location to see products available in your area
          </p>
        </div>

        {/* Country Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {countries.map((ctry) => (
            <button
              key={ctry.id}
              onClick={() => handleCountrySelect(ctry)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                selectedCountry.id === ctry.id
                  ? 'border-orange bg-orange/5 shadow-sm'
                  : 'border-line bg-surface hover:border-orange/30 hover:shadow-sm'
              }`}
            >
              {/* Flag */}
              <div className="relative shrink-0">
                <img
                  src={flagUrl(ctry.code)}
                  alt={ctry.name}
                  className="h-10 w-14 object-cover ring-1 ring-line shadow-sm"
                />
                {selectedCountry.id === ctry.id && (
                  <div className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-orange shadow-md">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Country Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-lg font-bold text-fg">{ctry.name}</h3>
                  <span className="text-xs font-semibold text-fg-subtle bg-surface-2 px-2 py-1 rounded">
                    {ctry.phoneCode}
                  </span>
                </div>
                <div className="text-sm text-fg-muted">
                  Currency: <span className="font-semibold text-fg">{ctry.currency}</span>
                </div>
              </div>

              {/* Checkmark indicator */}
              {selectedCountry.id === ctry.id && (
                <div className="shrink-0">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-orange">
                    <Check className="h-5 w-5 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-line bg-surface p-6 mb-8">
          <h3 className="text-base font-bold text-fg mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange" strokeWidth={2} />
            Why we need this
          </h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li className="flex items-start gap-2">
              <span className="text-orange mt-0.5">•</span>
              <span>Show products available in your country</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange mt-0.5">•</span>
              <span>Display prices in your local currency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange mt-0.5">•</span>
              <span>Calculate accurate shipping and delivery times</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-lg border-2 border-line bg-surface py-3.5 text-[15px] font-bold text-fg hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-orange py-3.5 text-[15px] font-bold text-white hover:bg-orange-deep transition-colors shadow"
          >
            Confirm & Continue
          </button>
        </div>
      </div>

      <DesktopFooter />
    </div>
  )

  // Show loading state while country is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent" />
          <p className="text-sm text-fg-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <MobileUI />
      <DesktopUI />
    </>
  )
}
