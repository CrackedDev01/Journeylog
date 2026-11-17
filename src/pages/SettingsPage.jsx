import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/auth.service'
import accountService from '../services/account.service'
import { formatApiError } from '../utils/formatApiError'

const COMMON_TIMEZONES = [
  'Africa/Lagos', 'Africa/Cairo', 'Africa/Nairobi', 'Africa/Accra',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore',
]

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('profile')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportErr, setExportErr] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteErr, setDeleteErr] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setTimezone(user.timezone || 'Africa/Lagos')
    }
  }, [user])

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true); setProfileMsg(''); setProfileErr('')
    try {
      await authService.updateProfile({ name: name.trim(), timezone })
      await refreshUser()
      setProfileMsg('Profile updated.')
    } catch (err) { setProfileErr(formatApiError(err)) }
    finally { setSaving(false) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwMsg(''); setPwErr('')
    if (newPassword !== confirmPassword) { setPwErr('New passwords do not match.'); return }
    if (newPassword.trim().length < 8) { setPwErr('New password must be at least 8 characters.'); return }
    setPwSaving(true)
    try {
      await authService.changePassword({ currentPassword, newPassword })
      setPwMsg('Password changed. Your existing sessions remain signed in.')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) { setPwErr(formatApiError(err)) }
    finally { setPwSaving(false) }
  }

  const handleExport = async () => {
    setExporting(true); setExportErr('')
    try {
      const blob = await accountService.exportData()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `journeylog-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) { setExportErr(formatApiError(err)) }
    finally { setExporting(false) }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setDeleteErr('')
    if (deleteConfirm !== 'DELETE') { setDeleteErr('Please type DELETE to confirm.'); return }
    setDeleting(true)
    try {
      await accountService.deleteAccount({ currentPassword: deletePassword, confirmation: deleteConfirm })
      setDeletePassword('')
      logout()
      navigate('/login', { replace: true })
    } catch (err) { setDeleteErr(formatApiError(err)) }
    finally { setDeleting(false) }
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <span className="section-eyebrow">YOUR ACCOUNT</span>
          <h1>Settings<span className="heading-period">.</span></h1>
          <p>Manage your profile, preferences, and account security.</p>
        </div>
      </header>

      <div className="mb-3">
        {['profile', 'security', 'data'].map(s => (
          <button key={s} type="button" className={`btn btn-sm me-2 ${section === s ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSection(s)}>
            {s === 'profile' ? 'Profile' : s === 'security' ? 'Security' : 'Data & Account'}
          </button>
        ))}
      </div>

      {section === 'profile' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="card-body">
            <h5>Profile</h5>
            {profileMsg && <div className="alert alert-success">{profileMsg}</div>}
            {profileErr && <div className="alert alert-danger">{profileErr}</div>}
            <form onSubmit={saveProfile}>
              <div className="mb-2">
                <label className="form-label" htmlFor="settings-name">Name</label>
                <input id="settings-name" className="form-control" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={50} />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="settings-email">Email</label>
                <input id="settings-email" className="form-control" value={user?.email || ''} disabled readOnly />
                <small className="text-muted">Email changes are not supported; contact support if you need to change it.</small>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="settings-timezone">Timezone</label>
                <select id="settings-timezone" className="form-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                  {!COMMON_TIMEZONES.includes(timezone) && <option value={timezone}>{timezone}</option>}
                  {COMMON_TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
            </form>
          </div>
        </div>
      )}

      {section === 'security' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="card-body">
            <h5>Security</h5>
            {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
            {pwErr && <div className="alert alert-danger">{pwErr}</div>}
            <form onSubmit={savePassword}>
              <div className="mb-2">
                <label className="form-label" htmlFor="pw-current">Current password</label>
                <input id="pw-current" type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="pw-new">New password</label>
                <input id="pw-new" type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="pw-confirm">Confirm new password</label>
                <input id="pw-confirm" type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={pwSaving}>{pwSaving ? 'Changing…' : 'Change password'}</button>
            </form>
            <hr />
            <p className="text-muted small mb-2">Sign out removes the stored token on this device. The backend uses stateless JWTs, so there is no server-side session list to manage.</p>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { logout() }}>Sign out</button>
          </div>
        </div>
      )}

      {section === 'data' && (
        <div style={{ maxWidth: 560 }}>
          <div className="card mb-3">
            <div className="card-body">
              <h5>Export My Data</h5>
              <p className="text-muted">Download a copy of your personal JourneyLog data as a JSON file.</p>
              {exportErr && <div className="alert alert-danger">{exportErr}</div>}
              <button type="button" className="btn btn-outline-primary" disabled={exporting} onClick={handleExport}>
                {exporting ? 'Preparing export…' : 'Export My Data'}
              </button>
            </div>
          </div>
          <div className="card border-danger">
            <div className="card-body">
              <h5 className="text-danger">Delete My Account</h5>
              <p className="text-muted">Permanently removes your account and all associated personal records. This cannot be undone.</p>
              {!confirmingDelete ? (
                <button type="button" className="btn btn-outline-danger" onClick={() => setConfirmingDelete(true)}>
                  Delete My Account
                </button>
              ) : (
                <form onSubmit={handleDelete}>
                  {deleteErr && <div className="alert alert-danger">{deleteErr}</div>}
                  <div className="mb-2">
                    <label className="form-label" htmlFor="del-confirm">Type DELETE to confirm</label>
                    <input id="del-confirm" className="form-control" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" autoComplete="off" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="del-password">Current password</label>
                    <input id="del-password" type="password" className="form-control" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} required autoComplete="current-password" />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" disabled={deleting} onClick={() => { setConfirmingDelete(false); setDeleteErr('') }}>Cancel</button>
                    <button type="submit" className="btn btn-danger" disabled={deleting || deleteConfirm !== 'DELETE'}>
                      {deleting ? 'Deleting…' : 'Permanently delete my account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
