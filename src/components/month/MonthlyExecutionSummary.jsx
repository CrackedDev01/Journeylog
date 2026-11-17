import React from 'react'
import { CheckCircle2, Clock, Repeat2, BookOpen, Layers } from 'lucide-react'

const formatMins = (mins = 0) => {
  if (!mins || mins <= 0) return '0h 0m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

const MonthlyExecutionSummary = ({ monthData }) => {
  if (!monthData) return null

  const tasks = monthData?.tasks || {}
  const time = monthData?.time || {}
  const habits = monthData?.habits || {}
  const learning = monthData?.learning || {}
  const projects = monthData?.projects || {}

  const taskPct = tasks.total > 0 ? Math.round((tasks.completed / tasks.total) * 100) : 0
  const mustDoPct = tasks.mustDoCount > 0 ? Math.round((tasks.completedMustDoCount / tasks.mustDoCount) * 100) : 0

  return (
    <section className="dashboard-panel execution-summary-panel">
      <div className="panel-heading mb-3">
        <div>
          <span className="section-eyebrow">MONTH IN NUMBERS</span>
          <h3 className="mb-0">Execution & Habits</h3>
        </div>
        <span className="panel-icon">
          <Layers size={18} />
        </span>
      </div>

      <div className="row g-3">
        {/* Task Execution Breakdown */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="summary-metric-box p-3 rounded border h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <CheckCircle2 size={16} />
              <span className="fw-semibold small">Tasks</span>
            </div>
            <div className="h4 mb-1">{tasks.completed || 0} <span className="text-muted fs-6">/ {tasks.total || 0}</span></div>
            <div className="text-muted small mb-2">{taskPct}% completion rate</div>
            <div className="progress" style={{ height: '5px' }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${taskPct}%` }}
              />
            </div>
            <div className="mt-2 text-muted small">
              Must-Do: <strong>{tasks.completedMustDoCount || 0}/{tasks.mustDoCount || 0}</strong> ({mustDoPct}%)
            </div>
          </div>
        </div>

        {/* Time Investment */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="summary-metric-box p-3 rounded border h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <Clock size={16} />
              <span className="fw-semibold small">Focus Hours</span>
            </div>
            <div className="h4 mb-1">{formatMins(time.actualMinutes)}</div>
            <div className="text-muted small mb-2">
              Planned: {formatMins(time.plannedMinutes)}
            </div>
            <div className="mt-3 text-muted small">
              {time.differenceMinutes > 0
                ? `+${Math.round(time.differenceMinutes / 60)}h over plan`
                : time.differenceMinutes < 0
                ? `${Math.abs(Math.round(time.differenceMinutes / 60))}h under plan`
                : 'Balanced with plan'}
            </div>
          </div>
        </div>

        {/* Habit Consistency */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="summary-metric-box p-3 rounded border h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-warning">
              <Repeat2 size={16} />
              <span className="fw-semibold small">Habits</span>
            </div>
            <div className="h4 mb-1">
              {habits.completionRate != null ? `${habits.completionRate}%` : 'N/A'}
            </div>
            <div className="text-muted small mb-2">Check-in consistency</div>
            <div className="progress" style={{ height: '5px' }}>
              <div
                className="progress-bar bg-warning"
                style={{ width: `${habits.completionRate || 0}%` }}
              />
            </div>
            <div className="mt-2 text-muted small">
              <strong>{habits.completed || 0}</strong> logged out of {habits.scheduled || 0}
            </div>
          </div>
        </div>

        {/* Learning & Projects */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="summary-metric-box p-3 rounded border h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
              <BookOpen size={16} />
              <span className="fw-semibold small">Growth & Projects</span>
            </div>
            <div className="h4 mb-1">{projects.active || 0} <span className="text-muted fs-6">active projects</span></div>
            <div className="text-muted small mb-1">
              {projects.completed || 0} completed
            </div>
            <div className="mt-2 text-muted small">
              Learning: <strong>{learning.sessions || 0}</strong> sessions ({formatMins(learning.minutes)})
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MonthlyExecutionSummary
