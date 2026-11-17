import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCircle2, Circle, Clock3, Lightbulb, Play, Plus, Square, Target } from 'lucide-react'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import StreakBadge from '../components/common/StreakBadge'
import DailyReviewForm from '../components/reviews/DailyReviewForm'
import QuickHabitForm from '../components/habits/QuickHabitForm'
import dailyPlanService from '../services/dailyPlan.service'
import taskService from '../services/task.service'
import habitService from '../services/habit.service'
import workSessionService from '../services/workSession.service'
import dailyReviewService from '../services/dailyReview.service'
import { formatApiError } from '../utils/formatApiError'
import { formatDate } from '../utils/dateFormat'

const PRIORITIES = [
  { value: 'must_do', label: 'Must Do' },
  { value: 'important', label: 'Important' },
  { value: 'optional', label: 'Optional' },
]

const unwrapList = (res, keys) => {
  const data = res?.data ?? res
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

export default function TodayPage() {
  const [plan, setPlan] = useState(null)
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [focusDraft, setFocusDraft] = useState('')
  const [editingFocus, setEditingFocus] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('important')
  const [busy, setBusy] = useState(false)
  const [sessionTitle, setSessionTitle] = useState('')
  const [taskTime, setTaskTime] = useState({})
  const [streakKey, setStreakKey] = useState(0)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const request = useRef(0)

  const load = useCallback(async () => {
    const current = ++request.current
    setLoading(true)
    setError('')
    setNotice('')
    const results = await Promise.allSettled([
      dailyPlanService.getTodayPlan().catch((e) => { if (e?.response?.status === 404) return null; throw e }),
      taskService.getTodayTasks(),
      habitService.getTodayHabits(),
      workSessionService.getTodaySessions().catch(() => null),
      workSessionService.getActiveSession().catch(() => null),
      dailyReviewService.getToday().catch(() => null),
    ])
    if (current !== request.current) return
    const [planRes, tasksRes, habitsRes, sessionsRes, activeRes, reviewRes] = results
    if (planRes.status === 'fulfilled' && planRes.value) {
      const p = planRes.value?.data?.plan ?? planRes.value?.plan ?? null
      setPlan(p)
      setFocusDraft(p?.dailyFocus || '')
    }
    if (tasksRes.status === 'fulfilled') setTasks(unwrapList(tasksRes.value, ['tasks']))
    if (habitsRes.status === 'fulfilled') setHabits(unwrapList(habitsRes.value, ['habits']))
    if (sessionsRes.status === 'fulfilled' && sessionsRes.value) setSessions(unwrapList(sessionsRes.value, ['workSessions', 'sessions']))
    if (activeRes.status === 'fulfilled' && activeRes.value) {
      const raw = activeRes.value?.data?.workSession ?? activeRes.value?.workSession ?? activeRes.value?.data ?? null
      setActiveSession(raw && (raw._id || raw.id) ? raw : null)
    } else if (activeRes.status === 'fulfilled') {
      setActiveSession(null)
    }
    if (reviewRes.status === 'fulfilled' && reviewRes.value) {
      setReview(reviewRes.value?.data?.review ?? reviewRes.value?.review ?? null)
    }
    if (results.every((r) => r.status === 'rejected')) setError(formatApiError(results[0].reason))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    let active = true
    if (tasks.length === 0) return
    Promise.allSettled(tasks.map(async (task) => {
      const id = task._id || task.id
      try {
        const res = await workSessionService.getTaskWorkSummary(id)
        const summary = res?.data?.summary ?? res?.data ?? res
        if (active && summary && (summary.actualMinutes > 0 || summary.totalSessions > 0)) {
          setTaskTime((prev) => ({ ...prev, [id]: summary }))
        }
      } catch { /* per-task time is supplementary */ }
    }))
    return () => { active = false }
  }, [tasks])

  const runAction = async (fn, successMessage) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      if (successMessage) setNotice(successMessage)
      await load()
      setStreakKey((k) => k + 1)
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setBusy(false)
    }
  }

  const saveFocus = () => runAction(async () => {
    const todayStr = new Date().toISOString().split('T')[0]
    if (plan?._id) {
      await dailyPlanService.updatePlan(plan._id, { dailyFocus: focusDraft.trim() })
    } else {
      await dailyPlanService.createPlan({ date: todayStr, dailyFocus: focusDraft.trim() })
    }
    setEditingFocus(false)
  }, 'Focus saved.')

  const addTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const todayStr = new Date().toISOString().split('T')[0]
    const title = newTitle.trim()
    const priority = newPriority
    setNewTitle('')
    return runAction(() => taskService.createTask({ title, priority, date: todayStr }), 'Task added.')
  }

  const startSession = () => runAction(() => workSessionService.startSession(sessionTitle.trim() ? { title: sessionTitle.trim() } : {}), 'Work session started.')
  const stopSession = () => activeSession && runAction(() => workSessionService.stopSession(activeSession._id || activeSession.id), 'Work session stopped.')

  const checkInHabit = (habit) => {
    const targetType = habit.targetType || habit.target_type
    const payload = targetType === 'binary'
      ? { completed: true }
      : { value: habit.targetValue ?? habit.target_value ?? 1 }
    return runAction(() => habitService.checkIn(habit._id || habit.id, payload), 'Habit checked in.')
  }

  const grouped = { must_do: [], important: [], optional: [], other: [] }
  tasks.forEach((t) => {
    const key = grouped[t.priority] ? t.priority : 'other'
    grouped[key].push(t)
  })
  const done = tasks.filter((t) => t.status === 'completed').length

  return (
    <div className="dashboard-page container-fluid">
      <div className="dashboard-heading row align-items-end g-3">
        <div className="col">
          <span className="section-eyebrow">A FRESH PAGE</span>
          <h1>Today<span className="heading-period">.</span></h1>
          <p>{formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })} — decide what matters, then do it.</p>
        </div>
        <div className="col-auto"><StreakBadge refreshKey={streakKey} /></div>
      </div>

      {loading ? <DashboardSkeleton /> : (
        <>
          {error && <div className="alert alert-danger" role="alert">{error} <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}

          <section className="dashboard-panel focus-panel" aria-labelledby="today-focus">
            <div className="panel-heading"><div><span className="section-eyebrow">YOUR INTENTION</span><h2 id="today-focus">Today's focus</h2></div><span className="panel-icon"><Target size={19} /></span></div>
            {editingFocus ? (
              <form onSubmit={(e) => { e.preventDefault(); saveFocus() }} className="d-flex gap-2">
                <input className="form-control" value={focusDraft} onChange={(e) => setFocusDraft(e.target.value)} maxLength={200} placeholder="One clear intention for today" aria-label="Daily focus" />
                <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !focusDraft.trim()}>Save</button>
                <button type="button" className="btn btn-link btn-sm" onClick={() => { setEditingFocus(false); setFocusDraft(plan?.dailyFocus || '') }}>Cancel</button>
              </form>
            ) : plan?.dailyFocus ? (
              <div className="d-flex align-items-center gap-2"><p className="focus-quote mb-0 flex-grow-1">{plan.dailyFocus}</p><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingFocus(true)}>Edit</button></div>
            ) : (
              <div className="d-flex align-items-center gap-2"><p className="text-muted mb-0 flex-grow-1">No focus set yet.</p><button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setEditingFocus(true)}>Set focus</button></div>
            )}
          </section>

          <section className="dashboard-panel tasks-panel" aria-labelledby="today-tasks">
            <div className="panel-heading"><div><span className="section-eyebrow">ONE STEP AT A TIME</span><h2 id="today-tasks">Today's tasks ({done}/{tasks.length})</h2></div></div>
            <form onSubmit={addTask} className="d-flex gap-2 mb-3">
              <input className="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Add a task for today" aria-label="New task title" maxLength={200} />
              <select className="form-select" value={newPriority} onChange={(e) => setNewPriority(e.target.value)} aria-label="Priority" style={{ maxWidth: 140 }}>
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !newTitle.trim()}><Plus size={15} /> Add</button>
            </form>
            {tasks.length === 0 && <p className="text-muted">No tasks yet. Add your first must-do above.</p>}
            {PRIORITIES.concat({ value: 'other', label: 'Other' }).map(({ value, label }) => grouped[value].length > 0 && (
              <div key={value} className="mb-2">
                <h3 className="h6 text-muted">{label}</h3>
                {grouped[value].map((task) => {
                  const id = task._id || task.id
                  const isDone = task.status === 'completed'
                  const time = taskTime[id]
                  return (
                    <div className={`task-row${isDone ? ' task-done' : ''}`} key={id}>
                      <span className="task-status" aria-hidden="true">
                        {isDone ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                      </span>
                      <span className="flex-grow-1">{task.title}{time && <small className="text-muted d-block">{formatMinutes(time.actualMinutes ?? 0)} focused</small>}</span>
                      {!isDone && (
                        <button type="button" className="btn btn-outline-secondary btn-sm" disabled={busy || !!activeSession} title={activeSession ? 'Stop the active session first' : `Track time on ${task.title}`} onClick={() => runAction(() => workSessionService.startSession({ task: id }), `Timing ${task.title}.`)}>
                          <Play size={13} /> Track
                        </button>
                      )}
                      {!isDone && (
                        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => runAction(() => taskService.completeTask(id), 'Task completed.')}>
                          <Check size={14} /> Done
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </section>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <section className="dashboard-panel" aria-labelledby="today-habits">
                <div className="panel-heading"><div><span className="section-eyebrow">SMALL PROMISES</span><h2 id="today-habits">Habit check-ins</h2></div></div>
                {habits.length === 0 && <p className="text-muted mb-0">No habits due today. <Link to="/app/habits">Manage habits</Link></p>}
                {habits.map((habit) => {
                  const log = habit.todayLog || habit.today_log
                  const state = log?.status || 'pending'
                  return (
                    <div className="task-row" key={habit._id || habit.id}>
                      <span className="flex-grow-1">{habit.name} <small className="text-muted">({state})</small></span>
                      {state !== 'completed' && <button type="button" className="btn btn-outline-primary btn-sm" disabled={busy} onClick={() => checkInHabit(habit)}>Check in</button>}
                    </div>
                  )
                })}
                <QuickHabitForm onCreated={() => { load(); setStreakKey((k) => k + 1) }} />
              </section>
            </div>
            <div className="col-12 col-lg-6">
              <section className="dashboard-panel" aria-labelledby="today-work">
                <div className="panel-heading"><div><span className="section-eyebrow">DEEP WORK</span><h2 id="today-work">Work sessions</h2></div><span className="panel-icon"><Clock3 size={19} /></span></div>
                {activeSession ? (
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <p className="mb-0 flex-grow-1"><Play size={15} /> {activeSession.title || 'Active session'} — in progress</p>
                      <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={stopSession}><Square size={14} /> Stop</button>
                    </div>
                    <ElapsedTimer startedAt={activeSession.startedAt} />
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); startSession() }} className="d-flex gap-2">
                    <input className="form-control" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} placeholder="What are you working on? (optional)" aria-label="Work session title" maxLength={200} />
                    <button type="submit" className="btn btn-primary btn-sm" disabled={busy}><Play size={15} /> Start</button>
                  </form>
                )}
                {sessions.length > 0 && <p className="text-muted small mt-2 mb-0">{sessions.filter((s) => s.status === 'completed').length} session(s) completed today.</p>}
              </section>
            </div>
          </div>

          <section className="dashboard-panel" aria-labelledby="today-review">
            <div className="panel-heading"><div><span className="section-eyebrow">PAUSE AND NOTICE</span><h2 id="today-review">Daily review</h2></div><span className="panel-icon panel-icon-gold"><Lightbulb size={18} /></span></div>
            {review && !reviewFormOpen ? (
              <div>
                {review.mainWin && <p className="focus-quote mb-2">{review.mainWin}</p>}
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setReviewFormOpen(true)}>Edit review</button>
                  <Link to="/app/reviews" className="btn btn-link btn-sm">Open in Reviews</Link>
                </div>
              </div>
            ) : reviewFormOpen || !review ? (
              <DailyReviewForm
                existing={reviewFormOpen ? review : null}
                dailyPlanId={plan?._id}
                onSaved={(saved) => { setReview(saved); setReviewFormOpen(false); setStreakKey((k) => k + 1); setNotice('Review saved.') }}
              />
            ) : null}
            {reviewFormOpen && review && (
              <button type="button" className="btn btn-link btn-sm mt-2" onClick={() => setReviewFormOpen(false)}>Cancel</button>
            )}
            {!review && !reviewFormOpen && (
              <p className="text-muted small mt-2 mb-0">Or <Link to="/app/reviews">open past reviews</Link>.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

const ElapsedTimer = ({ startedAt }) => {
  const elapsedSeconds = useElapsedSeconds(startedAt)
  return (
    <p className="mt-2 mb-0" role="timer" aria-label={`Elapsed time ${formatElapsed(elapsedSeconds)}`}>
      <Clock3 size={14} className="me-1" />
      <strong>{formatElapsed(elapsedSeconds)}</strong> elapsed
    </p>
  )
}

const useElapsedSeconds = (startedAt) => {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  if (!startedAt) return 0
  return Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000))
}

const formatElapsed = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

const formatMinutes = (minutes) => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) return '0 min focused'
  if (minutes < 60) return `${minutes} min focused`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m focused` : `${hours}h focused`
}
