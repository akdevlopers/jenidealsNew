'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { apiRequest } from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount & listen to storage/custom events
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    const handleAuthChange = () => checkAuth()
    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  const setAuthData = (userData, token) => {
    if (token) {
      localStorage.setItem('authToken', token)
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
    }
    window.dispatchEvent(new Event('auth-change'))
  }

  const login = async (credentials) => {
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      if (response.status && response.data) {
        const { token, user: userData } = response.data
        setAuthData(userData, token)
        return { success: true, user: userData }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (response.status && response.data) {
        const { token, user: newUser } = response.data
        setAuthData(newUser, token)
        return { success: true, user: newUser }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    window.dispatchEvent(new Event('auth-change'))
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    window.dispatchEvent(new Event('auth-change'))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    setAuthData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
