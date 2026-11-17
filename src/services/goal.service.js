import apiClient from '../api/apiClient'
import { GOALS } from '../api/endpoints'

/**
 * Goal service for handling Monthly Goal API calls
 */
const goalService = {
  /**
   * Get all goals (with optional filters: month, year, status, category, priority)
   */
  getGoals: async (filters = {}) => {
    const response = await apiClient.get(GOALS.BASE, { params: filters })
    return response.data
  },

  /**
   * Get a single goal by ID
   */
  getGoal: async (id) => {
    const response = await apiClient.get(GOALS.BY_ID(id))
    return response.data
  },

  /**
   * Create a new monthly goal
   */
  createGoal: async (data) => {
    const response = await apiClient.post(GOALS.BASE, data)
    return response.data
  },

  /**
   * Update a goal by ID
   */
  updateGoal: async (id, data) => {
    const response = await apiClient.patch(GOALS.BY_ID(id), data)
    return response.data
  },

  /**
   * Delete a goal by ID
   */
  deleteGoal: async (id) => {
    const response = await apiClient.delete(GOALS.BY_ID(id))
    return response.data
  },

  /**
   * Update goal progress (currentValue)
   */
  updateGoalProgress: async (id, data) => {
    const response = await apiClient.patch(GOALS.PROGRESS(id), data)
    return response.data
  },

  /**
   * Get goal summary statistics for a given month/year
   */
  getGoalSummary: async (filters = {}) => {
    const response = await apiClient.get(GOALS.SUMMARY, { params: filters })
    return response.data
  },

  /**
   * Add a milestone to a goal
   */
  addMilestone: async (goalId, data) => {
    const response = await apiClient.post(GOALS.MILESTONES(goalId), data)
    return response.data
  },

  /**
   * Update a milestone
   */
  updateMilestone: async (goalId, milestoneId, data) => {
    const response = await apiClient.patch(GOALS.MILESTONE(goalId, milestoneId), data)
    return response.data
  },

  /**
   * Delete a milestone
   */
  deleteMilestone: async (goalId, milestoneId) => {
    const response = await apiClient.delete(GOALS.MILESTONE(goalId, milestoneId))
    return response.data
  },
}

export default goalService
