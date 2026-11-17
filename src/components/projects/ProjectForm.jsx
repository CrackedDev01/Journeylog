import React, { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import Modal from '../common/Modal'
import { formatApiError } from '../../utils/formatApiError'
import { PRIORITIES, CATEGORIES, label, dateInput } from './projectHelpers'
export default function ProjectForm({ project, onSave, onClose }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [advanced, setAdvanced] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(event.currentTarget))
    data.name = data.name.trim()
    data.objective = data.objective.trim()
    if (!data.name) {
      setError('Enter a project name.')
      return
    }
    for (const key of ['startDate', 'targetDate']) data[key] = data[key] || null
    if (data.estimatedHours === '') data.estimatedHours = null
    else if (data.estimatedHours !== undefined)
      data.estimatedHours = Number(data.estimatedHours)
    if (data.startDate && data.targetDate && data.targetDate < data.startDate) {
      setError('The target date must be on or after the start date.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSave(data, project?._id)
      onClose()
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal
      onClose={onClose}
      labelledBy="project-form-title"
      busy={busy}
      className="project-form-dialog"
    >
      <div className="project-dialog-content">
        <header className="project-dialog-header">
          <div>
            <span className="section-eyebrow">LARGER OUTCOMES</span>
            <h2 id="project-form-title">
              {project ? 'Edit project' : 'New project'}
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close project form"
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <fieldset disabled={busy} className="project-form-fields">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <label htmlFor="project-name">
              Project name <span aria-hidden="true">*</span>
            </label>
            <input
              id="project-name"
              name="name"
              className="form-control"
              defaultValue={project?.name || ''}
              maxLength={200}
              required
              autoFocus
              placeholder="e.g. JourneyLog Private Beta"
            />
            <label htmlFor="project-objective">
              What does finishing this project mean?
            </label>
            <textarea
              id="project-objective"
              name="objective"
              className="form-control"
              rows={3}
              maxLength={500}
              defaultValue={project?.objective || ''}
              placeholder="Describe the outcome you want to achieve."
            />
            <div className="project-form-row">
              <div>
                <label htmlFor="project-priority">Priority</label>
                <select
                  id="project-priority"
                  name="priority"
                  className="form-select"
                  defaultValue={project?.priority || 'medium'}
                >
                  {Object.entries(PRIORITIES).map(([key, text]) => (
                    <option key={key} value={key}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="project-target">Target date</label>
                <input
                  id="project-target"
                  name="targetDate"
                  type="date"
                  className="form-control"
                  defaultValue={dateInput(project?.targetDate)}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-link project-advanced-toggle"
              aria-expanded={advanced}
              onClick={() => setAdvanced(!advanced)}
            >
              <ChevronDown size={16} />
              {advanced ? 'Hide additional details' : 'Additional details'}
            </button>
            <div hidden={!advanced}>
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                name="description"
                className="form-control"
                rows={3}
                maxLength={1000}
                defaultValue={project?.description || ''}
              />
              <div className="project-form-row">
                <div>
                  <label htmlFor="project-category">Category</label>
                  <select
                    id="project-category"
                    name="category"
                    className="form-select"
                    defaultValue={project?.category || 'project'}
                  >
                    {CATEGORIES.map((key) => (
                      <option key={key} value={key}>
                        {label(key)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="project-estimate">Estimated hours</label>
                  <input
                    id="project-estimate"
                    name="estimatedHours"
                    type="number"
                    min="0"
                    step="any"
                    className="form-control"
                    defaultValue={project?.estimatedHours ?? ''}
                  />
                </div>
              </div>
              <label htmlFor="project-start">Start date</label>
              <input
                id="project-start"
                name="startDate"
                type="date"
                className="form-control"
                defaultValue={dateInput(project?.startDate)}
              />
              <label htmlFor="project-notes">Notes</label>
              <textarea
                id="project-notes"
                name="notes"
                className="form-control"
                rows={3}
                maxLength={2000}
                defaultValue={project?.notes || ''}
              />
            </div>
          </fieldset>
          <footer className="project-dialog-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : project ? 'Save project' : 'Create project'}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  )
}
