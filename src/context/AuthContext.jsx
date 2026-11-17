import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import { storage } from '../utils/storage'
import { formatApiError } from '../utils/formatApiError'

// Create context
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true during auth check
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
})

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = storage.getToken()
        const storedUser = storage.getUser()

        if (storedToken && storedUser) {
          // Verify token with backend
          try {
            const response = await apiClient.get('/auth/me')
            // Backend wraps user in data.user
            const userData = response.data.data?.user || response.data.data || storedUser
            setUser(userData)
            setToken(storedToken)
            setIsAuthenticated(true)
          } catch (error) {
            // Token is invalid or expired
            storage.clearAuth()
            setUser(null)
            setToken(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setToken(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        storage.clearAuth()
        setUser(null)
        setToken(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth expiry events from apiClient interceptor
    const handleAuthExpired = () => {
      storage.clearAuth()
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    }
    window.addEventListener('authExpired', handleAuthExpired)
    return () => window.removeEventListener('authExpired', handleAuthExpired)
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      const { token: newToken, user: newUser } = response.data.data
      
      // Store token and user
      storage.setToken(newToken)
      storage.setUser(newUser)
      
      // Update state
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = formatApiError(error)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      const { token: newToken, user: newUser } = response.data.data
      
      // Store token and user
      storage.setToken(newToken)
      storage.setUser(newUser)
      
      // Update state
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = formatApiError(error)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    storage.clearAuth()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/auth/me')
      const userData = response.data.data?.user || response.data.data
      setUser(userData)
      storage.setUser(userData)
      return { success: true, data: userData }
    } catch (error) {
      const errorMessage = formatApiError(error)
      storage.clearAuth()
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
      return { success: false, error: errorMessage }
    }
  }

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
