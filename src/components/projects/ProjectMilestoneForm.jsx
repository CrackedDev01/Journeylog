import React, { useState } from 'react'
import { X } from 'lucide-react'
import Modal from '../common/Modal'
import { dateInput, MILESTONE_STATUSES } from './projectHelpers'
import { formatApiError } from '../../utils/formatApiError'
export default function ProjectMilestoneForm({
  milestone,
  nextOrder,
  onSave,
  onClose,
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(event.currentTarget))
    data.title = data.title.trim()
    data.order = Number(data.order)
    data.targetDate = data.targetDate || null
    if (!data.title) {
      setError('Enter a milestone title.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSave(data, milestone?._id)
      onClose()
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal
      labelledBy="milestone-form-heading"
      onClose={onClose}
      busy={busy}
      className="project-form-dialog"
    >
      <div className="project-dialog-content">
        <header className="project-dialog-header">
          <h2 id="milestone-form-heading">
            {milestone ? 'Edit milestone' : 'Add milestone'}
          </h2>
          <button
            className="icon-button"
            aria-label="Close milestone form"
            onClick={onClose}
            disabled={busy}
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <fieldset className="project-form-fields" disabled={busy}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <label htmlFor="pm-title">Milestone title</label>
            <input
              id="pm-title"
              name="title"
              className="form-control"
              required
              maxLength={200}
              autoFocus
              defaultValue={milestone?.title || ''}
            />
            <label htmlFor="pm-description">Description</label>
            <textarea
              id="pm-description"
              name="description"
              className="form-control"
              rows={3}
              maxLength={1000}
              defaultValue={milestone?.description || ''}
            />
            <div className="project-form-row">
              <div>
                <label htmlFor="pm-status">Status</label>
                <select
                  id="pm-status"
                  name="status"
                  className="form-select"
                  defaultValue={milestone?.status || 'planned'}
                >
                  {Object.entries(MILESTONE_STATUSES).map(([key, text]) => (
                    <option key={key} value={key}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pm-date">Target date</label>
                <input
                  id="pm-date"
                  type="date"
                  name="targetDate"
                  className="form-control"
                  defaultValue={dateInput(milestone?.targetDate)}
                />
              </div>
            </div>
            <label htmlFor="pm-order">Order</label>
            <input
              id="pm-order"
              name="order"
              type="number"
              step="1"
              className="form-control"
              defaultValue={milestone?.order ?? nextOrder}
            />
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
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save milestone'}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  )
}
