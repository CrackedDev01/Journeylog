import React from 'react'
import { STATUSES, PRIORITIES } from './projectHelpers'
export default function ProjectFilters({
  filter,
  priority,
  onStatusChange,
  onPriorityChange,
}) {
  return (
    <div className="project-filters">
      <div
        className="project-status-filters"
        aria-label="Filter projects by status"
      >
        <button
          className={filter === '' ? 'active' : ''}
          aria-pressed={filter === ''}
          onClick={() => {
            onStatusChange('')
          }}
        >
          All
        </button>
        {Object.entries(STATUSES).map(([key, text]) => (
          <button
            key={key}
            className={filter === key ? 'active' : ''}
            aria-pressed={filter === key}
            onClick={() => {
              onStatusChange(key)
            }}
          >
            {text}
          </button>
        ))}
      </div>
      <label className="visually-hidden" htmlFor="project-priority-filter">
        Filter projects by priority
      </label>
      <select
        id="project-priority-filter"
        className="form-select"
        value={priority}
        onChange={(e) => {
          onPriorityChange(e.target.value)
        }}
      >
        <option value="">All priorities</option>
        {Object.entries(PRIORITIES).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )
}
