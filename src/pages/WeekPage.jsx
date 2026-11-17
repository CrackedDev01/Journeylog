import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Clock3, Plus } from 'lucide-react'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import weeklyPlanService from '../services/weeklyPlan.service'
import goalService from '../services/goal.service'
import weeklyReviewService from '../services/weeklyReview.service'
import { formatApiError } from '../utils/formatApiError'

export default function WeekPage() {
  const [plan, setPlan] = useState(null)
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [focusDraft, setFocusDraft] = useState('')
  const [editingFocus, setEditingFocus] = useState(false)
  const [commitTitle, setCommitTitle] = useState('')
  const [commitGoal, setCommitGoal] = useState('')
  const [commitPriority, setCommitPriority] = useState('medium')
  const [busy, setBusy] = useState(false)
  const request = useRef(0)

  const load = useCallback(async () => {
    const current = ++request.current
    setLoading(true)
    setError('')
    try {
      let currentPlan = null
      try {
        const res = await weeklyPlanService.getCurrentPlan()
        currentPlan = res?.data?.plan ?? res?.plan ?? null
      } catch (e) {
        if (e?.response?.status !== 404) throw e
      }
      if (current !== request.current) return
      setPlan(currentPlan)
      setFocusDraft(currentPlan?.weeklyFocus || '')
      if (currentPlan?._id) {
        try {
          const sumRes = await weeklyPlanService.getSummary(currentPlan._id)
          if (current === request.current) setSummary(sumRes?.data ?? sumRes)
        } catch { /* summary is supplementary */ }
      } else if (current === request.current) {
        setSummary(null)
      }
      const [goalsRes, reviewRes] = await Promise.allSettled([
        goalService.getGoals({ status: 'active' }),
        weeklyReviewService.getCurrent().catch((e) => { if (e?.response?.status === 404) return null; throw e }),
      ])
      if (current !== request.current) return
      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value?.data?.goals ?? goalsRes.value?.goals ?? [])
      if (reviewRes.status === 'fulfilled' && reviewRes.value) {
        setReview(reviewRes.value?.data?.review ?? reviewRes.value?.review ?? reviewRes.value?.data ?? null)
      }
    } catch (e) {
      if (current === request.current) setError(formatApiError(e))
    } finally {
      if (current === request.current) setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const runAction = async (fn, message) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      if (message) setNotice(message)
      await load()
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setBusy(false)
    }
  }

  const mondayOfThisWeek = () => {
    const now = new Date()
    const day = (now.getDay() + 6) % 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - day)
    return monday.toISOString().split('T')[0]
  }

  const ensurePlan = async () => {
    if (plan?._id) return plan
    const monday = mondayOfThisWeek()
    const sunday = new Date(monday)
    sunday.setDate(new Date(monday).getDate() + 6)
    const res = await weeklyPlanService.createPlan({
      weekStart: monday,
      weekEnd: sunday.toISOString().split('T')[0],
      weeklyFocus: focusDraft.trim() || 'Make this week count',
    })
    return res?.data?.plan ?? res?.plan
  }

  const saveFocus = () => runAction(async () => {
    if (!focusDraft.trim()) return
    const p = await ensurePlan()
    await weeklyPlanService.updatePlan(p._id, { weeklyFocus: focusDraft.trim() })
    setEditingFocus(false)
  }, 'Weekly focus saved.')

  const addCommitment = (e) => {
    e.preventDefault()
    if (!commitTitle.trim()) return
    const title = commitTitle.trim()
    const payload = { title, priority: commitPriority }
    if (commitGoal) payload.monthlyGoal = commitGoal
    setCommitTitle('')
    return runAction(async () => {
      const p = await ensurePlan()
      await weeklyPlanService.addCommitment(p._id, payload)
    }, 'Commitment added.')
  }

  const toggleCommitment = (commitment) => runAction(() =>
    weeklyPlanService.updateCommitment(plan._id, commitment._id, { completed: !commitment.completed }),
  )
  const removeCommitment = (commitment) => {
    if (!window.confirm(`Remove "${commitment.title}" from this week?`)) return Promise.resolve()
    return runAction(() => weeklyPlanService.removeCommitment(plan._id, commitment._id), 'Commitment removed.')
  }

  const commitments = plan?.commitments ?? []
  const goalName = (id) => goals.find((g) => (g._id || g.id) === String(id))?.title || 'Monthly goal'

  return (
    <div className="dashboard-page container-fluid">
      <div className="dashboard-heading row align-items-end g-3">
        <div className="col">
          <span className="section-eyebrow">THE BIGGER PICTURE</span>
          <h1>Week<span className="heading-period">.</span></h1>
          <p>Decide what this week should achieve, then track it through.</p>
        </div>
        <div className="col-auto"><span className="date-chip"><CalendarRange size={15} /> This week</span></div>
      </div>

      {loading ? <DashboardSkeleton /> : (
        <>
          {error && <div className="alert alert-danger" role="alert">{error} <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}

          <section className="dashboard-panel" aria-labelledby="week-focus">
            <div className="panel-heading"><div><span className="section-eyebrow">WEEKLY OUTCOME</span><h2 id="week-focus">Weekly focus</h2></div></div>
            {editingFocus || !plan ? (
              <form onSubmit={(e) => { e.preventDefault(); saveFocus() }} className="d-flex gap-2">
                <input className="form-control" value={focusDraft} onChange={(e) => setFocusDraft(e.target.value)} placeholder="What should this week achieve?" aria-label="Weekly focus" maxLength={200} />
                <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !focusDraft.trim()}>Save</button>
                {plan && <button type="button" className="btn btn-link btn-sm" onClick={() => { setEditingFocus(false); setFocusDraft(plan.weeklyFocus || '') }}>Cancel</button>}
              </form>
            ) : (
              <div className="d-flex align-items-center gap-2"><p className="focus-quote mb-0 flex-grow-1">{plan.weeklyFocus}</p><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingFocus(true)}>Edit</button></div>
            )}
          </section>

          <section className="dashboard-panel" aria-labelledby="week-commitments">
            <div className="panel-heading">
              <div><span className="section-eyebrow">COMMITMENTS</span><h2 id="week-commitments">This week's commitments ({commitments.filter((c) => c.completed).length}/{commitments.length})</h2></div>
              {summary && <span className="panel-count">{summary.progress ?? 0}%</span>}
            </div>
            <form onSubmit={addCommitment} className="d-flex gap-2 mb-3 flex-wrap">
              <input className="form-control" value={commitTitle} onChange={(e) => setCommitTitle(e.target.value)} placeholder="Add a commitment" aria-label="New commitment" maxLength={200} style={{ minWidth: 200, flex: 2 }} />
              <select className="form-select" value={commitPriority} onChange={(e) => setCommitPriority(e.target.value)} aria-label="Priority" style={{ maxWidth: 130 }}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
              <select className="form-select" value={commitGoal} onChange={(e) => setCommitGoal(e.target.value)} aria-label="Linked monthly goal" style={{ maxWidth: 200 }}>
                <option value="">No goal link</option>
                {goals.map((g) => <option key={g._id || g.id} value={g._id || g.id}>{g.title}</option>)}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !commitTitle.trim()}><Plus size={15} /> Add</button>
            </form>
            {commitments.length === 0 && <p className="text-muted">No commitments yet. Add the outcomes that matter this week.</p>}
            {commitments.map((c) => (
              <div className={`task-row${c.completed ? ' task-done' : ''}`} key={c._id}>
                <button type="button" className="btn btn-link btn-sm" disabled={busy} onClick={() => toggleCommitment(c)} aria-label={c.completed ? `Reopen ${c.title}` : `Complete ${c.title}`}>
                  {c.completed ? '✓' : '○'}
                </button>
                <span className="flex-grow-1">{c.title} <small className="text-muted">({c.priority}{c.monthlyGoal ? ` · ${goalName(c.monthlyGoal)}` : ''})</small></span>
                <button type="button" className="btn btn-link btn-sm text-danger" disabled={busy} onClick={() => removeCommitment(c)}>Remove</button>
              </div>
            ))}
          </section>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <section className="dashboard-panel" aria-labelledby="week-capacity">
                <div className="panel-heading"><div><span className="section-eyebrow">CAPACITY</span><h2 id="week-capacity">Planned vs available</h2></div><span className="panel-icon"><Clock3 size={19} /></span></div>
                {summary ? (
                  <ul className="dash-list mb-0">
                    <li>Planned: {summary.plannedHours ?? 0}h · Available: {summary.availableHours ?? 0}h</li>
                    <li>Capacity: {summary.capacityUsage ?? 0}% ({summary.capacityStatus || 'unknown'})</li>
                    <li>{summary.linkedMonthlyGoalsCount ?? 0} monthly goal(s) linked.</li>
                  </ul>
                ) : <p className="text-muted mb-0">Capacity appears once you set a focus and commitments.</p>}
              </section>
            </div>
            <div className="col-12 col-lg-6">
              <section className="dashboard-panel" aria-labelledby="week-review">
                <div className="panel-heading"><div><span className="section-eyebrow">PAUSE AND NOTICE</span><h2 id="week-review">Weekly review</h2></div></div>
                {review ? <p className="mb-0">This week's review is saved. <Link to="/app/reviews">Open in Reviews</Link></p> : <p className="mb-0">No review saved yet. <Link to="/app/reviews">Write the weekly review</Link></p>}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
