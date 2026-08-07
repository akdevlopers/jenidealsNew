const isServer = typeof window === 'undefined';
const PROXY_BASE_URL = process.env.NEXT_PUBLIC_PROXY_BASE_URL || '/api/v5';

const API_BASE_URL = !isServer 
  ? PROXY_BASE_URL 
  : (process.env.NEXT_PUBLIC_API_BASE === 'cloud' 
    ? process.env.NEXT_PUBLIC_CLOUD_BASE_URL 
    : process.env.NEXT_PUBLIC_LOCAL_BASE_URL);

export const authService = {
  // Login API
  async login(phoneOrEmail, country, password) {
    const formData = new FormData()
    formData.append('phone_or_email', phoneOrEmail)
    formData.append('country', country)
    formData.append('password', password)

    const response = await fetch(`${API_BASE_URL}/loginV5`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (data?.status) {
      // Store token if login successful and no OTP required
      if (data.otpPage === 0 && data.data?.token) {
        localStorage.setItem('authToken', data.data.token)
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user))
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-change'))
        }
      }
    }
    
    return data
  },

  // Register API
  async register(name, phone, email, country, password, referralCode = '') {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone || '')
    formData.append('email', email || '')
    formData.append('country', country)
    formData.append('password', password)
    formData.append('referral_code', referralCode || '')

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  },

  // Verify OTP API - Modified to handle forgot password without user_id
  async verifyOTP(userId, mobileOtp, emailOtp, phoneOrEmail = null, country = null) {
    const formData = new FormData()
    
    // If userId is undefined and we have phoneOrEmail, use that instead
    if (userId === 'undefined' || !userId) {
      if (phoneOrEmail) {
        formData.append('phone_or_email', phoneOrEmail)
      }
    } else {
      formData.append('user_id', userId)
    }
    
    // Always append both OTP fields
    formData.append('mobileOtp', mobileOtp)
    formData.append('emailOtp', emailOtp)
    // Always append countryId payload
    const countryIdVal = country || (typeof window !== 'undefined' ? (localStorage.getItem('selectedCountryId') || JSON.parse(localStorage.getItem('user') || '{}').country) : null)
    if (countryIdVal) {
      formData.append('countryId', countryIdVal)
    }

    const response = await fetch(`${API_BASE_URL}/verify_otp`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (data.status && data.data && data.data.token) {
      localStorage.setItem('authToken', data.data.token)
      
      const existingUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      let existingUser = {}
      try {
        existingUser = existingUserStr ? JSON.parse(existingUserStr) : {}
      } catch (e) {}

      const userToSave = {
        ...existingUser,
        ...(data.data.user || {}),
        id: (data.data.user && data.data.user.id) ? data.data.user.id : (userId || existingUser.id),
        country: (data.data.user && data.data.user.country) ? data.data.user.country : (country || existingUser.country)
      }
      
      localStorage.setItem('user', JSON.stringify(userToSave))
    }
    
    return data
  },

  // Single OTP Verification API (/verify_otp_new)
  async verifyOTPNew(userId, otp, otpType, phoneOrEmail = null, country = null) {
    const formData = new FormData()
    
    if (userId === 'undefined' || !userId) {
      if (phoneOrEmail) {
        formData.append('phone_or_email', phoneOrEmail)
      }
    } else {
      formData.append('user_id', userId)
    }
    
    formData.append('otp', otp)
    formData.append('type', otpType) // 'mobile' or 'email'

    const countryIdVal = country || (typeof window !== 'undefined' ? (localStorage.getItem('selectedCountryId') || JSON.parse(localStorage.getItem('user') || '{}').country) : null)
    if (countryIdVal) {
      formData.append('countryId', countryIdVal)
    }

    const response = await fetch(`${API_BASE_URL}/verify_otp_new`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (data.status && data.data && data.data.token) {
      localStorage.setItem('authToken', data.data.token)
      
      const existingUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      let existingUser = {}
      try {
        existingUser = existingUserStr ? JSON.parse(existingUserStr) : {}
      } catch (e) {}

      const userToSave = {
        ...existingUser,
        ...(data.data.user || {}),
        id: (data.data.user && data.data.user.id) ? data.data.user.id : (userId || existingUser.id),
        country: (data.data.user && data.data.user.country) ? data.data.user.country : (countryIdVal || existingUser.country)
      }
      
      localStorage.setItem('user', JSON.stringify(userToSave))
    }
    
    return data
  },

  // Forgot Password API
  async forgotPassword(phoneOrEmail, country, type) {
    const formData = new FormData()
    formData.append('phone_or_email', phoneOrEmail)
    formData.append('country', country)
    if (type) {
      formData.append('type', type) // 'phone' or 'email'
    }

    const response = await fetch(`${API_BASE_URL}/forget_password`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  },

  // Verify Forgot Password OTP and Reset Password
  async verifyForgotPasswordOTP(userId, otp, type) {
    const formData = new FormData()
    formData.append('user_id', userId)
    formData.append('otp', otp)
    formData.append('type', type) // 'mobile' or 'email'

    const response = await fetch(`${API_BASE_URL}/forget_password_verify_otp`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  },

  // Get stored token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },

  // Get stored user data
  getUserData() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  // Logout
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken()
  },

  // View Profile API
  async viewProfile(userId, country) {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('country', country)

    const response = await fetch(`${API_BASE_URL}/viewProfile`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  },

  // Update Profile API - uses same endpoint as viewProfile
  async updateProfile(userId, name, email, phone, country) {
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('country', country)

      // Use the same viewProfile endpoint for update
      const response = await fetch(`${API_BASE_URL}/viewProfile`, {
        method: 'POST',
        body: formData,
      })

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      
      // Update stored user data if successful
      if (data.status && data.Data) {
        const currentUser = this.getUserData()
        if (currentUser) {
          const updatedUser = { 
            ...currentUser, 
            name: data.Data.name || name,
            email: data.Data.email || email,
            phone: data.Data.phone || phone
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      return data
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Failed to update profile. Please try again.'
      }
    }
  },

  // Reset Password API
  async resetPassword(phoneOrEmail, newPassword) {
    const formData = new FormData()
    formData.append('phone_or_email', phoneOrEmail)
    formData.append('new_password', newPassword)

    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  },

  // Get Wallet History API
  async getWalletHistory(userId) {
    if (!userId) return { status: false, Data: [] }
    
    try {
      const response = await fetch(`${API_BASE_URL}/walletHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: userId.toString(),
          user_id: userId.toString()
        })
      })

      const data = await response.json()
      return data
    } catch (error) {
      return { status: false, message: error.message || 'Failed to fetch wallet history', Data: [] }
    }
  }
}
