// API endpoints for JourneyLog backend
export const AUTH = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/me',
  CHANGE_PASSWORD: '/auth/me/password',
}

export const ACCOUNT = {
  BASE: '/account',
  EXPORT: '/account/export',
}

export const DASHBOARD = {
  OVERVIEW: '/dashboard',
  TODAY: '/dashboard/today',
  WEEK: '/dashboard/week',
  MONTH: '/dashboard/month',
  STREAK: '/streak',
}

export const TASKS = {
  BASE: '/tasks',
  TODAY: '/tasks/today',
  BY_ID: (id) => `/tasks/${id}`,
  COMPLETE: (id) => `/tasks/${id}/complete`,
  REOPEN: (id) => `/tasks/${id}/reopen`,
  SKIP: (id) => `/tasks/${id}/skip`,
  RESCHEDULE: (id) => `/tasks/${id}/reschedule`,
}

export const HABITS = {
  BASE: '/habits',
  TODAY: '/habits/today',
  WEEKLY_SUMMARY: '/habits/summary/week',
  MONTHLY_SUMMARY: '/habits/summary/month',
  BY_ID: (id) => `/habits/${id}`,
  CHECK_IN: (id) => `/habits/${id}/check-in`,
  SKIP: (id) => `/habits/${id}/skip`,
  HISTORY: (id) => `/habits/${id}/history`,
  STATS: (id) => `/habits/${id}/stats`,
  LOG: (habitId, logId) => `/habits/${habitId}/logs/${logId}`,
}

export const PROJECTS = {
  BASE: '/projects',
  ACTIVE: '/projects/active',
  SUMMARY: '/projects/summary',
  BY_ID: (id) => `/projects/${id}`,
  COMPLETE: (id) => `/projects/${id}/complete`,
  REOPEN: (id) => `/projects/${id}/reopen`,
  ARCHIVE: (id) => `/projects/${id}/archive`,
  MILESTONES: (id) => `/projects/${id}/milestones`,
  MILESTONE: (id, milestoneId) => `/projects/${id}/milestones/${milestoneId}`,
  TASKS: (id) => `/projects/${id}/tasks`,
  GOALS: (id) => `/projects/${id}/goals`,
  PROJECT_SUMMARY: (id) => `/projects/${id}/summary`,
  WORK_SUMMARY: (id) => `/projects/${id}/work-summary`,
}

export const WORK_SESSIONS = {
  BASE: '/work-sessions',
  START: '/work-sessions/start',
  TODAY: '/work-sessions/today',
  ACTIVE: '/work-sessions/active',
  TODAY_SUMMARY: '/work-sessions/summary/today',
  BY_ID: (id) => `/work-sessions/${id}`,
  STOP: (id) => `/work-sessions/${id}/stop`,
  CANCEL: (id) => `/work-sessions/${id}/cancel`,
  TASK_SUMMARY: (taskId) => `/work-sessions/tasks/${taskId}/work-summary`,
}

export const DAILY_PLANS = {
  BASE: '/daily-plans',
  TODAY: '/daily-plans/today',
  BY_DATE: (date) => `/daily-plans/date/${date}`,
  BY_ID: (id) => `/daily-plans/${id}`,
}

export const WEEKLY_PLANS = {
  BASE: '/weekly-plans',
  CURRENT: '/weekly-plans/current',
  BY_ID: (id) => `/weekly-plans/${id}`,
  COMMITMENTS: (planId) => `/weekly-plans/${planId}/commitments`,
  COMMITMENT: (planId, commitmentId) => `/weekly-plans/${planId}/commitments/${commitmentId}`,
  SUMMARY: (planId) => `/weekly-plans/${planId}/summary`,
}

export const MONTHLY_REVIEWS = {
  BASE: '/monthly-reviews',
  CURRENT: '/monthly-reviews/current',
  PREVIEW_CURRENT: '/monthly-reviews/preview/current',
  PREVIEW_BY_MONTH: (year, month) => `/monthly-reviews/preview/${year}/${month}`,
  BY_MONTH: (year, month) => `/monthly-reviews/month/${year}/${month}`,
  BY_ID: (id) => `/monthly-reviews/${id}`,
  REFRESH_SNAPSHOT: (id) => `/monthly-reviews/${id}/refresh-snapshot`,
}

export const DAILY_REVIEWS = {
  BASE: '/daily-reviews',
  TODAY: '/daily-reviews/today',
  BY_DATE: (date) => `/daily-reviews/date/${date}`,
  BY_ID: (id) => `/daily-reviews/${id}`,
  PREVIEW_TODAY: '/daily-reviews/preview/today',
  PREVIEW_BY_DATE: (date) => `/daily-reviews/preview/${date}`,
  REFRESH_SNAPSHOT: (id) => `/daily-reviews/${id}/refresh-snapshot`,
}

export const WEEKLY_REVIEWS = {
  BASE: '/weekly-reviews',
  CURRENT: '/weekly-reviews/current',
  BY_WEEK: (weekStart) => `/weekly-reviews/week/${weekStart}`,
  BY_ID: (id) => `/weekly-reviews/${id}`,
  PREVIEW_CURRENT: '/weekly-reviews/preview/current',
  PREVIEW_BY_WEEK: (weekStart) => `/weekly-reviews/preview/${weekStart}`,
  REFRESH_SNAPSHOT: (id) => `/weekly-reviews/${id}/refresh-snapshot`,
}

export const SKILLS = {
  BASE: '/skills',
  ACTIVE: '/skills/active',
  RECENT: '/skills/recent',
  SUMMARY: '/skills/summary',
  BY_ID: (id) => `/skills/${id}`,
  ARCHIVE: (id) => `/skills/${id}/archive`,
  MASTER: (id) => `/skills/${id}/master`,
  LEVEL: (id) => `/skills/${id}/level`,
  STATS: (id) => `/skills/${id}/stats`,
  SESSIONS: (id) => `/skills/${id}/sessions`,
  SESSION: (skillId, sessionId) => `/skills/${skillId}/sessions/${sessionId}`,
}

export const GOALS = {
  BASE: '/goals',
  SUMMARY: '/goals/summary',
  BY_ID: (id) => `/goals/${id}`,
  PROGRESS: (id) => `/goals/${id}/progress`,
  MILESTONES: (goalId) => `/goals/${goalId}/milestones`,
  MILESTONE: (goalId, milestoneId) => `/goals/${goalId}/milestones/${milestoneId}`,
}
