import React, { useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { applyServiceWorkerUpdate, onServiceWorkerUpdate } from '../../pwa/registerServiceWorker'

const UpdateNotice = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    onServiceWorkerUpdate(() => setVisible(true))
  }, [])

  if (!visible) return null

  return (
    <div
      className="alert alert-info d-flex align-items-center gap-2 mb-3"
      role="status"
      aria-live="polite"
    >
      <RefreshCw size={17} aria-hidden="true" />
      <span className="flex-grow-1">A new version of JourneyLog is available.</span>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={applyServiceWorkerUpdate}
      >
        Update
      </button>
      <button
        type="button"
        className="btn btn-link btn-sm text-muted"
        onClick={() => setVisible(false)}
        aria-label="Dismiss update notice"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default UpdateNotice
