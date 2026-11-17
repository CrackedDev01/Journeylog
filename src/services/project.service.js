import apiClient from '../api/apiClient'
import { PROJECTS } from '../api/endpoints'
const read = async (url, params) =>
  (await apiClient.get(url, { params })).data.data
const write = async (method, url, payload) =>
  (await apiClient[method](url, payload)).data.data
const projectService = {
  getProjects: (params) => read(PROJECTS.BASE, params),
  getActiveProjects: () => read(PROJECTS.ACTIVE),
  getProject: (id) => read(PROJECTS.BY_ID(id)),
  createProject: (data) => write('post', PROJECTS.BASE, data),
  updateProject: (id, data) => write('patch', PROJECTS.BY_ID(id), data),
  deleteProject: (id) => write('delete', PROJECTS.BY_ID(id)),
  archiveProject: (id) => write('patch', PROJECTS.ARCHIVE(id)),
  completeProject: (id) => write('patch', PROJECTS.COMPLETE(id)),
  reopenProject: (id) => write('patch', PROJECTS.REOPEN(id)),
  getSummary: () => read(PROJECTS.SUMMARY),
  getProjectSummary: (id) => read(PROJECTS.PROJECT_SUMMARY(id)),
  getProjectWorkSummary: (id) => read(PROJECTS.WORK_SUMMARY(id)),
  getProjectTasks: (id, params) => read(PROJECTS.TASKS(id), params),
  getProjectGoals: (id) => read(PROJECTS.GOALS(id)),
  addMilestone: (id, data) => write('post', PROJECTS.MILESTONES(id), data),
  updateMilestone: (id, milestoneId, data) =>
    write('patch', PROJECTS.MILESTONE(id, milestoneId), data),
  deleteMilestone: (id, milestoneId) =>
    write('delete', PROJECTS.MILESTONE(id, milestoneId)),
}
export default projectService
