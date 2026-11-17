import React from 'react'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { StatusBadge, PRIORITIES, dateLabel, minutes } from './projectHelpers'
export default function ProjectCard({ project, onOpen }) {
  return (
    <button
      type="button"
      data-project-id={project._id}
      className="project-card"
      onClick={() => onOpen(project._id)}
      aria-label={`Open project: ${project.name}`}
    >
      <span className="project-card-top">
        <StatusBadge value={project.status} />
        <span className="project-priority">{PRIORITIES[project.priority]}</span>
        <ArrowUpRight size={18} className="ms-auto" aria-hidden="true" />
      </span>
      <h2>{project.name}</h2>
      <p className="project-objective">
        {project.objective ||
          'Add an objective to define what finishing means.'}
      </p>
      <div className="project-card-progress">
        <span>Milestones</span>
        <strong>
          {project.progress == null
            ? 'No milestones yet'
            : `${project.completedMilestones} / ${project.activeMilestones} · ${project.progress}%`}
        </strong>
      </div>
      {project.progress != null && (
        <div
          className="progress project-progress"
          role="progressbar"
          aria-label={`${project.name} milestone progress`}
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      )}
      <dl className="project-card-facts">
        <div>
          <dt>Estimated</dt>
          <dd>
            {project.estimatedHours == null
              ? 'Not set'
              : `${project.estimatedHours}h`}
          </dd>
        </div>
        <div>
          <dt>Worked</dt>
          <dd>
            <Clock3 size={13} aria-hidden="true" />
            {minutes(project.actualMinutes)}
          </dd>
        </div>
      </dl>
      <span className="project-card-date">
        <CalendarDays size={14} aria-hidden="true" />
        {project.targetDate
          ? `Target ${dateLabel(project.targetDate)}`
          : 'No target date'}
        {project.isOverdue && (
          <span className="project-overdue">Past target date</span>
        )}
      </span>
    </button>
  )
}
