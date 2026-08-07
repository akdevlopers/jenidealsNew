'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../src/context/AuthContext'
import { 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Globe, 
  Store, 
  ChevronRight 
} from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { LogoMark } from '../../src/components/desktop/Logo'

export default function AccountPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/user/dashboard')
    }
  }, [isAuthenticated, router])

  const settingsSupportItems = [
    { 
      icon: ShieldCheck, 
      label: 'Privacy Policy', 
      onClick: () => router.push('/privacy-policy') 
    },
    { 
      icon: FileText, 
      label: 'Terms & Conditions', 
      onClick: () => router.push('/terms') 
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      onClick: () => router.push('/help-support') 
    },
    { 
      icon: Globe, 
      label: 'Change Country', 
      onClick: () => router.push('/change-country') 
    },
  ]

  const vendorHubItems = [
    { 
      icon: Store, 
      label: 'Vendor Login', 
      onClick: () => {
        window.location.href = 'https://jenideals.com/vendor/login'
      } 
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={() => router.push('/categories')} showSearch={false} />

      <main className="flex-1 px-4 py-5 pb-24 max-w-lg mx-auto w-full">
        {/* Page Title */}
        <h1 className="font-display text-xl font-bold text-navy mb-4 px-1">
          My Account
        </h1>

        {/* Top Banner Card */}
        <div className="bg-surface rounded-2xl p-5 border border-line/60 shadow-xs flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full border border-orange/20 bg-orange/5 p-1 flex items-center justify-center shrink-0">
            <LogoMark size={52} />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <h2 className="font-display text-[17px] font-bold text-navy leading-tight mb-2">
              Welcome Guest
            </h2>
            <button
              type="button"
              onClick={() => router.push('/user/login')}
              className="bg-orange hover:bg-orange-deep text-white text-xs font-bold px-5 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Login / Register
            </button>
          </div>
        </div>

        {/* Section 1: Settings & Support */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
            Settings & Support
          </h3>
          <div className="bg-surface rounded-2xl border border-line/60 shadow-xs overflow-hidden">
            {settingsSupportItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  type="button"
                  onClick={item.onClick}
                  className={`flex items-center gap-3.5 w-full px-4 py-3.5 text-left active:bg-surface-2 transition-colors cursor-pointer ${
                    index < settingsSupportItems.length - 1 ? 'border-b border-line/50' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </div>
                  <span className="flex-1 text-[13.5px] font-bold text-navy">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={2} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Vendor Hub */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
            Vendor Hub
          </h3>
          <div className="bg-surface rounded-2xl border border-line/60 shadow-xs overflow-hidden">
            {vendorHubItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  type="button"
                  onClick={item.onClick}
                  className={`flex items-center gap-3.5 w-full px-4 py-3.5 text-left active:bg-surface-2 transition-colors cursor-pointer ${
                    index < vendorHubItems.length - 1 ? 'border-b border-line/50' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </div>
                  <span className="flex-1 text-[13.5px] font-bold text-navy">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={2} />
                </button>
              )
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
