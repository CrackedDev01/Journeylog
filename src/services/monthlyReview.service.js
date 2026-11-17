import apiClient from '../api/apiClient'
import { MONTHLY_REVIEWS } from '../api/endpoints'

/**
 * Monthly Review service for handling Monthly Review API calls
 */
const monthlyReviewService = {
  /**
   * Create a new monthly review
   */
  createMonthlyReview: async (data) => {
    const response = await apiClient.post(MONTHLY_REVIEWS.BASE, data)
    return response.data
  },

  /**
   * Get current month's monthly review
   */
  getCurrentMonthlyReview: async (timezone) => {
    const params = timezone ? { timezone } : {}
    const response = await apiClient.get(MONTHLY_REVIEWS.CURRENT, { params })
    return response.data
  },

  /**
   * Get monthly review by year and month
   */
  getMonthlyReviewByMonth: async (year, month) => {
    const response = await apiClient.get(MONTHLY_REVIEWS.BY_MONTH(year, month))
    return response.data
  },

  /**
   * Get single monthly review by ID
   */
  getMonthlyReviewById: async (id) => {
    const response = await apiClient.get(MONTHLY_REVIEWS.BY_ID(id))
    return response.data
  },

  /**
   * Get all monthly reviews with filtering and pagination
   */
  getMonthlyReviews: async (filters = {}) => {
    const response = await apiClient.get(MONTHLY_REVIEWS.BASE, { params: filters })
    return response.data
  },

  /**
   * Update monthly review
   */
  updateMonthlyReview: async (id, data) => {
    const response = await apiClient.patch(MONTHLY_REVIEWS.BY_ID(id), data)
    return response.data
  },

  /**
   * Delete monthly review
   */
  deleteMonthlyReview: async (id) => {
    const response = await apiClient.delete(MONTHLY_REVIEWS.BY_ID(id))
    return response.data
  },

  /**
   * Refresh monthly review snapshot
   */
  refreshSnapshot: async (id) => {
    const response = await apiClient.patch(MONTHLY_REVIEWS.REFRESH_SNAPSHOT(id))
    return response.data
  },

  /**
   * Get current month's monthly review preview
   */
  getCurrentPreview: async (timezone) => {
    const params = timezone ? { timezone } : {}
    const response = await apiClient.get(MONTHLY_REVIEWS.PREVIEW_CURRENT, { params })
    return response.data
  },

  /**
   * Get monthly review preview by year and month
   */
  getPreviewByMonth: async (year, month) => {
    const response = await apiClient.get(MONTHLY_REVIEWS.PREVIEW_BY_MONTH(year, month))
    return response.data
  },
}

export default monthlyReviewService
