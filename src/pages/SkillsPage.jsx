import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import skillService from '../services/skill.service'
import { formatApiError } from '../utils/formatApiError'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'

const LEVELS = ['beginner','foundational','intermediate','advanced','expert']
const STATUSES = ['active','paused','mastered','archived']
const CATEGORIES = ['technical','design','business','communication','academic','creative','personal','other']
const SESSION_TYPES = ['study','practice','course','tutorial','reading','project_application','review','other']

export default function SkillsPage() {
  const [skills, setSkills] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)
  const request = useRef(0)

  const load = useCallback(async () => {
    const current = ++request.current
    setLoading(true); setError('')
    try {
      const res = await skillService.getSkills(filter ? { status: filter } : {})
      if (current !== request.current) return
      setSkills(res.data?.skills || res.skills || [])
    } catch (e) { if (current !== request.current) return; setError(formatApiError(e)) }
    finally { if (current === request.current) setLoading(false) }
  }, [filter])

  useEffect(() => { load() }, [load])

  const openDetails = async (s) => {
    setSelected(s._id)
    setDetails(null)
    try {
      const [sr, st, ss] = await Promise.all([
        skillService.getSkill(s._id),
        skillService.getStats(s._id).catch(()=>null),
        skillService.getSessions(s._id, { limit: 20 }).catch(()=>null),
      ])
      setDetails({ skill: sr.data?.skill || sr.skill, stats: st?.data || st, sessions: ss?.data || ss })
    } catch (e) { setError(formatApiError(e)) }
  }

  const handleCreate = async (data) => {
    await skillService.createSkill(data)
    setCreating(false)
    await load()
  }

  const handleStatus = async (id, action) => {
    if (action === 'pause') await skillService.updateSkill(id, { status: 'paused' })
    else if (action === 'resume') await skillService.updateSkill(id, { status: 'active' })
    else if (action === 'master') await skillService.masterSkill(id)
    else if (action === 'archive') await skillService.archiveSkill(id)
    await load()
    if (selected === id) openDetails(skills.find(x=>x._id===id))
  }

  const handleCreateSession = async (skillId, data) => {
    await skillService.createSession(skillId, data)
    if (selected === skillId) openDetails(skills.find(x=>x._id===skillId))
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <span className="section-eyebrow">LEARNING</span>
          <h1>Skills & Learning<span className="heading-period">.</span></h1>
          <p>Build valuable skills through deliberate practice and consistent learning.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={16}/> Add Skill</button>
      </header>

      <div className="mb-3">
        {['','active','paused','mastered','archived'].map(f => (
          <button key={f} className={`btn btn-sm me-2 ${filter===f?'btn-primary':'btn-outline-secondary'}`} onClick={()=>setFilter(f)}>
            {f||'All'}
          </button>
        ))}
      </div>

      {loading ? <DashboardSkeleton /> : error ? (
        <div className="alert alert-danger">{error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            {(skills||[]).length === 0 ? (
              <div className="text-center p-4">No skills tracked yet. <button className="btn btn-link" onClick={()=>setCreating(true)}>Add your first skill</button></div>
            ) : (skills||[]).map(s => (
              <div key={s._id} className={`card mb-2 ${selected===s._id?'border-primary':''}`} style={{cursor:'pointer'}} onClick={()=>openDetails(s)}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <strong>{s.name}</strong>
                    <span className="badge bg-secondary">{s.status}</span>
                  </div>
                  <small className="text-muted">{s.category} • {s.currentLevel} → {s.targetLevel||'—'}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 col-lg-7">
            {details ? (
              <div className="card">
                <div className="card-body">
                  <h5>{details.skill.name}</h5>
                  <p className="text-muted">{details.skill.description}</p>
                  <div><strong>Category:</strong> {details.skill.category}</div>
                  <div><strong>Level:</strong> {details.skill.currentLevel} → {details.skill.targetLevel||'—'}</div>
                  <div><strong>Status:</strong> {details.skill.status}</div>
                  {details.stats && <div className="mt-3"><h6>Stats</h6><pre style={{fontSize:12}}>{JSON.stringify(details.stats,null,2)}</pre></div>}
                  {details.sessions && (
                    <div className="mt-3">
                      <h6>Sessions</h6>
                      {(details.sessions.sessions||details.sessions.learningSessions||[]).map(l=>(
                        <div key={l._id||l.id}>{new Date(l.date).toLocaleDateString()} — {l.title} ({l.sessionType}) {l.durationMinutes?`${l.durationMinutes}m`:''}</div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <LearningSessionForm skillId={details.skill._id} onSubmit={handleCreateSession} />
                  </div>
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    {details.skill.status==='active' && <button className="btn btn-sm btn-outline-secondary" onClick={()=>handleStatus(details.skill._id,'pause')}>Pause</button>}
                    {details.skill.status==='paused' && <button className="btn btn-sm btn-outline-secondary" onClick={()=>handleStatus(details.skill._id,'resume')}>Resume</button>}
                    <button className="btn btn-sm btn-outline-secondary" onClick={()=>handleStatus(details.skill._id,'master')}>Master</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleStatus(details.skill._id,'archive')}>Archive</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted p-4">Select a Skill to view details.</div>
            )}
          </div>
        </div>
      )}

      {creating && (
        <div className="modal show d-block" tabIndex="-1" style={{background:'rgba(0,0,0,.4)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Skill</h5>
                <button type="button" className="btn-close" onClick={()=>setCreating(false)}></button>
              </div>
              <SkillForm goals={[]} onClose={()=>setCreating(false)} onSubmit={handleCreate} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SkillForm({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [targetLevel, setTargetLevel] = useState('')
  const [startedAt, setStartedAt] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setErr('Name required'); return }
    setSubmitting(true); setErr('')
    try {
      await onSubmit({ name: name.trim(), category, currentLevel, targetLevel: targetLevel||undefined, startedAt: startedAt||undefined, targetDate: targetDate||undefined, description, notes })
      onClose()
    } catch (e) { setErr(formatApiError(e)) }
    finally { setSubmitting(false) }
  }
  return (
    <form onSubmit={submit}>
      <div className="modal-body">
        {err && <div className="alert alert-danger">{err}</div>}
        <div className="mb-2"><label className="form-label">Name</label><input className="form-control" value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div className="mb-2"><label className="form-label">Category</label><select className="form-select" value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="mb-2"><label className="form-label">Current level</label><select className="form-select" value={currentLevel} onChange={e=>setCurrentLevel(e.target.value)}>{LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
        <div className="mb-2"><label className="form-label">Target level</label><select className="form-select" value={targetLevel} onChange={e=>setTargetLevel(e.target.value)}><option value="">None</option>{LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
        <div className="mb-2"><label className="form-label">Started at</label><input type="date" className="form-control" value={startedAt} onChange={e=>setStartedAt(e.target.value)} /></div>
        <div className="mb-2"><label className="form-label">Target date</label><input type="date" className="form-control" value={targetDate} onChange={e=>setTargetDate(e.target.value)} /></div>
        <div className="mb-2"><label className="form-label">Description</label><textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div className="mb-2"><label className="form-label">Notes</label><textarea className="form-control" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Saving...':'Save'}</button>
      </div>
    </form>
  )
}

function LearningSessionForm({ skillId, onSubmit }) {
  const [title, setTitle] = useState('')
  const [sessionType, setSessionType] = useState('study')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [durationMinutes, setDurationMinutes] = useState('')
  const [topics, setTopics] = useState('')
  const [takeaway, setTakeaway] = useState('')
  const [confidenceBefore, setConfidenceBefore] = useState('')
  const [confidenceAfter, setConfidenceAfter] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setErr('Title required'); return }
    setSubmitting(true); setErr('')
    try {
      await onSubmit(skillId, {
        title: title.trim(),
        sessionType,
        date,
        durationMinutes: durationMinutes? Number(durationMinutes): undefined,
        topics: topics? topics.split(',').map(t=>t.trim()).filter(Boolean): undefined,
        takeaway: takeaway||undefined,
        confidenceBefore: confidenceBefore? Number(confidenceBefore): undefined,
        confidenceAfter: confidenceAfter? Number(confidenceAfter): undefined,
        difficulty: difficulty? Number(difficulty): undefined,
      })
      setTitle(''); setTakeaway('')
    } catch (e) { setErr(formatApiError(e)) }
    finally { setSubmitting(false) }
  }
  return (
    <form onSubmit={submit} className="border rounded p-2">
      <h6>Log Learning Session</h6>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <div className="mb-2"><label className="form-label">Title</label><input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
      <div className="row g-2">
        <div className="col"><label className="form-label">Type</label><select className="form-select" value={sessionType} onChange={e=>setSessionType(e.target.value)}>{SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div className="col"><label className="form-label">Date</label><input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="col"><label className="form-label">Minutes</label><input type="number" min="0" className="form-control" value={durationMinutes} onChange={e=>setDurationMinutes(e.target.value)} /></div>
      </div>
      <div className="mb-2"><label className="form-label">Topics (comma separated)</label><input className="form-control" value={topics} onChange={e=>setTopics(e.target.value)} /></div>
      <div className="mb-2"><label className="form-label">Takeaway</label><textarea className="form-control" value={takeaway} onChange={e=>setTakeaway(e.target.value)} /></div>
      <div className="row g-2">
        <div className="col"><label className="form-label">Confidence before (1-5)</label><input type="number" min="1" max="5" className="form-control" value={confidenceBefore} onChange={e=>setConfidenceBefore(e.target.value)} /></div>
        <div className="col"><label className="form-label">Confidence after (1-5)</label><input type="number" min="1" max="5" className="form-control" value={confidenceAfter} onChange={e=>setConfidenceAfter(e.target.value)} /></div>
        <div className="col"><label className="form-label">Difficulty (1-5)</label><input type="number" min="1" max="5" className="form-control" value={difficulty} onChange={e=>setDifficulty(e.target.value)} /></div>
      </div>
      <button type="submit" className="btn btn-primary btn-sm mt-2" disabled={submitting}>{submitting?'Logging...':'Log Session'}</button>
    </form>
  )
}