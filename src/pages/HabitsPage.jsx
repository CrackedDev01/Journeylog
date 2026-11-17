import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, Repeat2 } from 'lucide-react'
import habitService from '../services/habit.service'
import goalService from '../services/goal.service'
import { formatApiError } from '../utils/formatApiError'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import '../styles/projects.css'

const CATEGORIES = ['personal','health','education','career','business','spiritual','finance','skill','other']
const SCHEDULES = ['daily','weekdays','weekends','specific_days','times_per_week']
const TARGETS = ['binary','count','duration','quantity']
const SKIP_REASONS = ['illness','travel','schedule_change','rest_day','forgot','lack_of_time','other']

export default function HabitsPage() {
  const [habits, setHabits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)
  const [goals, setGoals] = useState([])
  const request = useRef(0)

  const load = useCallback(async () => {
    const current = ++request.current
    setLoading(true); setError('')
    try {
      const res = await habitService.getHabits(filter ? { status: filter } : {})
      if (current !== request.current) return
      setHabits(res.data?.habits || res.habits || [])
    } catch (e) { if (current !== request.current) return; setError(formatApiError(e)) }
    finally { if (current === request.current) setLoading(false) }
  }, [filter])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    goalService.getGoals({ status: 'active' }).then(r => setGoals(r.data?.goals || r.goals || [])).catch(()=>{})
  }, [])

  const openDetails = async (h) => {
    setSelected(h._id)
    setDetails(null)
    try {
      const [hr, sr, hr2] = await Promise.all([
        habitService.getHabit(h._id),
        habitService.getStats(h._id).catch(()=>null),
        habitService.getHistory(h._id, { limit: 20 }).catch(()=>null),
      ])
      setDetails({ habit: hr.data?.habit || hr.habit, stats: sr?.data || sr, history: hr2?.data || hr2 })
    } catch (e) { setError(formatApiError(e)) }
  }

  const handleCreate = async (data) => {
    await habitService.createHabit(data)
    setCreating(false)
    await load()
  }

  const handleCheckIn = async (id, value) => {
    await habitService.checkIn(id, value)
    await load()
    if (selected === id) openDetails(habits.find(x=>x._id===id))
  }

  const handleSkip = async (id, reason, note) => {
    await habitService.skip(id, { skipReason: reason, note })
    await load()
    if (selected === id) openDetails(habits.find(x=>x._id===id))
  }

  const handleStatus = async (id, status) => {
    await habitService.updateHabit(id, { status })
    await load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete Habit permanently?')) return
    await habitService.deleteHabit(id)
    setSelected(null); setDetails(null)
    await load()
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <span className="section-eyebrow">SMALL PROMISES, KEPT OFTEN</span>
          <h1>Habits<span className="heading-period">.</span></h1>
          <p>Build consistency around the routines that matter.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={16}/> New Habit</button>
      </header>

      <div className="mb-3">
        {['','active','paused','archived'].map(f => (
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
            {(habits||[]).length === 0 ? (
              <div className="text-center p-4">No Habits yet. <button className="btn btn-link" onClick={()=>setCreating(true)}>Create Habit</button></div>
            ) : (habits||[]).map(h => (
              <div key={h._id} className={`card mb-2 ${selected===h._id?'border-primary':''}`} style={{cursor:'pointer'}} onClick={()=>openDetails(h)}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <strong>{h.name}</strong>
                    <span className="badge bg-secondary">{h.status}</span>
                  </div>
                  <small className="text-muted">{h.category} • {h.schedule?.scheduleType} • {h.targetType}{h.targetValue?` ${h.targetValue} ${h.unit||''}`:''}</small>
                  {h.linkedMonthlyGoal && <div><small>Goal linked</small></div>}
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 col-lg-7">
            {details ? (
              <div className="card">
                <div className="card-body">
                  <h5>{details.habit.name}</h5>
                  <p className="text-muted">{details.habit.description}</p>
                  <div><strong>Schedule:</strong> {details.habit.schedule?.scheduleType}</div>
                  <div><strong>Target:</strong> {details.habit.targetType} {details.habit.targetValue} {details.habit.unit}</div>
                  <div><strong>Status:</strong> {details.habit.status}</div>
                  {details.stats && (
                    <div className="mt-3">
                      <h6>Stats</h6>
                      <pre style={{fontSize:12}}>{JSON.stringify(details.stats, null, 2)}</pre>
                    </div>
                  )}
                  {details.history && (
                    <div className="mt-3">
                      <h6>History</h6>
                      {(details.history.logs||details.history.habitLogs||[]).map(l => (
                        <div key={l.id||l._id}>{new Date(l.date).toLocaleDateString()} — {l.status} {l.value!=null?`(${l.value})`:''} {l.skipReason?`[${l.skipReason}]`:''}</div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    <button className="btn btn-sm btn-success" onClick={()=>handleCheckIn(details.habit._id, details.habit.targetType==='binary'?{status:'completed'}:{value: details.habit.targetValue, status:'completed'})}>Check In</button>
                    <button className="btn btn-sm btn-warning" onClick={()=>handleSkip(details.habit._id, 'rest_day', '')}>Skip</button>
                    {details.habit.status==='active' && <button className="btn btn-sm btn-outline-secondary" onClick={()=>handleStatus(details.habit._id,'paused')}>Pause</button>}
                    {details.habit.status==='paused' && <button className="btn btn-sm btn-outline-secondary" onClick={()=>handleStatus(details.habit._id,'active')}>Resume</button>}
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(details.habit._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted p-4">Select a Habit to view details.</div>
            )}
          </div>
        </div>
      )}

      {creating && (
        <HabitFormModal goals={goals} onClose={()=>setCreating(false)} onSubmit={handleCreate} />
      )}
    </div>
  )
}

function HabitFormModal({ goals, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [scheduleType, setScheduleType] = useState('daily')
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const [timesPerWeek, setTimesPerWeek] = useState(3)
  const [targetType, setTargetType] = useState('binary')
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10))
  const [endDate, setEndDate] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [linkedMonthlyGoal, setLinkedMonthlyGoal] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setErr('Name required'); return }
    setSubmitting(true); setErr('')
    try {
      const data = {
        name: name.trim(),
        category,
        schedule: { scheduleType, daysOfWeek: scheduleType==='specific_days'? daysOfWeek : undefined, timesPerWeek: scheduleType==='times_per_week'? Number(timesPerWeek): undefined },
        targetType,
        targetValue: targetType!=='binary' ? Number(targetValue) : undefined,
        unit: targetType!=='binary' ? unit : undefined,
        startDate,
        endDate: endDate || undefined,
        reminderTime: reminderTime || undefined,
        linkedMonthlyGoal: linkedMonthlyGoal || undefined,
      }
      await onSubmit(data)
    } catch (e) { setErr(formatApiError(e)) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{background:'rgba(0,0,0,.4)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Habit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={submit}>
            <div className="modal-body">
              {err && <div className="alert alert-danger">{err}</div>}
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e=>setCategory(e.target.value)}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Schedule</label>
                <select className="form-select" value={scheduleType} onChange={e=>setScheduleType(e.target.value)}>
                  {SCHEDULES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {scheduleType==='specific_days' && (
                <div className="mb-2 d-flex gap-1 flex-wrap">
                  {[0,1,2,3,4,5,6].map(d => (
                    <button type="button" key={d} className={`btn btn-sm ${daysOfWeek.includes(d)?'btn-primary':'btn-outline-secondary'}`}
                      onClick={()=>setDaysOfWeek(daysOfWeek.includes(d)?daysOfWeek.filter(x=>x!==d):[...daysOfWeek,d])}>
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]}
                    </button>
                  ))}
                </div>
              )}
              {scheduleType==='times_per_week' && (
                <div className="mb-2">
                  <label className="form-label">Times per week</label>
                  <input type="number" min="1" max="7" className="form-control" value={timesPerWeek} onChange={e=>setTimesPerWeek(e.target.value)} />
                </div>
              )}
              <div className="mb-2">
                <label className="form-label">Target type</label>
                <select className="form-select" value={targetType} onChange={e=>setTargetType(e.target.value)}>
                  {TARGETS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {targetType!=='binary' && (
                <>
                  <div className="mb-2">
                    <label className="form-label">Target value</label>
                    <input type="number" min="0" className="form-control" value={targetValue} onChange={e=>setTargetValue(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Unit</label>
                    <input className="form-control" value={unit} onChange={e=>setUnit(e.target.value)} />
                  </div>
                </>
              )}
              <div className="mb-2">
                <label className="form-label">Start date</label>
                <input type="date" className="form-control" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="form-label">End date (optional)</label>
                <input type="date" className="form-control" value={endDate} onChange={e=>setEndDate(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Reminder time (optional)</label>
                <input type="time" className="form-control" value={reminderTime} onChange={e=>setReminderTime(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Linked Monthly Goal (optional)</label>
                <select className="form-select" value={linkedMonthlyGoal} onChange={e=>setLinkedMonthlyGoal(e.target.value)}>
                  <option value="">No Goal</option>
                  {goals.map(g=><option key={g._id} value={g._id}>{g.title||g.name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Creating...':'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
