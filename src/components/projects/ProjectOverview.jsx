import React from 'react'
import { Pencil, Archive } from 'lucide-react'
import {
  STATUSES,
  PRIORITIES,
  StatusBadge,
  dateLabel,
  minutes,
  label,
} from './projectHelpers'
export default function ProjectOverview({
  project,
  work,
  busy,
  onEdit,
  onArchive,
  onStatusChange,
}) {
  return (
    <>
      <div className="project-detail-toolbar">
        <StatusBadge value={project.status} />
        <span className="project-priority">
          {PRIORITIES[project.priority]} priority
        </span>
        <button
          className="btn btn-outline-secondary btn-sm ms-auto"
          disabled={busy}
          onClick={() => onEdit()}
        >
          <Pencil size={14} />
          Edit project
        </button>
      </div>
      <section className="project-detail-section">
        <h3>Overview</h3>
        <p className="project-detail-objective">
          {project.objective ||
            'Add an objective to define what finishing this project means.'}
        </p>
        {project.description && <p>{project.description}</p>}
        <dl className="project-overview-facts">
          <div>
            <dt>Start date</dt>
            <dd>{dateLabel(project.startDate)}</dd>
          </div>
          <div>
            <dt>Target date</dt>
            <dd>
              {dateLabel(project.targetDate)}
              {project.isOverdue && (
                <span className="project-overdue d-block">
                  Past target date
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt>Estimated effort</dt>
            <dd>
              {project.estimatedHours == null
                ? 'Not set'
                : `${project.estimatedHours}h`}
            </dd>
          </div>
          <div>
            <dt>Actual work</dt>
            <dd>
              {work?.data
                ? minutes(work.data.summary.actualMinutes)
                : work?.error
                  ? 'Not available'
                  : 'Loading…'}
            </dd>
          </div>
          <div>
            <dt>Milestones</dt>
            <dd>
              {project.progress == null
                ? 'No milestones yet'
                : `${project.completedMilestones} / ${project.activeMilestones} · ${project.progress}%`}
            </dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{label(project.category)}</dd>
          </div>
          {project.completedAt && (
            <div>
              <dt>Completed</dt>
              <dd>{dateLabel(project.completedAt)}</dd>
            </div>
          )}
        </dl>
        {project.notes && (
          <div className="project-notes">
            <h4>Notes</h4>
            <p>{project.notes}</p>
          </div>
        )}
        <div className="project-status-controls">
          <label htmlFor="project-status">Project status</label>
          <select
            id="project-status"
            className="form-select"
            value={project.status}
            disabled={busy}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {Object.entries(STATUSES).map(([key, text]) => (
              <option key={key} value={key}>
                {text}
              </option>
            ))}
          </select>
          {project.status !== 'archived' && (
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={busy}
              onClick={onArchive}
            >
              <Archive size={15} />
              Archive
            </button>
          )}
        </div>
      </section>
    </>
  )
}
