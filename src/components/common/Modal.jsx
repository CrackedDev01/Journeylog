import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

// Native modal dialogs provide focus trapping, background isolation and Escape.
export default function Modal({ children, onClose, labelledBy, className = '', busy = false }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])
  return createPortal(
    <dialog ref={dialogRef} className={`modal-dialog-shell ${className}`} aria-labelledby={labelledBy} aria-busy={busy || undefined}
      onCancel={(event) => { event.preventDefault(); if (!busy) closeRef.current() }}
      onClick={(event) => { if (event.target === event.currentTarget && !busy) closeRef.current() }}>
      {children}
    </dialog>, document.body)
}
