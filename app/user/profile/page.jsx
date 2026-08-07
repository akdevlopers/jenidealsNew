'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Wallet, 
  ArrowLeft,
  Loader2,
  Edit2,
  Save,
  X,
  Package,
  LogOut
} from 'lucide-react'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { useCountry } from '../../../src/context/CountryContext'
import { useAuth } from '../../../src/context/AuthContext'
import { authService } from '../../../src/services/authService'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
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
            className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-bold text-fg hover:bg-gray-50 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors active:scale-95 shadow-md shadow-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileProfilePage() {
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, updateUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user) {
      fetchProfile()
    }
  }, [isAuthenticated, user, router, authLoading])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const countryIdToUse = user?.country || country?.id || '2'
      const response = await authService.viewProfile(user.id, countryIdToUse)
      
      const rawUserDetail = (response?.status && Array.isArray(response?.Data?.userDetails) && response.Data.userDetails.length > 0)
        ? response.Data.userDetails[0]
        : null

      const mergedProfile = {
        ...user,
        ...(rawUserDetail || {}),
        name: rawUserDetail?.name || user?.name || '',
        email: rawUserDetail?.email || user?.email || '',
        phone: rawUserDetail?.phone || user?.phone || '',
        wallet_amount: rawUserDetail?.wallet_amount ?? rawUserDetail?.walletAmount ?? response?.Data?.walletUsage?.value ?? 0
      }

      setProfile(mergedProfile)
      setFormData({
        name: mergedProfile.name,
        email: mergedProfile.email,
        phone: mergedProfile.phone
      })
    } catch (error) {
      if (user) {
        setProfile(user)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setFormData({
      name: profile?.name || user?.name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || user?.phone || ''
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Email or phone is required')
      return
    }

    try {
      setIsSaving(true)
      setError('')
      
      const response = await authService.updateProfile(
        user.id,
        formData.name,
        formData.email,
        formData.phone,
        country.id
      )

      if (response.status) {
        setProfile({
          ...profile,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        setIsEditing(false)
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred while updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading profile...</p>
      </div>
    )
  }

  const userInitials = user?.name 
    ? user.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      
      <main className="flex-1 px-4 py-5 pb-32">
        {/* Header with back button and edit button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/user/dashboard')} className="p-1">
              <ArrowLeft className="h-5 w-5 text-fg" />
            </button>
            <h1 className="font-display text-lg font-bold text-fg">My Profile</h1>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 rounded-xl bg-orange px-4 py-2 text-xs font-bold text-white active:scale-95 transition-all shadow-md shadow-orange/10"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-xs font-semibold text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Card Banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-navy to-[#1e293b] p-5 text-white shadow-md relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-orange to-orange-deep font-display text-lg font-bold text-white shadow-md border-2 border-white/20">
              {userInitials}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-orange-ring">Member Profile</span>
              {isEditing ? (
                <div className="mt-1.5">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white placeholder-white/40 focus:bg-white/20 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-display text-base font-bold text-white truncate mt-0.5">
                    {profile?.name || user?.name || 'Customer'}
                  </h2>
                  <p className="text-xs text-on-navy-muted truncate mt-0.5">
                    {profile?.email || user?.email || 'No email associated'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left shadow-xs">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
              <Mail className="h-4.5 w-4.5 text-orange-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider">Email Address</span>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-line bg-bg px-3 py-2 text-sm font-semibold text-fg focus:border-orange focus:outline-none"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-[13.5px] font-semibold text-fg truncate mt-0.5">
                  {profile?.email || user?.email || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left shadow-xs">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
              <Phone className="h-4.5 w-4.5 text-orange-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider">Phone Number</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-line bg-bg px-3 py-2 text-sm font-semibold text-fg focus:border-orange focus:outline-none"
                  placeholder="Enter your phone"
                />
              ) : (
                <p className="text-[13.5px] font-semibold text-fg mt-0.5">
                  {profile?.phone || user?.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {(profile?.city || profile?.state || profile?.pincode) && (
            <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left shadow-xs">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
                <MapPin className="h-4.5 w-4.5 text-orange-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider">Location</span>
                <p className="text-[13.5px] font-semibold text-fg truncate mt-0.5">
                  {[profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left shadow-xs">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10">
              <Wallet className="h-4.5 w-4.5 text-orange-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider">Wallet Balance</span>
              <p className="text-[15px] font-bold text-orange mt-0.5">
                {formatPrice(parseFloat(profile?.wallet_amount ?? profile?.walletAmount ?? profile?.wallet_balance ?? 0) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-xs font-bold text-fg active:scale-95 transition-all shadow-xs"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange py-3 text-xs font-bold text-white active:scale-95 transition-all shadow-md shadow-orange/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

function DesktopProfilePage() {
  const router = useRouter()
  const { country, price: formatPrice } = useCountry()
  const { isAuthenticated, user, logout, updateUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user) {
      fetchProfile()
    }
  }, [isAuthenticated, user, router, authLoading])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const countryIdToUse = user?.country || country?.id || '2'
      const response = await authService.viewProfile(user.id, countryIdToUse)
      
      const rawUserDetail = (response?.status && Array.isArray(response?.Data?.userDetails) && response.Data.userDetails.length > 0)
        ? response.Data.userDetails[0]
        : null

      const mergedProfile = {
        ...user,
        ...(rawUserDetail || {}),
        name: rawUserDetail?.name || user?.name || '',
        email: rawUserDetail?.email || user?.email || '',
        phone: rawUserDetail?.phone || user?.phone || '',
        wallet_amount: rawUserDetail?.wallet_amount ?? rawUserDetail?.walletAmount ?? response?.Data?.walletUsage?.value ?? 0
      }

      setProfile(mergedProfile)
      setFormData({
        name: mergedProfile.name,
        email: mergedProfile.email,
        phone: mergedProfile.phone
      })
    } catch (error) {
      if (user) {
        setProfile(user)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setFormData({
      name: profile?.name || user?.name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || user?.phone || ''
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Email or phone is required')
      return
    }

    try {
      setIsSaving(true)
      setError('')
      
      const response = await authService.updateProfile(
        user.id,
        formData.name,
        formData.email,
        formData.phone,
        country.id
      )

      if (response.status) {
        setProfile({
          ...profile,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        setIsEditing(false)
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred while updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 text-orange animate-spin" />
        <p className="text-sm text-fg-muted mt-2">Loading profile...</p>
      </div>
    )
  }

  const userInitials = user?.name 
    ? user.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="mx-auto max-w-shell px-4 py-10 md:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button onClick={() => router.push('/user/dashboard')} className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-line bg-white shadow-xs">
              <ArrowLeft className="h-5 w-5 text-fg" />
            </button>
            <div className="text-left">
              <h1 className="font-display text-2xl font-bold text-fg">Account Settings</h1>
              <p className="text-xs text-fg-muted mt-0.5">Manage your personal information and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Summary and Navigation Menu */}
          <div className="space-y-6 lg:col-span-1 text-left">
            {/* Quick Profile Summary Card */}
            <div className="rounded-2xl border border-line bg-gradient-to-br from-navy to-[#1e293b] p-6 text-white shadow-md relative overflow-hidden text-center">
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-orange/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-orange to-orange-deep font-display text-2xl font-bold text-white shadow-md border-3 border-white/20 mx-auto mb-3">
                {userInitials}
              </div>
              <h2 className="font-display text-lg font-bold text-white truncate">
                {profile?.name || user?.name || 'Customer'}
              </h2>
              <p className="text-xs text-on-navy-muted mt-0.5 truncate">
                {profile?.email || user?.email || 'No email associated'}
              </p>
              
              {/* Wallet info */}
              <div className="mt-5 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-navy-muted">Wallet Balance</span>
                <div className="text-xl font-bold text-orange mt-0.5">
                  {formatPrice(parseFloat(profile?.wallet_amount ?? profile?.walletAmount ?? profile?.wallet_balance ?? 0) || 0)}
                </div>
              </div>
            </div>

            {/* Quick Navigation Menu */}
            <div className="rounded-2xl border border-line bg-white p-4 shadow-xs space-y-1">
              <button 
                onClick={() => router.push('/user/dashboard')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-fg-muted hover:text-navy hover:bg-gray-50 transition-colors text-left"
              >
                <User className="h-4.5 w-4.5" />
                Go to Dashboard
              </button>
              <button 
                onClick={() => router.push('/orders')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-fg-muted hover:text-navy hover:bg-gray-50 transition-colors text-left"
              >
                <Package className="h-4.5 w-4.5" />
                My Orders
              </button>
              <button 
                onClick={() => router.push('/addresses')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-fg-muted hover:text-navy hover:bg-gray-50 transition-colors text-left"
              >
                <MapPin className="h-4.5 w-4.5" />
                My Addresses
              </button>
              <div className="h-px bg-line my-2" />
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout Account
              </button>
            </div>
          </div>

          {/* Right Column: Information Forms */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-line bg-white p-8 shadow-xs relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-line pb-5 mb-6 text-left">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">Personal Details</h2>
                  <p className="text-xs text-fg-subtle mt-0.5">View and update your main contact details</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-navy hover:border-orange hover:text-orange transition-all active:scale-[0.98]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Modify info
                  </button>
                )}
              </div>

              {/* Form Content */}
              <div className="space-y-6 text-left">
                {/* Error Banner */}
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-xs font-semibold text-red-600">{error}</p>
                  </div>
                )}

                {/* Grid Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Name field */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider mb-2">Full Name</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full max-w-lg rounded-xl border border-line bg-bg px-4 py-2.5 text-sm font-semibold text-fg focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                          placeholder="Your display name"
                        />
                        <p className="text-[10px] text-fg-subtle mt-1.5">This name will be displayed on invoices and order receipts</p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-fg bg-gray-50/50 rounded-xl px-4 py-3 border border-line/30">{profile?.name || user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email address field */}
                  <div>
                    <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm font-semibold text-fg focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="yourname@domain.com"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-fg bg-gray-50/50 rounded-xl px-4 py-3 border border-line/30">{profile?.email || user?.email || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Phone number field */}
                  <div>
                    <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm font-semibold text-fg focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="Your contact number"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-fg bg-gray-50/50 rounded-xl px-4 py-3 border border-line/30">{profile?.phone || user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Wallet Balance field */}
                  <div>
                    <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider mb-2">Wallet Balance</label>
                    <div className="flex items-center gap-3.5 bg-amber-50/60 rounded-xl px-4 py-2.5 border border-amber-200/60">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange text-white shadow-xs">
                        <Wallet className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider block">Available Credit</span>
                        <span className="text-base font-bold text-navy">
                          {formatPrice(parseFloat(profile?.wallet_amount ?? profile?.walletAmount ?? profile?.wallet_balance ?? 0) || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location field */}
                  {(profile?.city || profile?.state || profile?.pincode) ? (
                    <div>
                      <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider mb-2 font-display">Primary Location</label>
                      <p className="text-sm font-semibold text-fg bg-gray-50/50 rounded-xl px-4 py-3 border border-line/30">
                        {[profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Edit Form Actions */}
                {isEditing && (
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-line">
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-2.5 text-xs font-bold text-fg hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-md shadow-orange/10"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
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
      />
    </div>
  );
}

export default function ProfilePage() {
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

  return isMobile ? <MobileProfilePage /> : <DesktopProfilePage />
}
