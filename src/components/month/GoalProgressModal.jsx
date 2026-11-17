import Modal from '../common/Modal'
import React, { useState, useEffect } from 'react'
import { Check, X, TrendingUp } from 'lucide-react'

const GoalProgressModal = ({
  goal,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentValue, setCurrentValue] = useState(goal?.currentValue ?? 0)
  const [status, setStatus] = useState(goal?.status ?? 'in_progress')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (goal) {
      setCurrentValue(goal.currentValue ?? 0)
      setStatus(goal.status ?? 'in_progress')
      setError('')
    }
  }, [goal, isOpen])

  if (!isOpen || !goal) return null

  const targetValue = goal.targetValue || 1
  const targetType = goal.targetType || 'number'
  const unit = goal.unit || ''

  // Compute preview percentage
  let previewPct = 0
  if (targetType === 'binary') {
    previewPct = status === 'completed' ? 100 : 0
  } else {
    previewPct = Math.min(100, Math.max(0, Math.round((Number(currentValue) / targetValue) * 100)))
  }

  const handleValueChange = (val) => {
    const num = Math.max(0, Number(val))
    setCurrentValue(num)
    // If reached or exceeded target, suggest completed
    if (num >= targetValue && status !== 'completed') {
      setStatus('completed')
    } else if (num < targetValue && status === 'completed') {
      setStatus('in_progress')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(goal._id, {
        currentValue: Number(currentValue),
        status
      })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update progress')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="goal-progress-heading" busy={submitting}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="modal-icon-badge">
              <TrendingUp size={18} />
            </span>
            <h2 id="goal-progress-heading" className="modal-title-custom mb-0">Update Goal Progress</h2>
          </div>
          <button
            type="button"
            className="btn btn-close-custom"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-custom">
            <div className="goal-preview-block mb-3">
              <h6 className="goal-title-preview mb-1">{goal.title}</h6>
              <div className="text-muted small">
                Target: <strong>{targetValue} {unit}</strong> ({targetType})
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                {error}
              </div>
            )}

            {targetType === 'binary' ? (
              <div className="mb-3">
                <label className="form-label small fw-semibold">Goal Status</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${status === 'completed' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      setStatus('completed')
                      setCurrentValue(1)
                    }}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${status !== 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      setStatus('in_progress')
                      setCurrentValue(0)
                    }}
                  >
                    In Progress
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <label className="form-label small fw-semibold" htmlFor="goal-progress-currentValue">
                  Current Value {unit ? `(${unit})` : ''}
                </label>
                <div className="input-group">
                  <input id="goal-progress-currentValue"
                    type="number"
                    step="any"
                    min="0"
                    className="form-control"
                    value={currentValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    required
                    autoFocus
                  />
                  {unit && <span className="input-group-text">{unit}</span>}
                </div>
              </div>
            )}

            {/* Progress Bar Preview */}
            <div className="mb-3">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Calculated Progress</span>
                <strong>{previewPct}%</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  aria-label="Goal progress preview"
                  style={{ width: `${previewPct}%` }}
                  aria-valuenow={previewPct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>

            {/* Status Selector */}
            <div className="mb-2">
              <label className="form-label small fw-semibold" htmlFor="goal-progress-status">Update Status</label>
              <select id="goal-progress-status"
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="modal-footer-custom d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={15} />
                  <span>Save Progress</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default GoalProgressModal
