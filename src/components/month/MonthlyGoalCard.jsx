import React, { useState } from 'react'
import { MoreVertical, Edit2, Trash2, TrendingUp, Clock, Calendar, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, HelpCircle } from 'lucide-react'
import GoalMilestones from './GoalMilestones'
import { formatDate } from '../../utils/dateFormat'

const CATEGORY_LABELS = {
  career: 'Career',
  education: 'Education',
  business: 'Business',
  finance: 'Finance',
  health: 'Health',
  personal: 'Personal',
  spiritual: 'Spiritual',
  project: 'Project',
  skill: 'Skill',
  other: 'Other'
}

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  paused: 'Paused',
  cancelled: 'Cancelled'
}

const PRIORITY_BADGES = {
  critical: 'badge-priority-critical',
  high: 'badge-priority-high',
  medium: 'badge-priority-medium',
  low: 'badge-priority-low'
}

const STATUS_BADGES = {
  not_started: 'badge-status-neutral',
  in_progress: 'badge-status-active',
  completed: 'badge-status-success',
  paused: 'badge-status-warning',
  cancelled: 'badge-status-muted'
}

const MonthlyGoalCard = ({
  goal,
  onEdit,
  onDelete,
  onOpenProgressModal,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const progress = Math.min(100, Math.max(0, Math.round(goal.progress ?? 0)))
  const isCompleted = goal.status === 'completed' || progress >= 100

  return (
    <div className={`monthly-goal-card ${isCompleted ? 'goal-completed-card' : ''}`}>
      {/* Top Bar: Category, Priority, Status & Menu */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex flex-wrap align-items-center gap-1.5">
          <span className="goal-category-tag">
            {CATEGORY_LABELS[goal.category] || goal.category}
          </span>
          <span className={`badge-pill ${PRIORITY_BADGES[goal.priority] || 'badge-priority-medium'}`}>
            {goal.priority}
          </span>
          <span className={`badge-pill ${STATUS_BADGES[goal.status] || 'badge-status-neutral'}`}>
            {STATUS_LABELS[goal.status] || goal.status}
          </span>
        </div>

        <div className="dropdown position-relative" onKeyDown={(event) => { if (event.key === 'Escape') { setMenuOpen(false); event.currentTarget.querySelector('button')?.focus() } }}>
          <button
            type="button"
            className="btn btn-link btn-xs text-muted p-1 rounded hover-bg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Options for ${goal.title}`}
            aria-expanded={menuOpen}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="dropdown-backdrop-transparent"
                onClick={() => setMenuOpen(false)}
              />
              <ul className="dropdown-menu dropdown-menu-end show shadow-sm py-1">
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2 small py-1.5"
                    onClick={() => {
                      setMenuOpen(false)
                      onOpenProgressModal(goal)
                    }}
                  >
                    <TrendingUp size={14} className="text-primary" /> Update Progress
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2 small py-1.5"
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(goal)
                    }}
                  >
                    <Edit2 size={14} /> Edit Details
                  </button>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2 small py-1.5 text-danger"
                    onClick={() => {
                      setMenuOpen(false)
                      if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
                        onDelete(goal._id)
                      }
                    }}
                  >
                    <Trash2 size={14} /> Delete Goal
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Goal Title */}
      <h3 className="goal-card-title mb-1">
        {isCompleted && <CheckCircle2 size={18} className="text-success me-1.5 d-inline" />}
        {goal.title}
      </h3>

      {/* Why This Matters */}
      {goal.why && (
        <div className="goal-why-box mb-3">
          <span className="goal-why-label">
            <Lightbulb size={13} className="text-gold" /> Why:
          </span>
          <span className="goal-why-text">{goal.why}</span>
        </div>
      )}

      {/* Description toggle */}
      {goal.description && (
        <div className="mb-2">
          {showDetails ? (
            <p className="goal-description-text mb-1">{goal.description}</p>
          ) : null}
          <button
            type="button"
            className="btn btn-link btn-xs p-0 text-decoration-none text-muted d-inline-flex align-items-center gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <span>{showDetails ? 'Hide notes' : 'View notes'}</span>
          </button>
        </div>
      )}

      {/* Measurement / Progress */}
      <div className="goal-progress-section my-3">
        <div className="d-flex justify-content-between align-items-baseline mb-1">
          <span className="goal-target-text small">
            <strong>{goal.currentValue ?? 0}</strong> / {goal.targetValue} {goal.unit || ''}
          </span>
          <span className="goal-percentage-text fw-bold small text-primary">
            {progress}%
          </span>
        </div>
        <div className="progress goal-progress-bar" style={{ height: '8px' }}>
          <div
            className={`progress-bar ${isCompleted ? 'bg-success' : 'bg-primary'}`}
            role="progressbar"
            aria-label={`${goal.title} progress`}
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Meta: Estimated hours & Deadline */}
      {(goal.estimatedHours || goal.deadline) && (
        <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-3">
          {goal.estimatedHours > 0 && (
            <span className="d-inline-flex align-items-center gap-1">
              <Clock size={13} /> {goal.estimatedHours}h est.
            </span>
          )}
          {goal.deadline && (
            <span className="d-inline-flex align-items-center gap-1">
              <Calendar size={13} /> Due {formatDate(new Date(goal.deadline), { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      )}

      {/* Milestones */}
      <div className="mt-3 pt-2 border-top">
        <GoalMilestones
          goalId={goal._id}
          milestones={goal.milestones || []}
          onToggleMilestone={onToggleMilestone}
          onAddMilestone={onAddMilestone}
          onDeleteMilestone={onDeleteMilestone}
        />
      </div>

      {/* Quick Action Footer */}
      <div className="goal-card-footer mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
        <button
          type="button"
          className="btn btn-outline-primary btn-xs d-inline-flex align-items-center gap-1"
          onClick={() => onOpenProgressModal(goal)}
        >
          <TrendingUp size={13} />
          <span>Update Progress</span>
        </button>

        <button
          type="button"
          className="btn btn-link btn-xs text-muted text-decoration-none p-0"
          onClick={() => onEdit(goal)}
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default MonthlyGoalCard
