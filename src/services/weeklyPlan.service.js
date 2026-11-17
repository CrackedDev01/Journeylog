import apiClient from '../api/apiClient'
import { WEEKLY_PLANS } from '../api/endpoints'

const weeklyPlanService = {
  getPlans: async (params = {}) => {
    const response = await apiClient.get(WEEKLY_PLANS.BASE, { params })
    return response.data
  },
  getCurrentPlan: async () => {
    const response = await apiClient.get(WEEKLY_PLANS.CURRENT)
    return response.data
  },
  getPlan: async (id) => {
    const response = await apiClient.get(WEEKLY_PLANS.BY_ID(id))
    return response.data
  },
  createPlan: async (data) => {
    const response = await apiClient.post(WEEKLY_PLANS.BASE, data)
    return response.data
  },
  updatePlan: async (id, data) => {
    const response = await apiClient.patch(WEEKLY_PLANS.BY_ID(id), data)
    return response.data
  },
  deletePlan: async (id) => {
    const response = await apiClient.delete(WEEKLY_PLANS.BY_ID(id))
    return response.data
  },
  addCommitment: async (planId, data) => {
    const response = await apiClient.post(WEEKLY_PLANS.COMMITMENTS(planId), data)
    return response.data
  },
  updateCommitment: async (planId, commitmentId, data) => {
    const response = await apiClient.patch(WEEKLY_PLANS.COMMITMENT(planId, commitmentId), data)
    return response.data
  },
  removeCommitment: async (planId, commitmentId) => {
    const response = await apiClient.delete(WEEKLY_PLANS.COMMITMENT(planId, commitmentId))
    return response.data
  },
  getSummary: async (planId) => {
    const response = await apiClient.get(WEEKLY_PLANS.SUMMARY(planId))
    return response.data
  },
}

export default weeklyPlanService
