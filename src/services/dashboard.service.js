import apiClient from '../api/apiClient'
import { DASHBOARD } from '../api/endpoints'

/**
 * Dashboard service for handling dashboard-related API calls
 */
const dashboardService = {
  /**
   * Get dashboard overview data
   * @returns {Promise<Object>} Dashboard overview data
   */
  getOverview: async () => {
    try {
      const response = await apiClient.get(DASHBOARD.OVERVIEW)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Get today's dashboard data
   * @returns {Promise<Object>} Today's dashboard data
   */
  getToday: async () => {
    try {
      const response = await apiClient.get(DASHBOARD.TODAY)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Get week's dashboard data
   * @returns {Promise<Object>} Week's dashboard data
   */
  getWeek: async () => {
    try {
      const response = await apiClient.get(DASHBOARD.WEEK)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Get month's dashboard data
   * @returns {Promise<Object>} Month's dashboard data
   */
  getMonth: async () => {
    try {
      const response = await apiClient.get(DASHBOARD.MONTH)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },

  /**
   * Get daily streak data
   * @returns {Promise<Object>} Streak data
   */
  getStreak: async () => {
    try {
      const response = await apiClient.get(DASHBOARD.STREAK)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  },
}

export default dashboardService
