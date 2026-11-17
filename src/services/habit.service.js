import apiClient from '../api/apiClient'
import { HABITS } from '../api/endpoints'

const habitService = {
  getHabits: async (params = {}) => {
    const response = await apiClient.get(HABITS.BASE, { params })
    return response.data
  },
  getHabit: async (id) => {
    const response = await apiClient.get(HABITS.BY_ID(id))
    return response.data
  },
  createHabit: async (data) => {
    const response = await apiClient.post(HABITS.BASE, data)
    return response.data
  },
  updateHabit: async (id, data) => {
    const response = await apiClient.patch(HABITS.BY_ID(id), data)
    return response.data
  },
  deleteHabit: async (id) => {
    const response = await apiClient.delete(HABITS.BY_ID(id))
    return response.data
  },
  getTodayHabits: async () => {
    const response = await apiClient.get(HABITS.TODAY)
    return response.data
  },
  checkIn: async (id, data) => {
    const response = await apiClient.post(HABITS.CHECK_IN(id), data)
    return response.data
  },
  skip: async (id, data) => {
    const response = await apiClient.post(HABITS.SKIP(id), data)
    return response.data
  },
  getHistory: async (id, params = {}) => {
    const response = await apiClient.get(HABITS.HISTORY(id), { params })
    return response.data
  },
  getStats: async (id) => {
    const response = await apiClient.get(HABITS.STATS(id))
    return response.data
  },
  getWeeklySummary: async (params = {}) => {
    const response = await apiClient.get(HABITS.WEEKLY_SUMMARY, { params })
    return response.data
  },
  getMonthlySummary: async (params = {}) => {
    const response = await apiClient.get(HABITS.MONTHLY_SUMMARY, { params })
    return response.data
  },
  updateLog: async (habitId, logId, data) => {
    const response = await apiClient.patch(HABITS.LOG(habitId, logId), data)
    return response.data
  },
  deleteLog: async (habitId, logId) => {
    const response = await apiClient.delete(HABITS.LOG(habitId, logId))
    return response.data
  },
}

export default habitService