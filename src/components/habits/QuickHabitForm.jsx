import React, { useState } from 'react'
import habitService from '../../services/habit.service'
import { formatApiError } from '../../utils/formatApiError'

const SCHEDULES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
]

const QuickHabitForm = ({ onCreated }) => {
  const [name, setName] = useState('')
  const [scheduleType, setScheduleType] = useState('daily')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const today = new Date().toISOString().split('T')[0]
      await habitService.createHabit({
        name: name.trim(),
        schedule: { scheduleType },
        targetType: 'binary',
        startDate: today,
      })
      setName('')
      setOpen(false)
      if (onCreated) onCreated()
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => setOpen(true)}>
        + New habit
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="mt-2">
      {error && <div className="alert alert-danger py-1" role="alert">{error}</div>}
      <div className="d-flex gap-2 flex-wrap">
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name (e.g. Read Qur'an)"
          aria-label="New habit name"
          maxLength={100}
          style={{ minWidth: 180, flex: 2 }}
        />
        <select
          className="form-select"
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
          aria-label="Schedule"
          style={{ maxWidth: 140 }}
        >
          {SCHEDULES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !name.trim()}>
          {saving ? 'Adding…' : 'Add'}
        </button>
        <button type="button" className="btn btn-link btn-sm" onClick={() => { setOpen(false); setError('') }}>Cancel</button>
      </div>
      <small className="text-muted">Creates a simple daily check-off habit. Fine-tune it any time under Manage habits.</small>
    </form>
  )
}

export default QuickHabitForm
