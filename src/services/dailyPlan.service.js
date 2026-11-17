import apiClient from '../api/apiClient'
import { DAILY_PLANS } from '../api/endpoints'

const dailyPlanService = {
  getPlans: async (params = {}) => {
    const response = await apiClient.get(DAILY_PLANS.BASE, { params })
    return response.data
  },
  getTodayPlan: async () => {
    const response = await apiClient.get(DAILY_PLANS.TODAY)
    return response.data
  },
  getPlanByDate: async (date) => {
    const response = await apiClient.get(DAILY_PLANS.BY_DATE(date))
    return response.data
  },
  getPlan: async (id) => {
    const response = await apiClient.get(DAILY_PLANS.BY_ID(id))
    return response.data
  },
  createPlan: async (data) => {
    const response = await apiClient.post(DAILY_PLANS.BASE, data)
    return response.data
  },
  updatePlan: async (id, data) => {
    const response = await apiClient.patch(DAILY_PLANS.BY_ID(id), data)
    return response.data
  },
  deletePlan: async (id) => {
    const response = await apiClient.delete(DAILY_PLANS.BY_ID(id))
    return response.data
  },
}

export default dailyPlanService
