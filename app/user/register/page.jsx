'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  User,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe
} from 'lucide-react'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { LogoMark } from '../../../src/components/desktop/Logo'
import { authService } from '../../../src/services/authService'
import { useCountry } from '../../../src/context/CountryContext'
import { useAuth } from '../../../src/context/AuthContext'

function MobileRegisterPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { country, isLoading: isCountryLoading } = useCountry()
  const { isAuthenticated } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && pathname === '/user/register') {
      router.push('/user/dashboard')
    }
  }, [isAuthenticated, router, pathname])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const countryId = country?.id ? parseInt(country.id) : 2
      
      const response = await authService.register(
        formData.name,
        formData.phone,
        formData.email,
        countryId,
        formData.password,
        '' // Empty string for referral code
      )
      
      if (response && response.status) {
        const userData = response.data?.user || response.user || response.data || {}
        const userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || formData.phone
        const userEmail = userData.email || userData.Email || userData.mail || formData.email
        
        const isMobileVerified = (userData.is_mobile_verified == 1 || userData.mobile_verified == 1 || userData.phone_verified == 1 || userData.is_phone_verified == 1) ? 1 : 0
        const isEmailVerified = (userData.is_email_verified == 1 || userData.email_verified == 1) ? 1 : 0
        const userId = userData.id || response.userId || ''
        
        router.push(`/user/verify-otp?userId=${userId}&type=register&phone=${userPhone}&email=${userEmail}&countryId=${countryId}&country=${countryId}&mobileVerified=${isMobileVerified}&emailVerified=${isEmailVerified}`)
      } else {
        setErrors({ submit: response?.message || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 -left-24 w-60 h-60 bg-orange opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 -right-24 w-60 h-60 bg-orange-deep opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} showBack={true} backPath="/" />

      <main className="flex-1 px-4 py-6 relative z-10 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Real Logo image & Title block with tight margins */}
        <div className="text-center mb-4.5 animate-fade-in">
          <div className="flex justify-center mb-2">
            <LogoMark size={48} />
          </div>
          <h1 className="font-display text-xl font-black text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            Join us and start shopping
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full">
          <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.015)]">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-line focus:border-orange focus:ring-orange/30'
                    }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.name}</p>}
              </div>

              {/* Phone Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setFormData(prev => ({ ...prev, phone: value }))
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
                    }}
                    placeholder="Enter mobile number"
                    className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-line focus:border-orange focus:ring-orange/30'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.phone}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-line focus:border-orange focus:ring-orange/30'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`w-full rounded-xl border bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-4 focus:ring-orange/10 ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-455 hover:text-gray-655 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-[11px] font-semibold text-red-500 pl-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-xl border bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm font-medium transition-all outline-none focus:ring-white focus:ring-4 focus:ring-orange/10 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-455 hover:text-gray-655 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-500 pl-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))
                        if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }))
                      }}
                      className="peer h-4.5 w-4.5 cursor-pointer rounded border-2 border-line bg-bg text-orange focus:ring-2 focus:ring-orange/30 focus:ring-offset-0 transition-all"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-600 leading-relaxed select-none">
                    I agree to the{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange font-bold hover:underline"
                    >
                      terms and conditions
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-[10px] font-semibold text-red-500 pl-1">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg shadow-orange-500/10"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-1.5 border-t border-gray-150/45">
                <p className="text-xs font-semibold text-gray-400 mt-2.5">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/user/login')}
                    className="text-orange hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

function DesktopRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { country, isLoading: isCountryLoading } = useCountry()
  const { isAuthenticated } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && pathname === '/user/register') {
      router.push('/user/dashboard')
    }
  }, [isAuthenticated, router, pathname])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Enter a valid email address'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const countryId = country?.id ? parseInt(country.id) : 2
      
      const response = await authService.register(
        formData.name,
        formData.phone,
        formData.email,
        countryId,
        formData.password,
        '' // Empty string for referral code
      )
      
      if (response && response.status) {
        const userData = response.data?.user || response.user || response.data || {}
        const userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || formData.phone
        const userEmail = userData.email || userData.Email || userData.mail || formData.email
        
        const isMobileVerified = (userData.is_mobile_verified == 1 || userData.mobile_verified == 1 || userData.phone_verified == 1 || userData.is_phone_verified == 1) ? 1 : 0
        const isEmailVerified = (userData.is_email_verified == 1 || userData.email_verified == 1) ? 1 : 0
        const userId = userData.id || response.userId || ''
        
        router.push(`/user/verify-otp?userId=${userId}&type=register&phone=${userPhone}&email=${userEmail}&country=${countryId}&mobileVerified=${isMobileVerified}&emailVerified=${isEmailVerified}`)
      } else {
        setErrors({ submit: response?.message || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const benefits = [
    { icon: ShieldCheck, title: 'Fast & Secure Delivery', description: 'Track your orders in real-time' },
    { icon: CheckCircle2, title: '100% Secure Payments', description: 'Your data is protected' },
    { icon: TrendingUp, title: 'Exclusive Deals', description: 'Save more with member pricing' }
  ]

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between relative overflow-hidden">
      <Header />

      <main className="relative py-8 flex-1 flex items-center justify-center z-10 bg-gradient-to-br from-orange-50/10 via-bg to-orange-50/10">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-orange opacity-[0.02] blur-3xl" />
          <div className="absolute -left-40 bottom-10 h-[400px] w-[400px] rounded-full bg-orange-deep opacity-[0.02] blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl w-full px-6 flex justify-center">
          <div className="grid gap-8 lg:grid-cols-2 items-center justify-center w-full">
            {/* Left Side - Branding & Benefits (Compact max-w) */}
            <div className="flex flex-col justify-center text-left max-w-[360px] mx-auto w-full">
              <span className="text-orange text-[10px] font-extrabold uppercase tracking-widest bg-orange/10 px-2.5 py-1 rounded-full w-fit mb-3">
                Member Benefits
              </span>
              <h1 className="mb-3 font-display text-2xl font-black leading-tight text-navy tracking-tight">
                Shop Smarter with <span className="bg-gradient-to-r from-orange to-orange-deep bg-clip-text text-transparent">Jeni Deals</span>
              </h1>
              <p className="text-[12px] text-fg-muted leading-relaxed font-semibold mb-5">
                Create your account to unlock member benefits, save delivery locations, checkout quickly, and track orders.
              </p>

              {/* Benefits Grid */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10 text-orange group-hover:bg-orange group-hover:text-white transition-colors duration-200">
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-fg leading-none">{benefit.title}</h3>
                        <p className="text-[11px] text-fg-muted mt-1.5 font-medium leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Register Form (Symmetrical size with login card) */}
            <div className="flex items-center justify-center max-w-[360px] mx-auto w-full">
              <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden">
                {/* Glow inside card */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange opacity-[0.03] blur-3xl pointer-events-none" />
                
                {/* Logo Emblem & Header Text with tight margins */}
                <div className="mb-4.5 text-center relative z-10">
                  <div className="flex justify-center mb-1.5">
                    <LogoMark size={40} />
                  </div>
                  <h2 className="font-display text-lg font-black text-gray-900 tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Enter details to register</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2 relative z-10">
                  {/* Full Name Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <User className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.name
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Phone className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          setFormData(prev => ({ ...prev, phone: value }))
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
                        }}
                        placeholder="Enter mobile number"
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.phone
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Mail className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.email
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create password"
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.password
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-655 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-655 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="space-y-1">
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))
                            if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }))
                          }}
                          className="peer h-4.5 w-4.5 cursor-pointer rounded border-2 border-line bg-bg text-orange focus:ring-2 focus:ring-orange/30 focus:ring-offset-0 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 leading-relaxed select-none">
                        I agree to the{' '}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange font-bold hover:underline"
                        >
                          terms and conditions
                        </a>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-[10px] font-semibold text-red-500 pl-1">{errors.agreeToTerms}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                      {errors.submit}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  {/* Sign In Link */}
                  <div className="text-center pt-1.5 border-t border-line/30">
                    <p className="text-[10px] font-semibold text-gray-400 mt-2">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => router.push('/user/login')}
                        className="text-orange hover:underline font-bold"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function RegisterPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMounted) {
    return null
  }

  return isMobile ? <MobileRegisterPage /> : <DesktopRegisterPage />
}
