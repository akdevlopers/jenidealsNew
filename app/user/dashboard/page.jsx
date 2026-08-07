'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Package,
  MapPin,
  Shield,
  FileText,
  HelpCircle,
  Globe,
  ChevronRight,
  LogOut,
  Plane,
  Wallet,
  Trash2
} from 'lucide-react'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { useCountry } from '../../../src/context/CountryContext'
import { useAuth } from '../../../src/context/AuthContext'
import { authService } from '../../../src/services/authService'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmBg = 'bg-red-600 hover:bg-red-700' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Modal Box */}
      <div className="relative w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-xl border border-line transition-all duration-300 scale-100 flex flex-col text-left">
        <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
        <p className="mt-2 text-sm text-fg-muted leading-relaxed">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-bold text-fg hover:bg-gray-50 transition-colors active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-colors active:scale-95 shadow-md ${confirmBg} cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileDashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletLoading, setWalletLoading] = useState(true)
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    }
  }, [isAuthenticated, router, authLoading])

  useEffect(() => {
    async function fetchWallet() {
      if (!user?.id || !country?.id) return;
      try {
        setWalletLoading(true)
        const response = await authService.viewProfile(user.id, country.id)
        if (response?.status && response?.Data) {
          const userDetail = response.Data.userDetails?.[0]
          const bal = userDetail?.wallet_amount ?? userDetail?.walletAmount ?? response.Data.wallet_amount ?? response.Data.walletAmount ?? response.Data.walletUsage?.value ?? 0
          setWalletBalance(parseFloat(bal) || 0)
        }
      } catch (error) {
      } finally {
        setWalletLoading(false)
      }
    }

    if (isAuthenticated && user?.id) {
      fetchWallet()
    }
  }, [isAuthenticated, user?.id, country?.id])

  const accountItems = [
    {
      icon: User,
      label: 'My Profile',
      path: '/user/profile'
    },
    {
      icon: Package,
      label: 'My Orders',
      path: '/orders'
    },
    {
      icon: Plane,
      label: 'Tour Bookings',
      path: '/tour-bookings'
    },
    {
      icon: MapPin,
      label: 'My Addresses',
      path: '/addresses'
    }
  ]

  const settingsItems = [
    {
      icon: Shield,
      label: 'Privacy Policy',
      path: '/privacy-policy'
    },
    {
      icon: FileText,
      label: 'Terms & Conditions',
      path: '/terms'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      path: '/help-support'
    },
    {
      icon: Globe,
      label: 'Change Country',
      path: '/change-country'
    }
  ]

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-fg-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const userInitials = user?.name
    ? user.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} />

      <main className="flex-1 px-4 py-5 pb-32">
        {/* Page Title */}
        <h1 className="mb-4 font-display text-lg font-bold text-fg">My Dashboard</h1>

        {/* User Card */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-navy to-[#1e293b] p-5 text-white shadow-md relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-orange to-orange-deep font-display text-lg font-bold text-white shadow-md border-2 border-white/20">
              {userInitials}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-orange-ring">Member Profile</span>
              <h2 className="font-display text-base font-bold text-white truncate mt-0.5">
                {user?.name || 'Customer'}
              </h2>
              <p className="text-xs text-on-navy-muted truncate mt-0.5">
                {user?.email || user?.phone || 'No email associated'}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Quick Banner */}
        <div 
          onClick={() => router.push('/user/wallet-history')}
          className="mb-5 cursor-pointer rounded-2xl bg-gradient-to-r from-orange via-orange-deep to-[#e65100] p-4 text-white transition-all active:scale-[0.98] shadow-xs flex flex-col gap-2.5 border border-white/10"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <Wallet className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/80 leading-none">
                  Wallet Balance
                </span>
                <div className="text-base font-extrabold text-white leading-tight mt-1 truncate">
                  {walletLoading ? (
                    <span className="text-xs text-white/70 font-normal animate-pulse">Loading...</span>
                  ) : (
                    formatPrice(walletBalance ?? 0)
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-orange bg-white px-3 py-1 rounded-full shadow-2xs hover:bg-white/95 transition-colors">
              <span>View History</span>
              <ChevronRight className="h-3 w-3 text-orange" strokeWidth={2.5} />
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 text-[11.5px] font-medium text-white/90 text-left">
            Wallet feature is available on the mobile App only.
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* My Account */}
          <div>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-fg-subtle">
              My Account
            </h3>

            <div className="grid gap-2">
              {accountItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.path)}
                    className="flex w-full items-center gap-3.5 rounded-xl border border-line bg-surface p-3.5 transition-all active:scale-[0.98] text-left"
                    style={{ boxShadow: "var(--shadow-xs)" }}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
                      <Icon className="h-4.5 w-4.5 text-orange-deep" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[13.5px] font-semibold text-fg leading-none">
                        {item.label}
                      </span>
                      {item.subtitle && (
                        <span className="block text-xs font-bold text-orange mt-1">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-fg-subtle" strokeWidth={2.25} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-fg-subtle">
              Settings & Info
            </h3>

            <div className="grid gap-2">
              {settingsItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.path)}
                    className="flex w-full items-center gap-3.5 rounded-xl border border-line bg-surface p-3.5 transition-all active:scale-[0.98] text-left"
                    style={{ boxShadow: "var(--shadow-xs)" }}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
                      <Icon className="h-4.5 w-4.5 text-orange-deep" strokeWidth={2} />
                    </div>
                    <span className="flex-1 text-[13.5px] font-semibold text-fg leading-none">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-fg-subtle" strokeWidth={2.25} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100/90 hover:bg-gray-200 p-3.5 text-gray-700 transition-all active:scale-[0.98] border border-gray-200 cursor-pointer font-bold"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Logout</span>
          </button>

          {/* Delete Account Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 p-3.5 text-red-600 transition-all active:scale-[0.98] border border-red-200 cursor-pointer font-bold"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <Trash2 className="h-4 w-4 text-red-600" strokeWidth={2.5} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Delete Account</span>
          </button>
        </div>
      </main>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout()
          router.push('/')
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your Jeni Deals account?"
        confirmText="Logout"
        confirmBg="bg-gray-800 hover:bg-gray-900"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          logout()
          router.push('/')
        }}
        title="Delete Account Confirmation"
        message="Are you sure you want to delete your Jeni Deals account? This action cannot be undone and will log you out."
        confirmText="Delete Account"
        confirmBg="bg-red-600 hover:bg-red-700"
      />
    </div>
  )
}

function DesktopDashboardPage() {
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletLoading, setWalletLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    }
  }, [isAuthenticated, router, authLoading])

  useEffect(() => {
    async function fetchWallet() {
      if (!user?.id || !country?.id) return;
      try {
        setWalletLoading(true)
        const response = await authService.viewProfile(user.id, country.id)
        if (response?.status && response?.Data) {
          const userDetail = response.Data.userDetails?.[0]
          const bal = userDetail?.wallet_amount ?? userDetail?.walletAmount ?? response.Data.wallet_amount ?? response.Data.walletAmount ?? response.Data.walletUsage?.value ?? 0
          setWalletBalance(parseFloat(bal) || 0)
        }
      } catch (error) {
      } finally {
        setWalletLoading(false)
      }
    }

    if (isAuthenticated && user?.id) {
      fetchWallet()
    }
  }, [isAuthenticated, user?.id, country?.id])

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-fg-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const userInitials = user?.name
    ? user.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  // Dashboard Stats/Widgets
  const stats = [
    {
      label: "My Wallet",
      value: walletLoading ? "Loading..." : formatPrice(walletBalance ?? 0),
      icon: Wallet,
      path: "/user/wallet-history",
      color: "bg-amber-50 text-amber-600",
      action: "View history"
    },
    {
      label: "My Orders",
      value: "View history",
      icon: Package,
      path: "/orders",
      color: "bg-orange-tint text-orange-deep",
      action: "Track & manage"
    },
    {
      label: "Tour Bookings",
      value: "View bookings",
      icon: Plane,
      path: "/tour-bookings",
      color: "bg-blue-50 text-blue-600",
      action: "Your travel plans"
    },
    {
      label: "Saved Addresses",
      value: "Manage",
      icon: MapPin,
      path: "/addresses",
      color: "bg-emerald-50 text-emerald-600",
      action: "Shipping locations"
    },
    {
      label: "Country / Currency",
      value: country.name || "Select country",
      icon: Globe,
      path: "/change-country",
      color: "bg-purple-50 text-purple-600",
      action: "Switch location"
    }
  ];

  const quickLinks = [
    { icon: Wallet, label: "Wallet History", path: "/user/wallet-history" },
    { icon: User, label: "Edit Profile", path: "/user/profile" },
    { icon: Shield, label: "Privacy Policy", path: "/privacy-policy" },
    { icon: FileText, label: "Terms & Conditions", path: "/terms" },
    { icon: HelpCircle, label: "Help & Support", path: "/help-support" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="mx-auto max-w-shell px-4 py-10 md:px-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-navy via-[#1e293b] to-slate-900 px-8 py-10 text-white shadow-lg mb-8">
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-orange/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-orange to-orange-deep font-display text-2xl font-bold text-white shadow-md border-3 border-white/20">
                {userInitials}
              </div>
              <div className="text-left">
                <span className="text-xs uppercase font-bold tracking-widest text-orange-ring">Dashboard</span>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">
                  Hello, {user?.name || 'Customer'}!
                </h1>
                <p className="text-sm text-on-navy-muted mt-1">
                  {user?.email || user?.phone || 'No email associated with this account'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/user/profile')}
                className="rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-xl bg-red-500/20 border border-red-500/30 px-5 py-2.5 text-xs font-bold text-red-300 transition-all hover:bg-red-600 hover:text-white hover:border-transparent active:scale-[0.98] cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => router.push(s.path)}
                className="group flex flex-col text-left p-6 bg-white border border-line rounded-2xl transition-all hover:border-orange hover:shadow-md hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-xs)" }}
              >
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${s.color} mb-4 transition-transform group-hover:scale-105`}>
                  <Icon className="h-5.5 w-5.5" strokeWidth={2} />
                </div>
                <h3 className="text-xs font-bold text-fg-subtle uppercase tracking-wider">{s.label}</h3>
                <div className="text-lg font-bold text-navy mt-1 group-hover:text-orange transition-colors">
                  {s.value}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-fg-muted mt-auto pt-2 border-t border-gray-150/10 w-full">
                  <span>{s.action}</span>
                  <ChevronRight className="ml-auto h-3 w-3 text-fg-subtle transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Account Options & Support */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions Card */}
          <div className="lg:col-span-2 bg-white border border-line rounded-3xl p-6 text-left" style={{ boxShadow: "var(--shadow-xs)" }}>
            <h2 className="font-display text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="h-4.5 w-1 rounded bg-orange" />
              Account Settings & Utilities
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => router.push(link.path)}
                    className="group flex items-center gap-3.5 rounded-xl border border-line bg-surface p-3.5 transition-all hover:border-orange hover:bg-orange-tint/10 text-left"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-tint/60 text-orange-deep group-hover:bg-orange group-hover:text-white transition-all">
                      <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-fg leading-none">
                      {link.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Support Widget */}
          <div className="bg-white border border-line rounded-3xl p-6 flex flex-col text-left" style={{ boxShadow: "var(--shadow-xs)" }}>
            <h2 className="font-display text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <span className="h-4.5 w-1 rounded bg-orange" />
              Need Support?
            </h2>
            <p className="text-xs text-fg-muted leading-relaxed mb-6">
              Have questions about your orders, returns, or tour bookings? Our support team is online to assist you right away.
            </p>

            <div className="mt-auto space-y-3">
              <a
                href="https://wa.me/971545320252?text=Hello%20Jeni%20Deals%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
              >
                Chat on WhatsApp
              </a>
              <button
                onClick={() => router.push('/help-support')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy py-3 text-xs font-bold text-white transition-all hover:bg-orange active:scale-[0.98]"
              >
                Help Center
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout()
          router.push('/')
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your Jeni Deals account?"
        confirmText="Logout"
        confirmBg="bg-gray-800 hover:bg-gray-900"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          logout()
          router.push('/')
        }}
        title="Delete Account Confirmation"
        message="Are you sure you want to delete your Jeni Deals account? This action cannot be undone and will log you out."
        confirmText="Delete Account"
        confirmBg="bg-red-600 hover:bg-red-700"
      />
    </div>
  )
}

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return isMobile ? <MobileDashboardPage /> : <DesktopDashboardPage />
}
