import React from 'react'
export const STATUSES = {
  planned: 'Planned',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  cancelled: 'Cancelled',
  archived: 'Archived',
}
export const MILESTONE_STATUSES = {
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
  skipped: 'Skipped',
}
export const PRIORITIES = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}
export const CATEGORIES = [
  'project',
  'career',
  'education',
  'business',
  'personal',
  'finance',
  'health',
  'spiritual',
  'skill',
  'other',
]
export const label = (value) =>
  value
    ? value.replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase())
    : 'Not set'
export const minutes = (value) =>
  value == null
    ? 'Not available'
    : `${Math.floor(value / 60)}h${value % 60 ? ` ${value % 60}m` : ''}`
export const dateLabel = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Not set'
export const dateInput = (value) => (value ? value.slice(0, 10) : '')
export function StatusBadge({ value, milestone = false }) {
  return (
    <span className={`project-badge status-${value}`}>
      {(milestone ? MILESTONE_STATUSES : STATUSES)[value] || label(value)}
    </span>
  )
}
