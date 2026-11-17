import apiClient from '../api/apiClient'
import { AUTH } from '../api/endpoints'
import { storage } from '../utils/storage'

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(AUTH.REGISTER, userData)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise<Object>} Response data
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(AUTH.LOGIN, credentials)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User data
   */
  getMe: async () => {
    try {
      const response = await apiClient.get(AUTH.ME)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Update current user profile (name, timezone)
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.patch(AUTH.UPDATE_PROFILE, profileData)
    return { success: true, data: response.data }
  },

  /**
   * Change current user password
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.patch(AUTH.CHANGE_PASSWORD, passwordData)
    return { success: true, data: response.data }
  },

  /**
   * Logout user (client-side; backend uses stateless JWT)
   */
  logout: () => {
    storage.clearAuth()
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!storage.getToken()
  },

  /**
   * Get auth token
   * @returns {string|null} Auth token
   */
  getToken: () => {
    return storage.getToken()
  },

  /**
   * Get current user
   * @returns {Object|null} User data
   */
  getUser: () => {
    return storage.getUser()
  },
}

export default authService
