import React from 'react'
import { Target, CheckCircle2, Clock, ListChecks, ArrowUpRight, Repeat2 } from 'lucide-react'

const formatHoursMinutes = (totalMinutes = 0) => {
  if (!totalMinutes || totalMinutes <= 0) return '0h'
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

const MonthlySummaryCard = ({ summary, monthData }) => {
  // Goal stats (fall back between dashboard monthData and goals summary)
  const totalGoals = summary?.total ?? monthData?.goals?.total ?? 0
  const completedGoals = summary?.completed ?? monthData?.goals?.completed ?? 0
  const inProgressGoals = summary?.inProgress ?? monthData?.goals?.inProgress ?? 0
  const goalRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  // Task stats
  const totalTasks = monthData?.tasks?.total ?? 0
  const completedTasks = monthData?.tasks?.completed ?? 0
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const mustDoCount = monthData?.tasks?.mustDoCount ?? 0
  const completedMustDo = monthData?.tasks?.completedMustDoCount ?? 0

  // Time stats
  const actualMinutes = monthData?.time?.actualMinutes ?? 0
  const plannedMinutes = monthData?.time?.plannedMinutes ?? 0

  return (
    <div className="monthly-summary-container">
      <div className="row g-3">
        {/* Goals Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card metric-sage h-100">
            <div className="d-flex justify-content-between align-items-start">
              <span className="metric-icon">
                <Target size={20} />
              </span>
              <span className="badge-pill-soft">{goalRate}% done</span>
            </div>
            <div className="mt-2">
              <span className="metric-label">Monthly Goals</span>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <strong className="metric-value">{completedGoals} / {totalGoals}</strong>
                {inProgressGoals > 0 && (
                  <span className="text-muted small">({inProgressGoals} active)</span>
                )}
              </div>
            </div>
            <div className="progress mt-3" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                aria-label="Monthly goals completed"
                style={{ width: `${goalRate}%` }}
                aria-valuenow={goalRate}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>

        {/* Tasks Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card metric-gold h-100">
            <div className="d-flex justify-content-between align-items-start">
              <span className="metric-icon">
                <ListChecks size={20} />
              </span>
              <span className="badge-pill-soft">{taskRate}% rate</span>
            </div>
            <div className="mt-2">
              <span className="metric-label">Tasks Completed</span>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <strong className="metric-value">{completedTasks} / {totalTasks}</strong>
              </div>
            </div>
            <div className="mt-2 text-muted small d-flex align-items-center gap-1">
              <span>Must-Dos:</span>
              <strong className="text-dark">{completedMustDo} of {mustDoCount}</strong>
            </div>
          </div>
        </div>

        {/* Focus Time Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card metric-blue h-100">
            <div className="d-flex justify-content-between align-items-start">
              <span className="metric-icon">
                <Clock size={20} />
              </span>
              <span className="badge-pill-soft">Focus Time</span>
            </div>
            <div className="mt-2">
              <span className="metric-label">Deep & Focused Work</span>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <strong className="metric-value">{formatHoursMinutes(actualMinutes)}</strong>
              </div>
            </div>
            <div className="mt-2 text-muted small">
              Planned: {formatHoursMinutes(plannedMinutes)}
            </div>
          </div>
        </div>

        {/* Habits & Review Status */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card metric-terracotta h-100">
            <div className="d-flex justify-content-between align-items-start">
              <span className="metric-icon">
                <Repeat2 size={20} />
              </span>
              <span className="badge-pill-soft">Consistency</span>
            </div>
            <div className="mt-2">
              <span className="metric-label">Habit Consistency</span>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <strong className="metric-value">
                  {monthData?.habits?.completionRate != null ? `${monthData.habits.completionRate}%` : 'N/A'}
                </strong>
              </div>
            </div>
            <div className="mt-2 text-muted small">
              {monthData?.habits?.completed ?? 0} check-ins logged
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthlySummaryCard
