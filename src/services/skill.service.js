import apiClient from '../api/apiClient'
import { SKILLS } from '../api/endpoints'
const s = {
  getSkills: async (params={}) => (await apiClient.get(SKILLS.BASE,{params})).data,
  getActiveSkills: async () => (await apiClient.get(SKILLS.ACTIVE)).data,
  getSkill: async (id) => (await apiClient.get(SKILLS.BY_ID(id))).data,
  createSkill: async (data) => (await apiClient.post(SKILLS.BASE,data)).data,
  updateSkill: async (id,data) => (await apiClient.patch(SKILLS.BY_ID(id),data)).data,
  archiveSkill: async (id) => (await apiClient.patch(SKILLS.ARCHIVE(id))).data,
  masterSkill: async (id) => (await apiClient.patch(SKILLS.MASTER(id))).data,
  updateLevel: async (id,data) => (await apiClient.patch(SKILLS.LEVEL(id),data)).data,
  getStats: async (id) => (await apiClient.get(SKILLS.STATS(id))).data,
  getSessions: async (id,params={}) => (await apiClient.get(SKILLS.SESSIONS(id),{params})).data,
  getSession: async (skillId,sessionId) => (await apiClient.get(SKILLS.SESSION(skillId,sessionId))).data,
  createSession: async (skillId,data) => (await apiClient.post(SKILLS.SESSIONS(skillId),data)).data,
  updateSession: async (skillId,sessionId,data) => (await apiClient.patch(SKILLS.SESSION(skillId,sessionId),data)).data,
  deleteSession: async (skillId,sessionId) => (await apiClient.delete(SKILLS.SESSION(skillId,sessionId))).data,
  getRecent: async () => (await apiClient.get(SKILLS.RECENT)).data,
  getSummary: async () => (await apiClient.get(SKILLS.SUMMARY)).data,
}
export default s