import apiClient from '../api/apiClient'
import { WEEKLY_REVIEWS } from '../api/endpoints'
const s = {
  getReviews: async (params={}) => (await apiClient.get(WEEKLY_REVIEWS.BASE,{params})).data,
  getCurrent: async () => (await apiClient.get(WEEKLY_REVIEWS.CURRENT)).data,
  getByWeek: async (weekStart) => (await apiClient.get(WEEKLY_REVIEWS.BY_WEEK(weekStart))).data,
  getById: async (id) => (await apiClient.get(WEEKLY_REVIEWS.BY_ID(id))).data,
  getPreviewCurrent: async () => (await apiClient.get(WEEKLY_REVIEWS.PREVIEW_CURRENT)).data,
  getPreviewByWeek: async (weekStart) => (await apiClient.get(WEEKLY_REVIEWS.PREVIEW_BY_WEEK(weekStart))).data,
  create: async (data) => (await apiClient.post(WEEKLY_REVIEWS.BASE,data)).data,
  update: async (id,data) => (await apiClient.patch(WEEKLY_REVIEWS.BY_ID(id),data)).data,
  refreshSnapshot: async (id) => (await apiClient.patch(WEEKLY_REVIEWS.REFRESH_SNAPSHOT(id))).data,
  delete: async (id) => (await apiClient.delete(WEEKLY_REVIEWS.BY_ID(id))).data,
}
export default s