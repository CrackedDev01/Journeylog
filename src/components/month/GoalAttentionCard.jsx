import React from 'react'
import { AlertCircle, Target, Lightbulb, ArrowRight } from 'lucide-react'

const GoalAttentionCard = ({ goals = [], onOpenProgressModal }) => {
  // Find critical/high priority goals that are not yet completed
  const highPriorityGoals = goals.filter(
    g => (g.priority === 'critical' || g.priority === 'high') &&
         g.status !== 'completed' &&
         (g.progress ?? 0) < 100
  )

  // Find unaddressed goals (0% progress)
  const unaddressedGoals = goals.filter(
    g => (g.progress ?? 0) === 0 && g.status !== 'completed'
  )

  if (goals.length === 0) return null

  return (
    <section className="dashboard-panel attention-panel">
      <div className="panel-heading mb-3">
        <div>
          <span className="section-eyebrow">MONTHLY ALIGNMENT</span>
          <h3 className="mb-0">Focus & Momentum</h3>
        </div>
        <span className="panel-icon panel-icon-gold">
          <Lightbulb size={18} />
        </span>
      </div>

      <div className="row g-3">
        {/* High Priority Attention */}
        <div className="col-12 col-md-6">
          <div className="attention-subcard p-3 rounded h-100 border">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-warning">
                <AlertCircle size={17} />
              </span>
              <strong className="small text-uppercase tracking-wider">Top Priority Commitments</strong>
            </div>

            {highPriorityGoals.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {highPriorityGoals.slice(0, 3).map(g => (
                  <li key={g._id} className="d-flex justify-content-between align-items-center py-1.5 border-bottom last-border-0">
                    <span className="small text-truncate me-2 fw-medium">{g.title}</span>
                    <button
                      type="button"
                      className="btn btn-link btn-xs p-0 text-decoration-none d-inline-flex align-items-center gap-1 text-primary"
                      onClick={() => onOpenProgressModal(g)}
                    >
                      <span>Update</span>
                      <ArrowRight size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">
                All high-priority goals are on track or completed. Great work!
              </p>
            )}
          </div>
        </div>

        {/* Getting Started */}
        <div className="col-12 col-md-6">
          <div className="attention-subcard p-3 rounded h-100 border">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-primary">
                <Target size={17} />
              </span>
              <strong className="small text-uppercase tracking-wider">Needs First Step</strong>
            </div>

            {unaddressedGoals.length > 0 ? (
              <div>
                <p className="text-muted small mb-2">
                  {unaddressedGoals.length} {unaddressedGoals.length === 1 ? 'goal has' : 'goals have'} not logged any progress yet:
                </p>
                <div className="d-flex flex-wrap gap-1.5">
                  {unaddressedGoals.slice(0, 4).map(g => (
                    <span
                      key={g._id}
                      className="badge-pill bg-light text-dark border cursor-pointer hover-bg"
                      onClick={() => onOpenProgressModal(g)}
                      title="Click to log first progress"
                    >
                      {g.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted small mb-0">
                Every goal has begun moving forward this month. Keep the rhythm going!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GoalAttentionCard
