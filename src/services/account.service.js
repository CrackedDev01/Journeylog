import apiClient from '../api/apiClient'
import { ACCOUNT } from '../api/endpoints'

const accountService = {
  exportData: async () => {
    const response = await apiClient.get(ACCOUNT.EXPORT, { responseType: 'blob' })
    return response.data
  },
  deleteAccount: async (payload) => {
    const response = await apiClient.delete(ACCOUNT.BASE, { data: payload })
    return response.data
  },
}

export default accountService
