'use client'

import { useState, useEffect } from 'react'
import { Cookie, Settings, Shield, Info } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function CookiesPolicyPage() {
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
          <Cookie className="h-3 w-3" /> Cookies & Tracking
        </span>
        <h1 className="font-display text-2xl lg:text-3xl font-black text-navy tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-1">
          Last Updated: July 2026
        </p>
      </div>

      {/* Policy Card Wrapper */}
      <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 lg:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.015)] text-left leading-relaxed text-gray-650 space-y-5 text-xs lg:text-sm">
        
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and enabling certain features.
          </p>
        </div>

        {/* 1. Types of Cookies We Use */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 1. Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-5 space-y-3 font-medium">
            <li>
              <strong className="text-navy">Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
            </li>
            <li>
              <strong className="text-navy">Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve the website&apos;s performance and user experience.
            </li>
            <li>
              <strong className="text-navy">Functional Cookies:</strong> These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personalized features.
            </li>
            <li>
              <strong className="text-navy">Targeting/Advertising Cookies:</strong> These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
            </li>
          </ul>
        </div>

        {/* 2. How We Use Cookies */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 2. How We Use Cookies
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>To Improve User Experience:</strong> We use cookies to remember your preferences and settings, making your visits more efficient and personalized.</li>
            <li><strong>To Analyze Website Traffic:</strong> We use analytics cookies to understand how users interact with our website, helping us identify areas for improvement.</li>
            <li><strong>To Enable Shopping Features:</strong> Cookies help us manage your shopping cart, process orders, and remember items you&apos;ve viewed or added to your wishlist.</li>
            <li><strong>To Deliver Relevant Advertising:</strong> We may use cookies to show you advertisements that are relevant to your interests based on your browsing behavior.</li>
          </ul>
        </div>

        {/* 3. Third-Party Cookies */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 3. Third-Party Cookies
          </h2>
          <p>
            In addition to our own cookies, we may use various third-party cookies to report usage statistics of our website and deliver advertisements. These third-party services include:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium mt-2">
            <li><strong>Google Analytics:</strong> For analyzing website traffic and user behavior.</li>
            <li><strong>Facebook Pixel:</strong> For tracking conversions and delivering targeted ads.</li>
            <li><strong>Payment Processors:</strong> For secure payment processing and fraud prevention.</li>
            <li><strong>Social Media Platforms:</strong> For enabling social sharing features and tracking engagement.</li>
          </ul>
        </div>

        {/* 4. Managing Your Cookie Preferences */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 4. Managing Your Cookie Preferences
          </h2>
          <p className="mb-2">
            You have the right to accept or reject cookies. You can manage your cookie preferences in several ways:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>
              <strong className="text-navy">Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Please note that if you disable cookies, some features of our website may not function properly.
            </li>
            <li>
              <strong className="text-navy">Cookie Consent Banner:</strong> When you first visit our website, you&apos;ll see a cookie consent banner where you can choose which types of cookies to accept.
            </li>
            <li>
              <strong className="text-navy">Opt-Out Tools:</strong> You can opt out of targeted advertising cookies by visiting industry opt-out pages such as <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-orange font-bold hover:underline">aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-orange font-bold hover:underline">youronlinechoices.com</a>.
            </li>
          </ul>
        </div>

        {/* 5. Cookie Duration */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 5. Cookie Duration
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>
              <strong className="text-navy">Session Cookies:</strong> These are temporary cookies that expire when you close your browser. They&apos;re used to maintain your session while you browse our website.
            </li>
            <li>
              <strong className="text-navy">Persistent Cookies:</strong> These cookies remain on your device for a set period (ranging from days to years) and are activated each time you visit our website. They help us remember your preferences and recognize you as a returning visitor.
            </li>
          </ul>
        </div>

        {/* 6. Updates to This Cookie Policy */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> 6. Updates to This Cookie Policy
          </h2>
          <p>
            We may update this <strong className="text-navy">Cookie Policy</strong> from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The latest version will always be available on this page with the updated date at the top.
          </p>
        </div>

        {/* Cookie Table */}
        <div>
          <h2 className="text-sm lg:text-base font-black text-navy mb-3 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-orange rounded" /> Cookie Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] lg:text-xs border border-gray-150/50">
              <thead>
                <tr className="bg-orange/5">
                  <th className="border border-gray-150/50 px-3 py-2 text-left font-black text-navy">Cookie Name</th>
                  <th className="border border-gray-150/50 px-3 py-2 text-left font-black text-navy">Type</th>
                  <th className="border border-gray-150/50 px-3 py-2 text-left font-black text-navy">Purpose</th>
                  <th className="border border-gray-150/50 px-3 py-2 text-left font-black text-navy">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-150/50 px-3 py-2 font-semibold">session_id</td>
                  <td className="border border-gray-150/50 px-3 py-2">Essential</td>
                  <td className="border border-gray-150/50 px-3 py-2">Maintains user session</td>
                  <td className="border border-gray-150/50 px-3 py-2">Session</td>
                </tr>
                <tr className="bg-gray-50/30">
                  <td className="border border-gray-150/50 px-3 py-2 font-semibold">cart_items</td>
                  <td className="border border-gray-150/50 px-3 py-2">Essential</td>
                  <td className="border border-gray-150/50 px-3 py-2">Stores shopping cart data</td>
                  <td className="border border-gray-150/50 px-3 py-2">7 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-150/50 px-3 py-2 font-semibold">user_preferences</td>
                  <td className="border border-gray-150/50 px-3 py-2">Functional</td>
                  <td className="border border-gray-150/50 px-3 py-2">Remembers language and currency settings</td>
                  <td className="border border-gray-150/50 px-3 py-2">1 year</td>
                </tr>
                <tr className="bg-gray-50/30">
                  <td className="border border-gray-150/50 px-3 py-2 font-semibold">_ga</td>
                  <td className="border border-gray-150/50 px-3 py-2">Performance</td>
                  <td className="border border-gray-150/50 px-3 py-2">Google Analytics tracking</td>
                  <td className="border border-gray-150/50 px-3 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-150/50 px-3 py-2 font-semibold">_fbp</td>
                  <td className="border border-gray-150/50 px-3 py-2">Advertising</td>
                  <td className="border border-gray-150/50 px-3 py-2">Facebook Pixel for ad targeting</td>
                  <td className="border border-gray-150/50 px-3 py-2">3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-150/45 text-center lg:text-left">
          <h3 className="text-xs lg:text-sm font-black text-navy">Questions About Cookies?</h3>
          <p className="text-[11px] text-gray-400 mt-1">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at <a href="mailto:support@jenideals.com" className="text-orange font-bold hover:underline">support@jenideals.com</a>.
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
