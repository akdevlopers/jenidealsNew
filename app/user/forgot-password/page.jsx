'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { authService } from '../../../src/services/authService'
import { getCountryId } from '../../../src/utils/countryHelper'
import { useCountry } from '../../../src/context/CountryContext'

function MobileForgotPasswordPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [forgotType, setForgotType] = useState('phone')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { country } = useCountry()

  useEffect(() => {
    if (country?.id) {
      if (String(country.id) === '2') {
        setForgotType('email')
      } else {
        setForgotType('phone')
      }
    }
  }, [country?.id])

  const [formData, setFormData] = useState({
    emailOrPhone: ''
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = forgotType === 'phone' 
        ? 'Mobile number is required' 
        : 'Email is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccess('')

    try {
      const countryId = parseInt(country.id)
      const response = await authService.forgotPassword(
          formData.emailOrPhone,
          countryId,
          forgotType
        )
      
      if (response.status) {
        setSuccess(response.message || 'OTP sent successfully!')
        
        // Use data from API response to ensure correct redirection
        const userData = response.data?.user || response.data
        const userId = userData?.id || userData?.user_id || userData?.userId
        const phone = userData?.phone || ''
        const email = userData?.email || ''
        
        setTimeout(() => {
          router.push(`/user/verify-otp?userId=${userId}&type=forgot-password&phone=${phone}&email=${email}&forgotType=${forgotType}`)
        }, 1500)
      } else {
        setErrors({ submit: response.message || 'Failed to send OTP. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to send OTP. Please check your connection and try again.' })
    } finally {
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

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 -left-24 w-60 h-60 bg-orange opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 -right-24 w-60 h-60 bg-orange-deep opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} />

      <main className="flex-1 px-4 py-6 relative z-10 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-4.5 animate-fade-in">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep shadow-md">
            <Mail className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-black text-gray-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            Enter your details to reset password
          </p>
        </div>

        <div className="w-full">
          <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.015)]">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Type Toggle */}
              <div className="flex gap-1 bg-gray-100/70 p-1 rounded-xl border border-line/40">
                <button
                  type="button"
                  onClick={() => {
                    setForgotType('phone')
                    setFormData({ emailOrPhone: '' })
                    setErrors({})
                    setSuccess('')
                  }}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-205 ${
                    forgotType === 'phone'
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
                    setForgotType('email')
                    setFormData({ emailOrPhone: '' })
                    setErrors({})
                    setSuccess('')
                  }}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-205 ${
                    forgotType === 'email'
                      ? 'bg-surface text-orange shadow-sm text-orange-650'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </button>
              </div>

              {/* Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {forgotType === 'phone' ? (
                      <Phone className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Mail className="h-4 w-4" strokeWidth={2} />
                    )}
                  </div>
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    placeholder={forgotType === 'phone' ? 'Enter mobile number' : 'Enter your email'}
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

              {/* Error/Success Messages */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                  {errors.submit}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-2.5 text-[10px] font-semibold text-green-655">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg shadow-orange-500/10"
              >
                {isLoading ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-1.5 border-t border-gray-150/45">
                <p className="text-xs font-semibold text-gray-400 mt-2.5">
                  Remember your password?{' '}
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

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

function DesktopForgotPasswordPage() {
  const [forgotType, setForgotType] = useState('phone')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { country } = useCountry()

  useEffect(() => {
    if (country?.id) {
      if (String(country.id) === '2') {
        setForgotType('email')
      } else {
        setForgotType('phone')
      }
    }
  }, [country?.id])

  const [formData, setFormData] = useState({
    emailOrPhone: ''
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = forgotType === 'phone' 
        ? 'Mobile number is required' 
        : 'Email is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccess('')

    try {
      const countryId = parseInt(country.id)
      const response = await authService.forgotPassword(
          formData.emailOrPhone,
          countryId,
          forgotType
        )
      
      if (response.status) {
        setSuccess(response.message || 'OTP sent successfully!')
        
        // Use data from API response to ensure correct redirection
        const userData = response.data?.user || response.data
        const userId = userData?.id || userData?.user_id || userData?.userId
        const phone = userData?.phone || ''
        const email = userData?.email || ''
        
        setTimeout(() => {
          router.push(`/user/verify-otp?userId=${userId}&type=forgot-password&phone=${phone}&email=${email}&forgotType=${forgotType}`)
        }, 1500)
      } else {
        setErrors({ submit: response.message || 'Failed to send OTP. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to send OTP. Please check your connection and try again.' })
    } finally {
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

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-orange opacity-[0.02] blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-[400px] w-[400px] rounded-full bg-orange-deep opacity-[0.02] blur-3xl" />
      </div>

      <Header />

      <main className="relative py-8 flex-1 flex items-center justify-center z-10 bg-gradient-to-br from-orange-50/10 via-bg to-orange-50/10">
        <div className="mx-auto max-w-[360px] w-full px-6">
          <div className="mb-4.5 text-center relative z-10">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep shadow-md">
              <Mail className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-lg font-black text-gray-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Enter your details to reset password
            </p>
          </div>

          <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange opacity-[0.03] blur-3xl pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
              {/* Type Toggle */}
              <div className="flex gap-1.5 rounded-xl bg-bg p-1 border border-line/45">
                <button
                  type="button"
                  onClick={() => {
                    setForgotType('phone')
                    setFormData({ emailOrPhone: '' })
                    setErrors({})
                    setSuccess('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                    forgotType === 'phone'
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
                    setForgotType('email')
                    setFormData({ emailOrPhone: '' })
                    setErrors({})
                    setSuccess('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                    forgotType === 'email'
                      ? 'bg-surface text-orange shadow-sm text-orange-650'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </button>
              </div>

              {/* Input */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {forgotType === 'phone' ? (
                      <Phone className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Mail className="h-4 w-4" strokeWidth={2} />
                    )}
                  </div>
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    placeholder={forgotType === 'phone' ? 'Enter mobile number' : 'Enter your email'}
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

              {/* Error/Success Messages */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                  {errors.submit}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-2.5 text-[10px] font-semibold text-green-655">
                  {success}
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
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-1.5 border-t border-line/30">
                <p className="text-[10px] font-semibold text-gray-400 mt-2">
                  Remember your password?{' '}
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

      <Footer />
    </div>
  )
}

export default function ForgotPasswordPage() {
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

  return isMobile ? <MobileForgotPasswordPage /> : <DesktopForgotPasswordPage />
}
