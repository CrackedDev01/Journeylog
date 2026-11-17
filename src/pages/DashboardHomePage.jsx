import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, ChartNoAxesColumnIncreasing, CircleAlert, Clock3, Flame, LayoutDashboard, ListTodo, Repeat2, Target } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import dashboardService from '../services/dashboard.service'
import { formatApiError } from '../utils/formatApiError'
import { formatDate } from '../utils/dateFormat'

const unwrap = (response) => response?.data?.data ?? response?.data ?? null

const DashboardHomePage = () => {
  const { user } = useAuth()
  const [today, setToday] = useState(null)
  const [week, setWeek] = useState(null)
  const [month, setMonth] = useState(null)
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const results = await Promise.allSettled([
      dashboardService.getToday(),
      dashboardService.getWeek(),
      dashboardService.getMonth(),
      dashboardService.getStreak(),
    ])
    const [todayRes, weekRes, monthRes, streakRes] = results
    if (todayRes.status === 'fulfilled') setToday(unwrap(todayRes.value))
    if (weekRes.status === 'fulfilled') setWeek(unwrap(weekRes.value))
    if (monthRes.status === 'fulfilled') setMonth(unwrap(monthRes.value))
    if (streakRes.status === 'fulfilled') setStreak(unwrap(streakRes.value))
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length === results.length) {
      setError(formatApiError(failures[0].reason))
    } else if (failures.length > 0) {
      setError('')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load, retryKey])

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'there'
  const todayLabel = formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })

  const taskTotal = today?.tasks?.total ?? 0
  const taskDone = today?.tasks?.completed ?? 0
  const taskRemaining = Math.max(0, taskTotal - taskDone)
  const habitScheduled = today?.habits?.scheduled ?? 0
  const habitDone = (today?.habits?.completed ?? 0) + (today?.habits?.partial ?? 0)
  const workMinutes = today?.work?.actualMinutes ?? today?.time?.actualMinutes ?? 0
  const focus = today?.dailyPlan?.dailyFocus || today?.dailyPlan?.focus || today?.focus || ''

  const weekCommitmentsTotal = week?.commitments?.total ?? week?.weeklyPlan?.commitments?.length ?? 0
  const weekCommitmentsDone = week?.commitments?.completed ?? 0
  const weekTasksTotal = week?.tasks?.total ?? 0
  const weekTasksDone = week?.tasks?.completed ?? 0

  const goals = month?.monthlyGoals ?? month?.goals?.items ?? []
  const goalsActive = Array.isArray(goals) ? goals.filter((g) => g.status === 'active' || g.status === 'in_progress').length : 0

  return (
    <div className="dashboard-page container-fluid">
      <div className="dashboard-heading row align-items-end g-3">
        <div className="col">
          <span className="section-eyebrow">YOUR OVERVIEW</span>
          <h1>Good day, {firstName}<span className="heading-period">.</span></h1>
          <p>{todayLabel} — here is where you stand and where to go next.</p>
        </div>
        <div className="col-auto"><StreakChip streak={streak} /></div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="dashboard-message dashboard-error" role="alert">
          <div className="message-icon"><Target size={21} /></div>
          <div><h2>We couldn't load your dashboard</h2><p>{error}</p><button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setRetryKey((k) => k + 1)}>Try again</button></div>
        </div>
      ) : (
        <>
          <div className="row g-3 dashboard-metrics">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="metric-card"><span className="metric-icon"><ListTodo size={19} /></span><div><span className="metric-label">Tasks today</span><strong className="metric-value">{taskDone} / {taskTotal}</strong></div></div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="metric-card metric-gold"><span className="metric-icon"><Repeat2 size={19} /></span><div><span className="metric-label">Habits today</span><strong className="metric-value">{habitDone} / {habitScheduled}</strong></div></div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="metric-card metric-blue"><span className="metric-icon"><Clock3 size={19} /></span><div><span className="metric-label">Focused time</span><strong className="metric-value">{formatMinutes(workMinutes)}</strong></div></div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="metric-card"><span className="metric-icon"><Target size={19} /></span><div><span className="metric-label">Active goals</span><strong className="metric-value">{goalsActive}</strong></div></div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <section className="dashboard-panel" aria-labelledby="dash-today">
                <div className="panel-heading"><div><span className="section-eyebrow">TODAY</span><h2 id="dash-today">Today's overview</h2></div><span className="panel-icon"><LayoutDashboard size={19} /></span></div>
                {focus && <p className="focus-quote">{focus}</p>}
                <ul className="dash-list">
                  <li>{taskRemaining === 0 && taskTotal > 0 ? 'All tasks complete.' : `${taskRemaining} task${taskRemaining === 1 ? '' : 's'} remaining.`}</li>
                  <li>{habitScheduled ? `${habitDone} of ${habitScheduled} habits checked in.` : 'No habits scheduled today.'}</li>
                  <li>{formatMinutes(workMinutes)} of focused work logged.</li>
                </ul>
                <Link to="/app/today" className="btn btn-outline-primary btn-sm">Open Today</Link>
              </section>
            </div>
            <div className="col-12 col-lg-4">
              <section className="dashboard-panel" aria-labelledby="dash-week">
                <div className="panel-heading"><div><span className="section-eyebrow">THIS WEEK</span><h2 id="dash-week">Weekly overview</h2></div><span className="panel-icon"><CalendarRange size={19} /></span></div>
                <ul className="dash-list">
                  <li>{weekCommitmentsTotal ? `${weekCommitmentsDone} of ${weekCommitmentsTotal} commitments complete.` : 'No weekly commitments yet.'}</li>
                  <li>{weekTasksTotal ? `${weekTasksDone} of ${weekTasksTotal} tasks complete.` : 'No tasks planned this week.'}</li>
                  {week?.time && <li>{formatMinutes(week.time.actualMinutes ?? 0)} of {formatMinutes(week.time.plannedMinutes ?? 0)} planned.</li>}
                </ul>
                <Link to="/app/week" className="btn btn-outline-primary btn-sm">Open Week</Link>
              </section>
            </div>
            <div className="col-12 col-lg-4">
              <section className="dashboard-panel" aria-labelledby="dash-month">
                <div className="panel-heading"><div><span className="section-eyebrow">THIS MONTH</span><h2 id="dash-month">Monthly overview</h2></div><span className="panel-icon"><ChartNoAxesColumnIncreasing size={19} /></span></div>
                {Array.isArray(goals) && goals.length > 0 ? (
                  <ul className="dash-list">
                    {goals.slice(0, 4).map((goal) => (
                      <li key={goal.id || goal._id}>{goal.title} — {Math.round(goal.progress ?? 0)}%</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No monthly goals yet. Set one to give your weeks direction.</p>
                )}
                <Link to="/app/month" className="btn btn-outline-primary btn-sm">Open Month</Link>
              </section>
            </div>
          </div>

          <section className="dashboard-panel" aria-labelledby="dash-attention">
            <div className="panel-heading"><div><span className="section-eyebrow">ATTENTION</span><h2 id="dash-attention">What needs you</h2></div><span className="panel-icon"><CircleAlert size={19} /></span></div>
            <AttentionList today={today} week={week} />
          </section>
        </>
      )}
    </div>
  )
}

