import apiClient from '../api/apiClient'
import { TASKS } from '../api/endpoints'

const taskService = {
  getTasks: async (params = {}) => {
    const response = await apiClient.get(TASKS.BASE, { params })
    return response.data
  },
  getTodayTasks: async () => {
    const response = await apiClient.get(TASKS.TODAY)
    return response.data
  },
  getTask: async (id) => {
    const response = await apiClient.get(TASKS.BY_ID(id))
    return response.data
  },
  createTask: async (data) => {
    const response = await apiClient.post(TASKS.BASE, data)
    return response.data
  },
  updateTask: async (id, data) => {
    const response = await apiClient.patch(TASKS.BY_ID(id), data)
    return response.data
  },
  deleteTask: async (id) => {
    const response = await apiClient.delete(TASKS.BY_ID(id))
    return response.data
  },
  completeTask: async (id) => {
    const response = await apiClient.patch(TASKS.COMPLETE(id))
    return response.data
  },
  reopenTask: async (id) => {
    const response = await apiClient.patch(TASKS.REOPEN(id))
    return response.data
  },
  skipTask: async (id, data = {}) => {
    const response = await apiClient.patch(TASKS.SKIP(id), data)
    return response.data
  },
  rescheduleTask: async (id, data) => {
    const response = await apiClient.patch(TASKS.RESCHEDULE(id), data)
    return response.data
  },
}

export default taskService
