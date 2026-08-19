'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, ArrowRight, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { authService } from '../../../src/services/authService'

function MobileOTPPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpVerified, setOtpVerified] = useState(false) // New state for OTP verification status
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get('userId')
  const type = searchParams.get('type') // 'login', 'register', or 'forgot-password'
  const rawPhone = searchParams.get('phone')
  const rawEmail = searchParams.get('email')
  const countryParam = searchParams.get('countryId') || searchParams.get('country')

  const loginTypeParam = searchParams.get('loginType')
  const forgotTypeParam = searchParams.get('forgotType') // 'phone' or 'email' for forgot password
  const mobileVerifiedParam = searchParams.get('mobileVerified') === '1' || searchParams.get('mobileVerified') === 'true'
  const emailVerifiedParam = searchParams.get('emailVerified') === '1' || searchParams.get('emailVerified') === 'true'

  const phone = (!rawPhone || rawPhone === 'null' || rawPhone === 'undefined' || rawPhone.trim() === '') ? null : rawPhone
  const email = (!rawEmail || rawEmail === 'null' || rawEmail === 'undefined' || rawEmail.trim() === '') ? null : rawEmail

  const hasPhone = !!phone
  const hasEmail = !!email

  // Determine which fields to show
  let showMobile = hasPhone
  let showEmail = hasEmail

  if (type === 'login' && loginTypeParam === 'phone') {
    showMobile = true
    showEmail = false
  } else if (type === 'login' && loginTypeParam === 'email') {
    showMobile = false
    showEmail = true
  } else if (type === 'forgot-password' && forgotTypeParam === 'phone') {
    showMobile = true
    showEmail = false
  } else if (type === 'forgot-password' && forgotTypeParam === 'email') {
    showMobile = false
    showEmail = true
  } else if (emailVerifiedParam && !mobileVerifiedParam && hasPhone) {
    showMobile = true
    showEmail = false
  } else if (mobileVerifiedParam && !emailVerifiedParam && hasEmail) {
    showMobile = false
    showEmail = true
  }

  // OTP inputs (4 digits for mobile, 4 digits for email)
  const [mobileOTP, setMobileOTP] = useState(['', '', '', ''])
  const [emailOTP, setEmailOTP] = useState(['', '', '', ''])

  // Password fields for forgot-password flow
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const mobileInputRefs = useRef([])
  const emailInputRefs = useRef([])

  useEffect(() => {
    mobileInputRefs.current = mobileInputRefs.current.slice(0, 4)
    emailInputRefs.current = emailInputRefs.current.slice(0, 4)
  }, [])

  const handleOTPChange = (index, value, type) => {
    if (!/^\d*$/.test(value)) return // Only numbers

    const otpArray = type === 'mobile' ? [...mobileOTP] : [...emailOTP]
    const setOTP = type === 'mobile' ? setMobileOTP : setEmailOTP
    const refs = type === 'mobile' ? mobileInputRefs : emailInputRefs

    otpArray[index] = value.slice(-1) // Only last character
    setOTP(otpArray)

    // Auto-focus next input
    if (value && index < 3) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index, type) => {
    const refs = type === 'mobile' ? mobileInputRefs : emailInputRefs

    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e, type) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('')

    if (pastedData.every(char => /^\d$/.test(char))) {
      if (type === 'mobile') {
        setMobileOTP([...pastedData, ...new Array(4 - pastedData.length).fill('')])
      } else {
        setEmailOTP([...pastedData, ...new Array(4 - pastedData.length).fill('')])
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const mobileOTPString = mobileOTP.join('')
    const emailOTPString = emailOTP.join('')

    const isDubai = String(countryParam) === '2'

    if (type === 'forgot-password' && otpVerified) {
      if (!newPassword) {
        setError('Please enter a new password')
        return
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    } else {
      // Validation: validate OTP based on which flow and visible/required field
      if (type === 'register') {
        if (showMobile && !showEmail) {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else if (showEmail && !showMobile) {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        } else {
          if (isDubai) {
            if (emailOTPString.length !== 4) {
              setError('Please enter complete email OTP')
              return
            }
            if (mobileOTPString.length > 0 && mobileOTPString.length !== 4) {
              setError('Please enter complete 4-digit mobile OTP or leave it blank')
              return
            }
          } else {
            if (mobileOTPString.length !== 4) {
              setError('Please enter complete mobile OTP')
              return
            }
            if (emailOTPString.length > 0 && emailOTPString.length !== 4) {
              setError('Please enter complete 4-digit email OTP or leave it blank')
              return
            }
          }
        }
      } else if (type === 'login') {
        if (showMobile && !showEmail) {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else if (showEmail && !showMobile) {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        } else {
          if (loginTypeParam === 'email' || (isDubai && emailOTPString.length === 4)) {
            if (emailOTPString.length !== 4) {
              setError('Please enter complete email OTP')
              return
            }
          } else {
            if (mobileOTPString.length !== 4) {
              setError('Please enter complete mobile OTP')
              return
            }
          }
        }
      } else {
        // forgot-password
        if (forgotTypeParam === 'phone') {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        }
      }
    }

    setIsLoading(true)

    try {
      let response

      if (type === 'forgot-password') {
        if (!otpVerified) {
          const otp = forgotTypeParam === 'phone' ? mobileOTPString : emailOTPString
          const otpType = forgotTypeParam === 'phone' ? 'mobile' : 'email'

          response = await authService.verifyForgotPasswordOTP(
            userId,
            otp,
            otpType
          )

          if (response.status) {
            setOtpVerified(true)
            setSuccess('OTP verified successfully! Please set your new password.')
          }
        } else {
          response = await authService.resetPassword(phone || email, newPassword)
        }
      } else if (type === 'register') {
        // Registration flow: ALWAYS use verify_otp endpoint (/verify_otp)
        response = await authService.verifyOTP(
          userId,
          mobileOTPString,
          emailOTPString,
          phone || email,
          countryParam
        )
      } else {
        // Login flow: ALWAYS use verify_otp_new endpoint (/verify_otp_new)
        let otp = ''
        let otpType = 'mobile'

        if (showMobile && !showEmail) {
          otp = mobileOTPString
          otpType = 'mobile'
        } else if (showEmail && !showMobile) {
          otp = emailOTPString
          otpType = 'email'
        } else {
          if (loginTypeParam === 'email' || (isDubai && emailOTPString.length === 4)) {
            otp = emailOTPString
            otpType = 'email'
          } else {
            otp = mobileOTPString
            otpType = 'mobile'
          }
        }

        response = await authService.verifyOTPNew(
          userId,
          otp,
          otpType,
          phone || email,
          countryParam
        )
      }

      if (response.status) {
        if (type === 'forgot-password') {
          if (otpVerified) {
            setSuccess('Password reset successful! Redirecting to login...')
            setTimeout(() => {
              window.location.href = '/user/login'
            }, 1500)
          }
        } else if (type === 'login') {
          const returnUrl = typeof window !== 'undefined' ? sessionStorage.getItem('returnUrl') : null
          const targetUrl = returnUrl || '/user/dashboard'
          if (returnUrl) sessionStorage.removeItem('returnUrl')

          setSuccess('Login successful! Redirecting...')
          setTimeout(() => {
            window.location.href = targetUrl
          }, 1500)
        } else {
          // Register
          setSuccess('Verification successful! Redirecting to login...')
          setTimeout(() => {
            window.location.href = '/user/login'
          }, 1500)
        }
      } else {
        setError(response.message || 'Verification failed. Please try again.')
      }
    } catch (error) {
      setError('Verification failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const renderOTPInputs = (otp, setOTP, refs, type, label, isRequired = false) => (
    <div className="mb-3">
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-gray-500">
        {label}{' '}
        {isRequired ? (
          <span className="text-orange font-extrabold text-[10px] normal-case ml-1 bg-orange/10 px-1.5 py-0.5 rounded">(Required)</span>
        ) : (
          <span className="text-gray-400 font-medium text-[10px] normal-case ml-1 bg-gray-100 px-1.5 py-0.5 rounded">(Optional)</span>
        )}
      </label>
      <div className="flex justify-center gap-1.5">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => refs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value, type)}
            onKeyDown={(e) => handleKeyDown(e, index, type)}
            onPaste={(e) => handlePaste(e, type)}
            className="h-10 w-10 rounded-lg border-2 border-line bg-bg text-center text-base font-bold text-fg transition-all focus:border-orange focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange/30"
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 -left-24 w-60 h-60 bg-orange opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 -right-24 w-60 h-60 bg-orange-deep opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      <MobileHeader onOpenMenu={() => setMenuOpen(true)} />

      <main className="flex-1 px-4 py-6 relative z-10 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-4.5 animate-fade-in">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep shadow-md">
            <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-black text-gray-900 tracking-tight">
            {type === 'forgot-password' ? (otpVerified ? 'Set New Password' : 'Verify OTP') : 'Verify OTP'}
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            {type === 'forgot-password'
              ? (otpVerified ? 'Create your new password to continue' : 'Enter the OTP sent to continue')
              : (showMobile && showEmail
                ? 'Enter codes sent to your phone and email'
                : showMobile
                  ? 'Enter code sent to your phone'
                  : 'Enter code sent to your email'
              )
            }
          </p>
        </div>

        <div className="w-full">
          <div className="rounded-2xl border border-gray-150/50 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.015)]">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!otpVerified && (showMobile && showEmail ? (
                String(countryParam) === '2' ? (
                  <>
                    {renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP${email ? ` (${email})` : ''}`, true)}
                    {renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP${phone ? ` (${phone})` : ''}`, false)}
                  </>
                ) : (
                  <>
                    {renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP${phone ? ` (${phone})` : ''}`, true)}
                    {renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP${email ? ` (${email})` : ''}`, false)}
                  </>
                )
              ) : showMobile ? (
                renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP${phone ? ` (${phone})` : ''}`, true)
              ) : showEmail ? (
                renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP${email ? ` (${email})` : ''}`, true)
              ) : null)}

              {type === 'forgot-password' && otpVerified && (
                <>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full rounded-xl border border-line bg-bg py-2.5 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 focus:border-orange focus:ring-orange/30 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={2} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full rounded-xl border border-line bg-bg py-2.5 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 focus:border-orange focus:ring-orange/30 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-2.5 text-[10px] font-semibold text-green-655">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg shadow-orange-500/10"
              >
                {isLoading ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{type === 'forgot-password' ? (otpVerified ? 'Resetting...' : 'Verifying OTP...') : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span>{type === 'forgot-password' ? (otpVerified ? 'Reset Password' : 'Verify OTP') : 'Verify & Continue'}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

function DesktopOTPPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get('userId')
  const type = searchParams.get('type')
  const rawPhone = searchParams.get('phone')
  const rawEmail = searchParams.get('email')
  const countryParam = searchParams.get('countryId') || searchParams.get('country')

  const loginTypeParam = searchParams.get('loginType')
  const forgotTypeParam = searchParams.get('forgotType')
  const mobileVerifiedParam = searchParams.get('mobileVerified') === '1' || searchParams.get('mobileVerified') === 'true'
  const emailVerifiedParam = searchParams.get('emailVerified') === '1' || searchParams.get('emailVerified') === 'true'

  const phone = (!rawPhone || rawPhone === 'null' || rawPhone === 'undefined' || rawPhone.trim() === '') ? null : rawPhone
  const email = (!rawEmail || rawEmail === 'null' || rawEmail === 'undefined' || rawEmail.trim() === '') ? null : rawEmail

  const hasPhone = !!phone
  const hasEmail = !!email

  // Determine which fields to show
  let showMobile = hasPhone
  let showEmail = hasEmail

  if (type === 'login' && loginTypeParam === 'phone') {
    showMobile = true
    showEmail = false
  } else if (type === 'login' && loginTypeParam === 'email') {
    showMobile = false
    showEmail = true
  } else if (type === 'forgot-password' && forgotTypeParam === 'phone') {
    showMobile = true
    showEmail = false
  } else if (type === 'forgot-password' && forgotTypeParam === 'email') {
    showMobile = false
    showEmail = true
  } else if (emailVerifiedParam && !mobileVerifiedParam && hasPhone) {
    showMobile = true
    showEmail = false
  } else if (mobileVerifiedParam && !emailVerifiedParam && hasEmail) {
    showMobile = false
    showEmail = true
  }

  const [mobileOTP, setMobileOTP] = useState(['', '', '', ''])
  const [emailOTP, setEmailOTP] = useState(['', '', '', ''])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const mobileInputRefs = useRef([])
  const emailInputRefs = useRef([])

  useEffect(() => {
    mobileInputRefs.current = mobileInputRefs.current.slice(0, 4)
    emailInputRefs.current = emailInputRefs.current.slice(0, 4)
  }, [])

  const handleOTPChange = (index, value, type) => {
    if (!/^\d*$/.test(value)) return

    const otpArray = type === 'mobile' ? [...mobileOTP] : [...emailOTP]
    const setOTP = type === 'mobile' ? setMobileOTP : setEmailOTP
    const refs = type === 'mobile' ? mobileInputRefs : emailInputRefs

    otpArray[index] = value.slice(-1)
    setOTP(otpArray)

    if (value && index < 3) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index, type) => {
    const refs = type === 'mobile' ? mobileInputRefs : emailInputRefs

    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e, type) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('')

    if (pastedData.every(char => /^\d$/.test(char))) {
      if (type === 'mobile') {
        setMobileOTP([...pastedData, ...new Array(4 - pastedData.length).fill('')])
      } else {
        setEmailOTP([...pastedData, ...new Array(4 - pastedData.length).fill('')])
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const mobileOTPString = mobileOTP.join('')
    const emailOTPString = emailOTP.join('')

    const isDubai = String(countryParam) === '2'

    if (type === 'forgot-password' && otpVerified) {
      if (!newPassword) {
        setError('Please enter a new password')
        return
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    } else {
      // Validation: validate OTP based on which flow and visible/required field
      if (type === 'register') {
        if (showMobile && !showEmail) {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else if (showEmail && !showMobile) {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        } else {
          if (isDubai) {
            if (emailOTPString.length !== 4) {
              setError('Please enter complete email OTP')
              return
            }
            if (mobileOTPString.length > 0 && mobileOTPString.length !== 4) {
              setError('Please enter complete 4-digit mobile OTP or leave it blank')
              return
            }
          } else {
            if (mobileOTPString.length !== 4) {
              setError('Please enter complete mobile OTP')
              return
            }
            if (emailOTPString.length > 0 && emailOTPString.length !== 4) {
              setError('Please enter complete 4-digit email OTP or leave it blank')
              return
            }
          }
        }
      } else if (type === 'login') {
        if (showMobile && !showEmail) {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else if (showEmail && !showMobile) {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        } else {
          if (loginTypeParam === 'email' || (isDubai && emailOTPString.length === 4)) {
            if (emailOTPString.length !== 4) {
              setError('Please enter complete email OTP')
              return
            }
          } else {
            if (mobileOTPString.length !== 4) {
              setError('Please enter complete mobile OTP')
              return
            }
          }
        }
      } else {
        // forgot-password
        if (forgotTypeParam === 'phone') {
          if (mobileOTPString.length !== 4) {
            setError('Please enter complete mobile OTP')
            return
          }
        } else {
          if (emailOTPString.length !== 4) {
            setError('Please enter complete email OTP')
            return
          }
        }
      }
    }

    setIsLoading(true)

    try {
      let response

      if (type === 'forgot-password') {
        if (!otpVerified) {
          const otp = forgotTypeParam === 'phone' ? mobileOTPString : emailOTPString
          const otpType = forgotTypeParam === 'phone' ? 'mobile' : 'email'

          response = await authService.verifyForgotPasswordOTP(
            userId,
            otp,
            otpType
          )

          if (response.status) {
            setOtpVerified(true)
            setSuccess('OTP verified successfully! Please set your new password.')
          }
        } else {
          response = await authService.resetPassword(phone || email, newPassword)
        }
      } else if (type === 'register') {
        // Registration flow: ALWAYS use verify_otp endpoint (/verify_otp)
        response = await authService.verifyOTP(
          userId,
          mobileOTPString,
          emailOTPString,
          phone || email,
          countryParam
        )
      } else {
        // Login flow: ALWAYS use verify_otp_new endpoint (/verify_otp_new)
        let otp = ''
        let otpType = 'mobile'

        if (showMobile && !showEmail) {
          otp = mobileOTPString
          otpType = 'mobile'
        } else if (showEmail && !showMobile) {
          otp = emailOTPString
          otpType = 'email'
        } else {
          if (loginTypeParam === 'email' || (isDubai && emailOTPString.length === 4)) {
            otp = emailOTPString
            otpType = 'email'
          } else {
            otp = mobileOTPString
            otpType = 'mobile'
          }
        }

        response = await authService.verifyOTPNew(
          userId,
          otp,
          otpType,
          phone || email,
          countryParam
        )
      }

      if (response.status) {
        if (type === 'forgot-password') {
          if (otpVerified) {
            setSuccess('Password reset successful! Redirecting to login...')
            setTimeout(() => {
              window.location.href = '/user/login'
            }, 1500)
          }
        } else if (type === 'login') {
          const returnUrl = typeof window !== 'undefined' ? sessionStorage.getItem('returnUrl') : null
          const targetUrl = returnUrl || '/user/dashboard'
          if (returnUrl) sessionStorage.removeItem('returnUrl')

          setSuccess('Login successful! Redirecting...')
          setTimeout(() => {
            window.location.href = targetUrl
          }, 1500)
        } else {
          // Register
          setSuccess('Verification successful! Redirecting to login...')
          setTimeout(() => {
            window.location.href = '/user/login'
          }, 1500)
        }
      } else {
        setError(response.message || 'Verification failed. Please try again.')
      }
    } catch (error) {
      setError('Verification failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderOTPInputs = (otp, setOTP, refs, type, label, isRequired = false) => (
    <div className="mb-5">
      <label className="mb-2.5 block text-center text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}{' '}
        {isRequired ? (
          <span className="text-orange font-extrabold text-xs normal-case ml-1 bg-orange/10 px-2 py-0.5 rounded">(Required)</span>
        ) : (
          <span className="text-gray-400 font-medium text-xs normal-case ml-1 bg-gray-100 px-2 py-0.5 rounded">(Optional)</span>
        )}
      </label>
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => refs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value, type)}
            onKeyDown={(e) => handleKeyDown(e, index, type)}
            onPaste={(e) => handlePaste(e, type)}
            className="h-12 w-12 rounded-xl border-2 border-line bg-bg text-center text-lg font-bold text-fg transition-all focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:ring-opacity-20"
          />
        ))}
      </div>
    </div>
  )

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
              <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-lg font-black text-gray-900 tracking-tight">
              {type === 'forgot-password' ? (otpVerified ? 'Set New Password' : 'Verify OTP') : 'Verify OTP'}
            </h2>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              {type === 'forgot-password' ? (
                <>{otpVerified ? 'Create your new password to continue' : 'Enter the OTP sent to continue'}</>
              ) : (
                <>{showMobile && showEmail ? 'Enter codes sent to your phone and email' : showMobile ? 'Enter code sent to your phone' : 'Enter code sent to your email'}</>
              )}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange opacity-[0.03] blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
              {!otpVerified && (showMobile && showEmail ? (
                String(countryParam) === '2' ? (
                  <>
                    {renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP sent to ${email || 'your email'}`, true)}
                    {renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP sent to ${phone || 'your phone'}`, false)}
                  </>
                ) : (
                  <>
                    {renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP sent to ${phone || 'your phone'}`, true)}
                    {renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP sent to ${email || 'your email'}`, false)}
                  </>
                )
              ) : showMobile ? (
                renderOTPInputs(mobileOTP, setMobileOTP, mobileInputRefs, 'mobile', `Mobile OTP sent to ${phone || 'your phone'}`, true)
              ) : showEmail ? (
                renderOTPInputs(emailOTP, setEmailOTP, emailInputRefs, 'email', `Email OTP sent to ${email || 'your email'}`, true)
              ) : null)}

              {type === 'forgot-password' && otpVerified && (
                <>
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full rounded-xl border border-line bg-bg py-2 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 focus:border-orange focus:ring-orange/30 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full rounded-xl border border-line bg-bg py-2 pl-9 pr-9 text-xs font-medium transition-all outline-none focus:ring-1 focus:border-orange focus:ring-orange/30 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-2.5 text-[10px] font-semibold text-red-655">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-2.5 text-[10px] font-semibold text-green-655">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-deep py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{type === 'forgot-password' ? (otpVerified ? 'Resetting...' : 'Verifying OTP...') : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span>{type === 'forgot-password' ? (otpVerified ? 'Reset Password' : 'Verify OTP') : 'Verify & Continue'}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function VerifyOTPPage() {
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

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      {isMobile ? <MobileOTPPage /> : <DesktopOTPPage />}
    </Suspense>
  )
}