const StreakChip = ({ streak }) => {
  if (!streak) return null
  const count = streak.currentStreak ?? 0
  return (
    <span className="streak-badge" role="status" title={streak.completedToday ? "Today's streak is secured." : 'Complete an activity today to keep it going.'}>
      <Flame size={18} aria-hidden="true" /><span><strong>{count}</strong> Day Streak</span>
    </span>
  )
}

const AttentionList = ({ today, week }) => {
  const items = []
  const remaining = (today?.tasks?.total ?? 0) - (today?.tasks?.completed ?? 0)
  if (remaining > 0) items.push(`${remaining} unfinished task${remaining === 1 ? '' : 's'} today.`)
  const habitsLeft = (today?.habits?.scheduled ?? 0) - ((today?.habits?.completed ?? 0) + (today?.habits?.partial ?? 0))
  if (habitsLeft > 0) items.push(`${habitsLeft} habit${habitsLeft === 1 ? '' : 's'} still open today.`)
  if (week?.time?.plannedMinutes && week?.time?.actualMinutes > week.time.plannedMinutes * 1.1) {
    items.push('Weekly workload is running above planned capacity.')
  }
  if (today?.review && today.review.completed === false) items.push('Daily review not yet saved.')
  if (items.length === 0) return <p className="text-muted mb-0">Nothing urgent. Keep to your plan.</p>
  return <ul className="dash-list mb-0">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
}

const formatMinutes = (minutes) => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes)) return '0 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}

export default DashboardHomePage
