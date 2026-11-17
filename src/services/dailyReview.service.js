import apiClient from '../api/apiClient'
import { DAILY_REVIEWS } from '../api/endpoints'
const s = {
  getReviews: async (params={}) => (await apiClient.get(DAILY_REVIEWS.BASE,{params})).data,
  getToday: async () => (await apiClient.get(DAILY_REVIEWS.TODAY)).data,
  getByDate: async (date) => (await apiClient.get(DAILY_REVIEWS.BY_DATE(date))).data,
  getById: async (id) => (await apiClient.get(DAILY_REVIEWS.BY_ID(id))).data,
  getPreviewToday: async () => (await apiClient.get(DAILY_REVIEWS.PREVIEW_TODAY)).data,
  getPreviewByDate: async (date) => (await apiClient.get(DAILY_REVIEWS.PREVIEW_BY_DATE(date))).data,
  create: async (data) => (await apiClient.post(DAILY_REVIEWS.BASE,data)).data,
  update: async (id,data) => (await apiClient.patch(DAILY_REVIEWS.BY_ID(id),data)).data,
  refreshSnapshot: async (id) => (await apiClient.patch(DAILY_REVIEWS.REFRESH_SNAPSHOT(id))).data,
  delete: async (id) => (await apiClient.delete(DAILY_REVIEWS.BY_ID(id))).data,
}
export default s