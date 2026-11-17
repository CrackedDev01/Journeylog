import apiClient from '../api/apiClient'
import { WORK_SESSIONS } from '../api/endpoints'

const workSessionService = {
  getSessions: async (params = {}) => {
    const response = await apiClient.get(WORK_SESSIONS.BASE, { params })
    return response.data
  },
  getTodaySessions: async () => {
    const response = await apiClient.get(WORK_SESSIONS.TODAY)
    return response.data
  },
  getActiveSession: async () => {
    const response = await apiClient.get(WORK_SESSIONS.ACTIVE)
    return response.data
  },
  getTodaySummary: async () => {
    const response = await apiClient.get(WORK_SESSIONS.TODAY_SUMMARY)
    return response.data
  },
  getSession: async (id) => {
    const response = await apiClient.get(WORK_SESSIONS.BY_ID(id))
    return response.data
  },
  startSession: async (data) => {
    const response = await apiClient.post(WORK_SESSIONS.START, data)
    return response.data
  },
  stopSession: async (id, data = {}) => {
    const response = await apiClient.patch(WORK_SESSIONS.STOP(id), data)
    return response.data
  },
  cancelSession: async (id) => {
    const response = await apiClient.patch(WORK_SESSIONS.CANCEL(id))
    return response.data
  },
  updateSession: async (id, data) => {
    const response = await apiClient.patch(WORK_SESSIONS.BY_ID(id), data)
    return response.data
  },
  deleteSession: async (id) => {
    const response = await apiClient.delete(WORK_SESSIONS.BY_ID(id))
    return response.data
  },
  getTaskWorkSummary: async (taskId) => {
    const response = await apiClient.get(WORK_SESSIONS.TASK_SUMMARY(taskId))
    return response.data
  },
}

export default workSessionService
