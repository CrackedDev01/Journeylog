import React, { useState } from 'react'
import Modal from './Modal'
import { formatApiError } from '../../utils/formatApiError'
export default function ConfirmDialog({
  title,
  description,
  label = 'Confirm',
  action,
  onClose,
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const confirm = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const result = await action()
      if (result !== false) onClose()
      else setError('Unable to save this change. Please try again.')
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal labelledBy="confirm-heading" onClose={onClose} busy={busy}>
      <div className="confirm-dialog">
        <h2 id="confirm-heading">{title}</h2>
        <p>{description}</p>
        {error && (
          <p className="text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="project-dialog-footer">
          <button
            className="btn btn-outline-secondary"
            autoFocus
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy} onClick={confirm}>
            {busy ? 'Saving…' : label}
          </button>
        </div>
      </div>
    </Modal>
  )
}
