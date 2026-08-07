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
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2
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

function MobileLoginPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginType, setLoginType] = useState('phone') // 'phone' or 'email'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { country } = useCountry()
  const { isAuthenticated, loading: authLoading, setAuthData } = useAuth()

  // Automatically set loginType based on selected country (Dubai -> Email, India/other -> Phone)
  useEffect(() => {
    if (country?.id) {
      if (String(country?.id) === '2') {
        setLoginType('email')
      } else {
        setLoginType('phone')
      }
    }
  }, [country?.id])

  useEffect(() => {
    // Optional: Could show a message that user is already logged in
  }, [isAuthenticated, authLoading, router, pathname])

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = loginType === 'phone' 
        ? 'Mobile number is required' 
        : 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const countryId = country?.id ? parseInt(country.id) : 2
      const countryName = country?.name || 'UAE'
      
      const response = await authService.login(
        formData.emailOrPhone,
        countryId,
        formData.password
      )
      
      if (response && response.status) {
        if (response.otpPage === 1) {
          // Try multiple possible keys for phone and email
          const userData = response.data?.user || response.user || response.data || {}
          // Determine if we used phone or email for login
          const loginValue = formData.emailOrPhone
          let userPhone = ''
          let userEmail = ''
          
          if (loginType === 'phone') {
            userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || loginValue
            userEmail = userData.email || userData.Email || userData.mail || ''
          } else {
            userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || ''
            userEmail = userData.email || userData.Email || userData.mail || loginValue
          }
          
          const isMobileVerified = (userData.is_mobile_verified == 1 || userData.mobile_verified == 1 || userData.phone_verified == 1 || userData.is_phone_verified == 1) ? 1 : 0
          const isEmailVerified = (userData.is_email_verified == 1 || userData.email_verified == 1) ? 1 : 0
          const userId = userData.id || response.userId || ''
          
          router.push(`/user/verify-otp?userId=${userId}&type=login&phone=${userPhone}&email=${userEmail}&countryId=${countryId}&country=${countryId}&loginType=${loginType}&mobileVerified=${isMobileVerified}&emailVerified=${isEmailVerified}`)
        } else {
          const token = response.data?.token || response.token
          const userData = response.data?.user || response.user
          
          if (token && userData) {
            if (setAuthData) {
              setAuthData(userData, token)
            } else {
              localStorage.setItem('authToken', token)
              localStorage.setItem('user', JSON.stringify(userData))
            }
            
            // Check for return URL (e.g., from checkout redirect)
            const returnUrl = sessionStorage.getItem('returnUrl')
            
            const targetUrl = returnUrl || '/user/dashboard'
            if (returnUrl) sessionStorage.removeItem('returnUrl')
            
            try {
              router.replace(targetUrl)
              setTimeout(() => {
                if (window.location.pathname === '/user/login') {
                  window.location.href = targetUrl
                }
              }, 300)
            } catch (err) {
              window.location.href = targetUrl
            }
            return
          } else {
            setErrors({ submit: response.message || 'Login successful, but user details are incomplete.' })
            setIsLoading(false)
          }
        }
      } else {
        setErrors({ submit: response?.message || 'Login failed. Please try again.' })
        setIsLoading(false)
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please check your connection and try again.' })
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const features = [
    { icon: ShieldCheck, text: 'Fast & Secure Delivery' },
    { icon: CheckCircle2, text: '100% Secure Payments' }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 -left-24 w-60 h-60 bg-orange opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 -right-24 w-60 h-60 bg-orange-deep opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} showBack={true} backPath="/" />

      <main className="flex-1 px-4 py-6 relative z-10 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Real Logo image & Title block with tiny gaps */}
        <div className="text-center mb-4.5 animate-fade-in">
          <div className="flex justify-center mb-2">
            <LogoMark size={48} />
          </div>
          <h1 className="font-display text-xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            Sign in to continue shopping
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full">
          <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.015)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Toggle Option */}
              <div className="flex gap-1 rounded-xl bg-gray-100/80 p-1">
                {String(country?.id) === '2' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginType('email')
                        setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                        setErrors({})
                      }}
                      className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        loginType === 'email'
                          ? 'bg-white text-orange shadow-sm text-orange-650'
                          : 'text-gray-400 hover:text-gray-655'
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginType('phone')
                        setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                        setErrors({})
                      }}
                      className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        loginType === 'phone'
                          ? 'bg-white text-orange shadow-sm text-orange-650'
                          : 'text-gray-400 hover:text-gray-655'
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span>Mobile</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginType('phone')
                        setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                        setErrors({})
                      }}
                      className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        loginType === 'phone'
                          ? 'bg-white text-orange shadow-sm text-orange-650'
                          : 'text-gray-400 hover:text-gray-655'
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span>Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginType('email')
                        setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                        setErrors({})
                      }}
                      className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        loginType === 'email'
                          ? 'bg-white text-orange shadow-sm text-orange-650'
                          : 'text-gray-400 hover:text-gray-655'
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span>Email</span>
                    </button>
                  </>
                )}
              </div>

              {/* Email/Phone Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    {loginType === 'phone' ? (
                      <Phone className="h-4.5 w-4.5" strokeWidth={2} />
                    ) : (
                      <Mail className="h-4.5 w-4.5" strokeWidth={2} />
                    )}
                  </div>
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    placeholder={loginType === 'phone' ? 'Enter mobile number' : 'Enter your email'}
                    className={`w-full rounded-xl border bg-gray-50/50 py-2.5 pl-10 pr-3 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-4 focus:ring-orange/10 ${
                      errors.emailOrPhone
                        ? 'border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange'
                    }`}
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-500 pl-1">{errors.emailOrPhone}</p>
                )}
              </div>

              {/* Password Input */}
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
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-4 focus:ring-orange/10 ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-655 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4.5 w-4.5" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-500 pl-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-semibold select-none pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange/30 transition-all cursor-pointer"
                  />
                  <span className="text-gray-455 hover:text-gray-655 transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/user/forgot-password')}
                  className="text-orange hover:text-orange-deep hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[11px] font-semibold text-red-655">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-3 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg shadow-orange-500/10"
              >
                {isLoading ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-1.5 border-t border-gray-150/45">
                <p className="text-xs font-semibold text-gray-400 mt-2.5">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/user/register')}
                    className="text-orange hover:underline font-bold"
                  >
                    Register here
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

function DesktopLoginPage() {
  const [loginType, setLoginType] = useState('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { country } = useCountry()
  const { isAuthenticated, loading: authLoading, setAuthData } = useAuth()

  // Automatically set loginType based on selected country (Dubai -> Email, India/other -> Phone)
  useEffect(() => {
    if (country?.id) {
      if (String(country?.id) === '2') {
        setLoginType('email')
      } else {
        setLoginType('phone')
      }
    }
  }, [country?.id])

  // Don't auto-redirect if already logged in - user might want to switch accounts
  // The handleSubmit function handles redirect after login
  useEffect(() => {
    // Optional: Could show a message that user is already logged in
  }, [isAuthenticated, authLoading, router, pathname])

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = loginType === 'phone' 
        ? 'Mobile number is required' 
        : 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const countryId = country?.id ? parseInt(country.id) : 2
      const countryName = country?.name || 'UAE'
      
      const response = await authService.login(
        formData.emailOrPhone,
        countryId,
        formData.password
      )
      
      if (response && response.status) {
        if (response.otpPage === 1) {
          // Try multiple possible keys for phone and email
          const userData = response.data?.user || response.user || response.data || {}
          // Determine if we used phone or email for login
          const loginValue = formData.emailOrPhone
          let userPhone = ''
          let userEmail = ''
          
          if (loginType === 'phone') {
            userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || loginValue
            userEmail = userData.email || userData.Email || userData.mail || ''
          } else {
            userPhone = userData.phone || userData.Phone || userData.mobile || userData.Mobile || userData.phone_number || ''
            userEmail = userData.email || userData.Email || userData.mail || loginValue
          }
          
          const isMobileVerified = (userData.is_mobile_verified == 1 || userData.mobile_verified == 1 || userData.phone_verified == 1 || userData.is_phone_verified == 1) ? 1 : 0
          const isEmailVerified = (userData.is_email_verified == 1 || userData.email_verified == 1) ? 1 : 0
          const userId = userData.id || response.userId || ''
          
          router.push(`/user/verify-otp?userId=${userId}&type=login&phone=${userPhone}&email=${userEmail}&countryId=${countryId}&country=${countryId}&loginType=${loginType}&mobileVerified=${isMobileVerified}&emailVerified=${isEmailVerified}`)
        } else {
          const token = response.data?.token || response.token
          const userData = response.data?.user || response.user
          
          if (token && userData) {
            if (setAuthData) {
              setAuthData(userData, token)
            } else {
              localStorage.setItem('authToken', token)
              localStorage.setItem('user', JSON.stringify(userData))
            }
            
            // Check for return URL (e.g., from checkout redirect)
            const returnUrl = sessionStorage.getItem('returnUrl')
            
            const targetUrl = returnUrl || '/user/dashboard'
            if (returnUrl) sessionStorage.removeItem('returnUrl')
            
            try {
              router.replace(targetUrl)
              setTimeout(() => {
                if (window.location.pathname === '/user/login') {
                  window.location.href = targetUrl
                }
              }, 300)
            } catch (err) {
              window.location.href = targetUrl
            }
            return
          } else {
            setErrors({ submit: response.message || 'Login successful, but user details are incomplete.' })
            setIsLoading(false)
          }
        }
      } else {
        setErrors({ submit: response?.message || 'Login failed. Please try again.' })
        setIsLoading(false)
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please check your connection and try again.' })
      setIsLoading(false)
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
    {
      icon: ShieldCheck,
      title: 'Fast & Secure Delivery',
      description: 'Track your orders in real-time'
    },
    {
      icon: CheckCircle2,
      title: '100% Secure Payments',
      description: 'Your data is protected'
    },
    {
      icon: TrendingUp,
      title: 'Exclusive Deals',
      description: 'Save more with member pricing'
    }
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
                Sign in to access exclusive deals, recommendations, and track your orders.
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
                        <p className="text-[11px] text-fg-muted mt-1 font-medium leading-normal">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Login Form (Smaller card) */}
            <div className="flex items-center justify-center max-w-[360px] mx-auto w-full">
              <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange opacity-[0.03] blur-3xl pointer-events-none" />
                
                <div className="mb-4.5 text-center relative z-10">
                  {/* Real Logo image, no background, tight margin */}
                  <div className="flex justify-center mb-1.5">
                    <LogoMark size={40} />
                  </div>
                  <h2 className="font-display text-lg font-black text-gray-900 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Enter details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
                  {/* Toggle Option */}
                  <div className="flex gap-1 rounded-xl bg-bg p-1 border border-line/45">
                    {String(country?.id) === '2' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginType('email')
                            setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                            setErrors({})
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                            loginType === 'email'
                              ? 'bg-surface text-orange shadow-sm text-orange-650'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginType('phone')
                            setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                            setErrors({})
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                            loginType === 'phone'
                              ? 'bg-surface text-orange shadow-sm text-orange-650'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Mobile</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginType('phone')
                            setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                            setErrors({})
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                            loginType === 'phone'
                              ? 'bg-surface text-orange shadow-sm text-orange-650'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Mobile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginType('email')
                            setFormData(prev => ({ ...prev, emailOrPhone: '' }))
                            setErrors({})
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                            loginType === 'email'
                              ? 'bg-surface text-orange shadow-sm text-orange-650'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>Email</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Email/Phone Input */}
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        {loginType === 'phone' ? (
                          <Phone className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Mail className="h-4 w-4" strokeWidth={2} />
                        )}
                      </div>
                      <input
                        type="text"
                        id="emailOrPhone"
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleInputChange}
                        placeholder={loginType === 'phone' ? 'Enter mobile number' : 'Enter your email'}
                        className={`w-full rounded-xl border bg-bg py-2 pl-9 pr-3 text-xs font-medium transition-all outline-none focus:ring-1 ${
                          errors.emailOrPhone
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-line focus:border-orange focus:ring-orange/30'
                        }`}
                      />
                    </div>
                    {errors.emailOrPhone && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500 pl-1">{errors.emailOrPhone}</p>
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
                        placeholder="Enter your password"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-[11px] font-semibold select-none pt-0.5">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-line text-orange focus:ring-orange/30 transition-all cursor-pointer"
                      />
                      <span className="text-gray-400 hover:text-gray-655 transition-colors">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push('/user/forgot-password')}
                      className="text-orange hover:text-orange-deep hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
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
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  {/* Register Link */}
                  <div className="text-center pt-1 border-t border-line/30">
                    <p className="text-[11px] font-semibold text-gray-400 mt-2">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => router.push('/user/register')}
                        className="text-orange hover:underline font-bold"
                      >
                        Register here
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

export default function LoginPage() {
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

  return isMobile ? <MobileLoginPage /> : <DesktopLoginPage />
}
