import ProjectSelect from '../projects/ProjectSelect'
import Modal from '../common/Modal'
import React, { useState, useEffect } from 'react'
import { Minus, X, Check, Plus, Trash2, HelpCircle, Target } from 'lucide-react'

const CATEGORIES = [
  { value: 'career', label: 'Career' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health' },
  { value: 'personal', label: 'Personal' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'project', label: 'Project' },
  { value: 'skill', label: 'Skill' },
  { value: 'other', label: 'Other' },
]

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

const TARGET_TYPES = [
  { value: 'number', label: 'Count / Number (e.g., 5 articles)' },
  { value: 'hours', label: 'Hours (e.g., 20 hours)' },
  { value: 'percentage', label: 'Percentage (0 to 100%)' },
  { value: 'binary', label: 'Done / Not Done (Single achievement)' },
]

const STATUSES = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
]

const MonthlyGoalForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialGoal = null,
  year,
  month
}) => {
  const isEdit = Boolean(initialGoal?._id)

  const [projectId, setProjectId] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('personal')
  const [priority, setPriority] = useState('medium')
  const [targetType, setTargetType] = useState('number')
  const [targetValue, setTargetValue] = useState(1)
  const [currentValue, setCurrentValue] = useState(0)
  const [unit, setUnit] = useState('')
  const [why, setWhy] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('not_started')
  const [milestones, setMilestones] = useState([])
  const [newMilestoneInput, setNewMilestoneInput] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setProjectId(initialGoal?.project?._id || initialGoal?.project || '')
    if (initialGoal) {
      setTitle(initialGoal.title || '')
      setCategory(initialGoal.category || 'personal')
      setPriority(initialGoal.priority || 'medium')
      setTargetType(initialGoal.targetType || 'number')
      setTargetValue(initialGoal.targetValue ?? 1)
      setCurrentValue(initialGoal.currentValue ?? 0)
      setUnit(initialGoal.unit || '')
      setWhy(initialGoal.why || '')
      setDescription(initialGoal.description || '')
      setEstimatedHours(initialGoal.estimatedHours ? String(initialGoal.estimatedHours) : '')
      setDeadline(initialGoal.deadline ? initialGoal.deadline.slice(0, 10) : '')
      setStatus(initialGoal.status || 'not_started')
      setMilestones(initialGoal.milestones || [])
      setShowAdvanced(Boolean(initialGoal.estimatedHours || initialGoal.deadline || initialGoal.description))
    } else {
      setTitle('')
      setCategory('personal')
      setPriority('medium')
      setTargetType('number')
      setTargetValue(1)
      setCurrentValue(0)
      setUnit('')
      setWhy('')
      setDescription('')
      setEstimatedHours('')
      setDeadline('')
      setStatus('not_started')
      setMilestones([])
      setShowAdvanced(false)
    }
    setError('')
    setNewMilestoneInput('')
  }, [initialGoal, isOpen])

  if (!isOpen) return null

  const handleAddMilestone = (e) => {
    e?.preventDefault()
    const trimmed = newMilestoneInput.trim()
    if (!trimmed) return
    setMilestones([...milestones, { title: trimmed, completed: false }])
    setNewMilestoneInput('')
  }

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please enter a goal title')
      return
    }

    setSubmitting(true)
    setError('')

    const payload = {
      title: trimmedTitle,
      project: projectId || null,
      category,
      priority,
      targetType,
      targetValue: targetType === 'binary' ? 1 : Number(targetValue) || 1,
      currentValue: Number(currentValue) || 0,
      unit: targetType === 'binary' ? '' : unit.trim(),
      why: why.trim(),
      description: description.trim(),
      status,
      year: initialGoal?.year || year,
      month: initialGoal?.month || month,
    }

    if (estimatedHours !== '') {
      payload.estimatedHours = Number(estimatedHours)
    }

    if (deadline) {
      payload.deadline = new Date(deadline).toISOString()
    }

    // Include milestones only on creation or if present
    if (!isEdit && milestones.length > 0) {
      payload.milestones = milestones.map(m => ({ title: m.title, completed: Boolean(m.completed) }))
    }

    try {
      await onSubmit(payload, initialGoal?._id)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save goal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="goal-form-heading" busy={submitting}>
      <div className="modal-card-custom modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="modal-icon-badge">
              <Target size={18} />
            </span>
            <h2 id="goal-form-heading" className="modal-title-custom mb-0">
              {isEdit ? 'Edit Monthly Goal' : 'Create Monthly Goal'}
            </h2>
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
          <div className="modal-body-custom max-h-modal">
            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="mb-3">
              <label className="form-label small fw-semibold" htmlFor="goal-form-title">
                Goal Title <span className="text-danger">*</span>
              </label>
              <input id="goal-form-title"
                type="text"
                className="form-control"
                placeholder="What outcome do you want to accomplish this month?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                autoFocus
              />
            </div>

            <ProjectSelect value={projectId} onChange={setProjectId} />

            {/* Why This Matters */}
            <div className="mb-3">
              <label className="form-label small fw-semibold" htmlFor="goal-form-why">
                Why does this matter?
              </label>
              <input id="goal-form-why"
                type="text"
                className="form-control"
                placeholder="Connect this to your deeper motivation or identity"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
              />
            </div>

            {/* Category & Priority Row */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold" htmlFor="goal-form-category">Category</label>
                <select id="goal-form-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold" htmlFor="goal-form-priority">Priority</label>
                <select id="goal-form-priority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Type & Target Value */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold" htmlFor="goal-form-targetType">Target Type</label>
                <select id="goal-form-targetType"
                  className="form-select"
                  value={targetType}
                  onChange={(e) => {
                    const nextType = e.target.value
                    setTargetType(nextType)
                    if (nextType === 'binary') {
                      setTargetValue(1)
                      setUnit('')
                    } else if (nextType === 'percentage') {
                      setTargetValue(100)
                      setUnit('%')
                    } else if (nextType === 'hours') {
                      setUnit('hours')
                    }
                  }}
                >
                  {TARGET_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {targetType !== 'binary' && (
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold" htmlFor="goal-form-targetValue">Target Value</label>
                  <div className="input-group">
                    <input id="goal-form-targetValue"
                      type="number"
                      step="any"
                      min="0.1"
                      className="form-control"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      required
                    />
                    {targetType !== 'percentage' && (
                      <input id="goal-form-unit" aria-label="Unit"
                        type="text"
                        className="form-control"
                        placeholder="Unit (e.g. sessions)"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status (especially in edit mode) */}
            {isEdit && (
              <div className="row g-2 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold" htmlFor="goal-form-status">Status</label>
                  <select id="goal-form-status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold" htmlFor="goal-form-currentValue">Current Value</label>
                  <input id="goal-form-currentValue"
                    type="number"
                    step="any"
                    min="0"
                    className="form-control"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Milestones (for new goals) */}
            {!isEdit && (
              <div className="mb-3">
                <label className="form-label small fw-semibold d-flex justify-content-between" htmlFor="goal-form-newMilestoneInput">
                  <span>Initial Milestones (optional)</span>
                  <span className="text-muted fw-normal">Break down into steps</span>
                </label>
                
                {milestones.length > 0 && (
                  <ul className="list-unstyled mb-2">
                    {milestones.map((m, idx) => (
                      <li key={idx} className="d-flex align-items-center justify-content-between p-1.5 px-2 bg-light rounded mb-1 text-sm">
                        <span>{m.title}</span>
                        <button
                          type="button"
                          className="btn btn-link btn-xs text-muted p-0"
                          aria-label={`Remove milestone: ${m.title}`}
                          onClick={() => handleRemoveMilestone(idx)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex gap-2">
                  <input id="goal-form-newMilestoneInput"
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Finish draft outline..."
                    value={newMilestoneInput}
                    onChange={(e) => setNewMilestoneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddMilestone()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleAddMilestone}
                    disabled={!newMilestoneInput.trim()}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Advanced / More Options */}
            <div className="mb-2">
              <button
                type="button"
                className="btn btn-link btn-xs p-0 text-decoration-none text-muted d-inline-flex align-items-center gap-2"
                aria-expanded={showAdvanced}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <Minus size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                <span>{showAdvanced ? 'Hide additional options' : 'Additional options (hours, deadline, notes)'}</span>
              </button>
            </div>

            {showAdvanced && (
              <div className="advanced-options-card p-3 rounded mb-2 border">
                <div className="row g-2 mb-2">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold" htmlFor="goal-form-estimatedHours">Estimated Hours</label>
                    <input id="goal-form-estimatedHours"
                      type="number"
                      min="0"
                      step="0.5"
                      className="form-control form-control-sm"
                      placeholder="e.g. 15"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold" htmlFor="goal-form-deadline">Target Deadline</label>
                    <input id="goal-form-deadline"
                      type="date"
                      className="form-control form-control-sm"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label small fw-semibold" htmlFor="goal-form-description">Detailed Notes</label>
                  <textarea id="goal-form-description"
                    rows={2}
                    className="form-control form-control-sm"
                    placeholder="Specific success criteria or implementation details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
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
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
              disabled={submitting || !title.trim()}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEdit ? 'Update Goal' : 'Create Goal'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default MonthlyGoalForm
