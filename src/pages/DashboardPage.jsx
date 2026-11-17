import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChartNoAxesColumnIncreasing, Check, CheckCircle2, Circle, Clock3, Repeat2, TrendingUp, ListTodo, Lightbulb, Target } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotFoundPage from './NotFoundPage'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import StreakBadge from '../components/common/StreakBadge'
import dashboardService from '../services/dashboard.service'
import { formatApiError } from '../utils/formatApiError'
import { formatDate } from '../utils/dateFormat'

const viewConfig = {
  today: { title: 'Today', eyebrow: 'A FRESH PAGE', description: 'Make today count, one thoughtful step at a time.', load: (service) => service.getToday() },
  week: { title: 'Your week', eyebrow: 'THE BIGGER PICTURE', description: 'Notice your rhythm and make space for what matters.', load: (service) => service.getWeek() },
  month: { title: 'Your month', eyebrow: 'LOOKING BACK, MOVING FORWARD', description: 'A little perspective can make the next step clearer.', load: (service) => service.getMonth() },
  projects: { title: 'Projects', eyebrow: 'THINGS YOU ARE BUILDING', description: 'Keep your meaningful work moving forward.' },
  habits: { title: 'Habits', eyebrow: 'SMALL PROMISES, KEPT OFTEN', description: 'Gentle repetition is how lasting change takes root.' },
  skills: { title: 'Skills', eyebrow: 'ROOM TO GROW', description: 'Track the abilities you are nurturing over time.' },
  reviews: { title: 'Reviews', eyebrow: 'PAUSE AND NOTICE', description: 'Reflect on what worked and what you want to carry forward.' },
  settings: { title: 'Settings', eyebrow: 'YOUR ACCOUNT', description: 'Your personal JourneyLog space.' },
}

const firstArray = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}
const readCount = (data, keys) => {
  for (const key of keys) {
    const value = data?.[key]
    if (typeof value === 'number') return value
    if (Array.isArray(value)) return value.length
  }
  return null
}

