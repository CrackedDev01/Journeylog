import React from 'react'
import { Calendar, CheckCircle2, Clock } from 'lucide-react'
import { formatDate } from '../../utils/dateFormat'

const formatMins = (mins = 0) => {
  if (!mins || mins <= 0) return '0h'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

const MonthlyWeeklyBreakdown = ({ weeklyBreakdown = [] }) => {
  if (!weeklyBreakdown || weeklyBreakdown.length === 0) return null

  return (
    <section className="dashboard-panel weekly-breakdown-panel">
      <div className="panel-heading mb-3">
        <div>
          <span className="section-eyebrow">CADENCE & RHYTHM</span>
          <h3 className="mb-0">Weekly Breakdown</h3>
        </div>
        <span className="panel-icon">
          <Calendar size={18} />
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th>Week</th>
              <th>Tasks</th>
              <th>Must-Do Rate</th>
              <th>Actual Hours</th>
              <th>Weekly Review</th>
            </tr>
          </thead>
          <tbody>
            {weeklyBreakdown.map((week, idx) => {
              const startStr = week.weekStart
                ? formatDate(new Date(week.weekStart), { month: 'short', day: 'numeric' })
                : `Week ${idx + 1}`
              const endStr = week.weekEnd
                ? formatDate(new Date(week.weekEnd), { month: 'short', day: 'numeric' })
                : ''

              return (
                <tr key={idx}>
                  <td>
                    <div className="fw-semibold text-dark">Week {idx + 1}</div>
                    <div className="text-muted small">
                      {startStr} {endStr ? `– ${endStr}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium">
                      {week.tasksCompleted || 0}
                    </span>
                    <span className="text-muted small"> / {week.tasksPlanned || 0}</span>
                  </td>
                  <td>
                    {week.mustDoCompletionRate != null ? (
                      <div className="d-flex align-items-center gap-1.5">
                        <span className="small fw-semibold">{week.mustDoCompletionRate}%</span>
                        <div className="progress flex-grow-1" style={{ width: '60px', height: '5px' }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${week.mustDoCompletionRate}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted small">–</span>
                    )}
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center gap-1 small">
                      <Clock size={12} className="text-muted" />
                      {formatMins(week.actualMinutes)}
                    </span>
                  </td>
                  <td>
                    {week.weeklyReviewCompleted ? (
                      <span className="badge-pill badge-status-success d-inline-flex align-items-center gap-1">
                        <CheckCircle2 size={12} /> Done
                      </span>
                    ) : (
                      <span className="badge-pill badge-status-neutral">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MonthlyWeeklyBreakdown
