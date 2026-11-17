import React from 'react'
import { CirclePlay, CalendarRange, CircleCheck, Pause } from 'lucide-react'
const items = [
  ['active', 'Active', CirclePlay],
  ['planned', 'Planned', CalendarRange],
  ['completed', 'Completed', CircleCheck],
  ['paused', 'Paused', Pause],
]
export default function ProjectSummary({ summary, retry, error }) {
  if (error)
    return (
      <div className="projects-inline-error" role="alert">
        Project counts are unavailable.{' '}
        <button className="btn btn-link btn-sm" onClick={retry}>
          Retry counts
        </button>
      </div>
    )
  return (
    <div className="project-summary" aria-label="Project totals">
      {items.map(([key, title, Icon]) => (
        <div className="project-summary-item" key={key}>
          <Icon size={18} aria-hidden="true" />
          <span>{title}</span>
          <strong>{summary ? summary.statusCounts[key] || 0 : '—'}</strong>
        </div>
      ))}
    </div>
  )
}