const DashboardPage = () => {
  const { section = 'today' } = useParams()
  const { user } = useAuth()
  const config = viewConfig[section] || viewConfig.today
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(Boolean(config.load))
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!config.load) {
        setDashboardData(null)
        setLoading(false)
        setError('')
        return
      }
      setLoading(true)
      setError('')
      try {
        const response = await config.load(dashboardService)
        const payload = response?.data?.data ?? response?.data ?? null
        if (active) setDashboardData(payload)
      } catch (requestError) {
        if (active) setError(formatApiError(requestError))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [config, retryKey])

  const tasks = firstArray(dashboardData, ['tasks', 'todayTasks', 'items'])
  const habits = firstArray(dashboardData, ['habits', 'habitEntries'])
  const completedTasks = tasks.filter((task) => task.completed || task.isCompleted || task.status === 'completed').length
  const completedHabits = habits.filter((habit) => habit.completed || habit.isCompleted || habit.status === 'completed').length
  const taskCount = readCount(dashboardData, ['taskCount', 'totalTasks']) ?? tasks.length
  const habitCount = readCount(dashboardData, ['habitCount', 'totalHabits']) ?? habits.length
  const focus = dashboardData?.focus || dashboardData?.dailyPlan?.focus || dashboardData?.plan?.focus || ''
  const today = formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'there'

  if (!viewConfig[section]) return <NotFoundPage />

  return (
    <div className="dashboard-page container-fluid">
      <div className="dashboard-heading row align-items-end g-3">
        <div className="col">
          <span className="section-eyebrow">{config.eyebrow}</span>
          <h1>{section === 'today' ? <>Good day, {firstName}<span className="heading-period">.</span></> : config.title}</h1>
          <p>{section === 'today' ? config.description : config.description}</p>
        </div>
        {section === 'today' && <div className="col-auto d-flex align-items-center gap-2"><StreakBadge refreshKey={retryKey} /><span className="date-chip"><Lightbulb size={15} /> {today}</span></div>}
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="dashboard-message dashboard-error" role="alert">
          <div className="message-icon"><Target size={21} /></div>
          <div><h2>We couldn't load this view</h2><p>{error}</p><button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setRetryKey((key) => key + 1)}>Try again</button></div>
        </div>
      ) : section === 'today' || section === 'week' || section === 'month' ? (
        <>
          <div className="row g-3 dashboard-metrics">
            <div className="col-12 col-sm-6 col-xl-4"><MetricCard icon={<ListTodo size={19} />} label="Tasks completed" value={taskCount ? `${completedTasks} / ${taskCount}` : String(completedTasks)} tone="sage" /></div>
            <div className="col-12 col-sm-6 col-xl-4"><MetricCard icon={<Repeat2 size={19} />} label="Habits checked in" value={habitCount ? `${completedHabits} / ${habitCount}` : String(completedHabits)} tone="gold" /></div>
            <div className="col-12 col-xl-4"><MetricCard icon={<Clock3 size={19} />} label="Focused time" value={formatMinutes(dashboardData?.actualWorkMinutes ?? dashboardData?.workMinutes ?? dashboardData?.totalMinutes)} tone="blue" /></div>
          </div>

          {section === 'today' && <div className="row g-3 dashboard-content-grid">
            <div className="col-12 col-lg-7">
              <section className="dashboard-panel focus-panel">
                <div className="panel-heading"><div><span className="section-eyebrow">YOUR INTENTION</span><h2>Today's focus</h2></div><span className="panel-icon"><Target size={19} /></span></div>
                {focus ? <p className="focus-quote">{focus}</p> : <EmptyMessage icon={<TrendingUp size={20} />} title="Start with one clear intention" text="Your daily focus will show here when you have a plan for today." />}
              </section>
              <section className="dashboard-panel tasks-panel">
                <div className="panel-heading"><div><span className="section-eyebrow">ONE STEP AT A TIME</span><h2>Today's tasks</h2></div><span className="panel-count">{tasks.length}</span></div>
                {tasks.length ? <div className="task-list">{tasks.slice(0, 6).map((task, index) => {
                  const done = task.completed || task.isCompleted || task.status === 'completed'
                  return <div className={`task-row${done ? ' task-done' : ''}`} key={task.id || task._id || `${task.title}-${index}`}><span className="task-status">{done ? <CheckCircle2 size={19} /> : <Circle size={19} />}</span><span>{task.title || task.name || 'Untitled task'}</span>{task.priority === 'high' && <span className="priority-mark">Must do</span>}</div>
                })}</div> : <EmptyMessage icon={<Check size={20} />} title="A little breathing room" text="There are no tasks on your plan yet." />}
              </section>
            </div>
            <div className="col-12 col-lg-5">
              <section className="dashboard-panel progress-panel">
                <div className="panel-heading"><div><span className="section-eyebrow">STEADY IS STRONG</span><h2>Today's progress</h2></div><span className="panel-icon panel-icon-gold"><Lightbulb size={18} /></span></div>
                <ProgressLine label="Tasks" value={completedTasks} total={taskCount} />
                <ProgressLine label="Habits" value={completedHabits} total={habitCount} />
                <div className="week-strip-heading"><span>This week</span><span>Today is outlined</span></div>
                <div className="week-strip">{getWeekDays().map((day) => <div className="week-day" key={day.label}><span>{day.label}</span><i className={day.today ? 'is-today' : ''} aria-current={day.today ? 'date' : undefined}>{day.date}</i></div>)}</div>
              </section>
              <section className="gentle-note"><Lightbulb className="note-icon" size={18} aria-hidden="true" /><div><strong>Progress over perfection</strong><p>Showing up is already a meaningful part of the work.</p></div></section>
            </div>
          </div>}

          {section !== 'today' && <section className="dashboard-panel summary-panel"><div className="panel-heading"><div><span className="section-eyebrow">YOUR MOMENTUM</span><h2>{section === 'week' ? 'A week in view' : 'A month in view'}</h2></div><span className="panel-icon"><ChartIcon /></span></div><EmptyMessage icon={<Lightbulb size={20} />} title="Your story is taking shape" text="As you log tasks, habits, and work sessions, your progress will gather here." /></section>}
        </>
      ) : (
        <section className="dashboard-panel coming-panel">
          <div className="coming-illustration"><TrendingUp size={24} /></div>
          <span className="section-eyebrow">MADE FOR YOUR MOMENTUM</span>
          <h2>{section === 'projects' ? 'Your projects will live here' : section === 'habits' ? 'Your habits will grow here' : section === 'skills' ? 'Your learning path starts here' : section === 'reviews' ? 'Your reflections will gather here' : 'Your preferences'}</h2>
          <p>{section === 'settings' ? 'Account preferences and personal details will appear here.' : 'This space is coming soon. In the meantime, set a monthly goal to keep your next step in view.'}</p>
          <Link to="/app/month" className="btn btn-outline-primary mt-3">Explore monthly goals</Link>
        </section>
      )}
    </div>
  )
}

const MetricCard = ({ icon, label, value, tone }) => (
  <div className={`metric-card metric-${tone}`}><span className="metric-icon">{icon}</span><div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong></div></div>
)

const EmptyMessage = ({ icon, title, text }) => <div className="empty-message"><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div></div>

const ProgressLine = ({ label, value, total }) => {
  const percentage = total ? Math.min(100, Math.round((value / total) * 100)) : 0
  return <div className="progress-line"><div className="progress-label"><span>{label}</span><span>{total ? `${value} of ${total}` : 'Nothing planned yet'}</span></div><div className="progress track-progress" role="progressbar" aria-label={`${label} progress`} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"><div className="progress-bar" style={{ width: `${percentage}%` }} /></div></div>
}

const formatMinutes = (minutes) => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes)) return '0 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}

const getWeekDays = () => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return { label: date.toLocaleDateString('en', { weekday: 'short' }), date: date.getDate(), today: date.toDateString() === today.toDateString() }
  })
}

const ChartIcon = () => <ChartNoAxesColumnIncreasing size={19} />

export default DashboardPage