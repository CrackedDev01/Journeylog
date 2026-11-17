import React, { useState } from 'react'
import { X, Check, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'

const GoalMilestones = ({
  goalId,
  milestones = [],
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  readonly = false
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const completedCount = milestones.filter(m => m.completed).length
  const totalCount = milestones.length

  const handleAdd = async (e) => {
    e?.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    setError('')
    try {
      await onAddMilestone(goalId, trimmed)
      setNewTitle('')
      setIsAdding(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save the milestone. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const runMilestoneAction = async (action) => {
    setError('')
    try { await action() } catch (err) { setError(err?.response?.data?.message || 'Could not update the milestone. Please try again.') }
  }

  return (
    <div className="goal-milestones-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="milestones-heading">
          Milestones {totalCount > 0 && <span className="text-muted">({completedCount}/{totalCount})</span>}
        </span>
        {!readonly && !isAdding && (
          <button
            type="button"
            className="btn btn-link btn-xs p-0 text-decoration-none d-inline-flex align-items-center gap-1 text-primary-accent"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={13} />
            <span>Add milestone</span>
          </button>
        )}
      </div>

      {milestones.length === 0 && !isAdding && (
        <p className="text-muted small mb-0 fst-italic">No milestones set yet.</p>
      )}

      {milestones.length > 0 && (
        <ul className="milestone-list list-unstyled mb-0">
          {milestones.map((m) => (
            <li
              key={m._id || m.title}
              className={`milestone-item d-flex align-items-center justify-content-between py-1 px-2 rounded ${m.completed ? 'milestone-completed' : ''}`}
            >
              <div
                className="d-flex align-items-center gap-2 flex-grow-1 cursor-pointer"
                onClick={() => !readonly && runMilestoneAction(() => onToggleMilestone(goalId, m._id, !m.completed))}
                role={readonly ? undefined : 'checkbox'}
                aria-checked={readonly ? undefined : Boolean(m.completed)}
                tabIndex={readonly ? -1 : 0}
                onKeyDown={(e) => {
                  if (!readonly && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    runMilestoneAction(() => onToggleMilestone(goalId, m._id, !m.completed))
                  }
                }}
              >
                <span className="milestone-check">
                  {m.completed ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <Circle size={16} className="text-muted" />
                  )}
                </span>
                <span className={`milestone-title ${m.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {m.title}
                </span>
              </div>

              {!readonly && (
                <button
                  type="button"
                  className="btn btn-link btn-xs text-muted p-0 opacity-hover"
                  onClick={(e) => {
                    e.stopPropagation()
                    runMilestoneAction(() => onDeleteMilestone(goalId, m._id))
                  }}
                  aria-label={`Delete milestone: ${m.title}`}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-danger small" role="alert">{error}</p>}
      {/* Inline Add Milestone Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mt-2 d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Milestone title..."
            aria-label="Milestone title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            disabled={submitting}
          />
          <button
            type="submit"
            aria-label="Save milestone"
            className="btn btn-primary btn-sm px-2"
            disabled={!newTitle.trim() || submitting}
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-2"
            aria-label="Cancel adding milestone"
            onClick={() => {
              setIsAdding(false)
              setNewTitle('')
            }}
            disabled={submitting}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  )
}

export default GoalMilestones
