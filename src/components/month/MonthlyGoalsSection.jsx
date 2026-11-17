import React, { useState, useMemo } from 'react'
import { Target, Plus, Filter, Lightbulb, CheckCircle2 } from 'lucide-react'
import MonthlyGoalCard from './MonthlyGoalCard'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'career', label: 'Career' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health' },
  { value: 'personal', label: 'Personal' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'project', label: 'Project' },
  { value: 'skill', label: 'Skill' },
  { value: 'other', label: 'Other' },
]

const MonthlyGoalsSection = ({
  goals = [],
  onOpenNewGoalModal,
  onEditGoal,
  onDeleteGoal,
  onOpenProgressModal,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone
}) => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Calculate status counts
  const counts = useMemo(() => {
    return {
      all: goals.length,
      in_progress: goals.filter(g => g.status === 'in_progress').length,
      not_started: goals.filter(g => g.status === 'not_started').length,
      completed: goals.filter(g => g.status === 'completed' || (g.progress ?? 0) >= 100).length,
      paused: goals.filter(g => g.status === 'paused').length,
    }
  }, [goals])

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Status filter
      if (statusFilter === 'in_progress' && goal.status !== 'in_progress') return false
      if (statusFilter === 'not_started' && goal.status !== 'not_started') return false
      if (statusFilter === 'completed' && goal.status !== 'completed' && (goal.progress ?? 0) < 100) return false
      if (statusFilter === 'paused' && goal.status !== 'paused') return false

      // Category filter
      if (categoryFilter !== 'all' && goal.category !== categoryFilter) return false

      return true
    })
  }, [goals, statusFilter, categoryFilter])

  return (
    <section className="dashboard-panel goals-section-panel">
      {/* Section Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <span className="section-eyebrow">HIGH-IMPACT OUTCOMES</span>
          <h2 className="mb-0">Monthly Goals</h2>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
          onClick={onOpenNewGoalModal}
        >
          <Plus size={16} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-2 border-bottom">
        {/* Status Tabs */}
        <div className="status-filter-tabs d-flex flex-wrap gap-1">
          <button
            type="button"
            className={`btn-tab ${statusFilter === 'all' ? 'active' : ''}`}
            aria-pressed={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            All <span className="tab-count">{counts.all}</span>
          </button>
          <button
            type="button"
            className={`btn-tab ${statusFilter === 'in_progress' ? 'active' : ''}`}
            aria-pressed={statusFilter === 'in_progress'}
            onClick={() => setStatusFilter('in_progress')}
          >
            In Progress <span className="tab-count">{counts.in_progress}</span>
          </button>
          <button
            type="button"
            className={`btn-tab ${statusFilter === 'not_started' ? 'active' : ''}`}
            aria-pressed={statusFilter === 'not_started'}
            onClick={() => setStatusFilter('not_started')}
          >
            Not Started <span className="tab-count">{counts.not_started}</span>
          </button>
          <button
            type="button"
            className={`btn-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            aria-pressed={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed <span className="tab-count">{counts.completed}</span>
          </button>
          {counts.paused > 0 && (
            <button
              type="button"
              className={`btn-tab ${statusFilter === 'paused' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'paused'}
            onClick={() => setStatusFilter('paused')}
            >
              Paused <span className="tab-count">{counts.paused}</span>
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="d-flex align-items-center gap-1.5">
          <Filter size={14} className="text-muted" />
          <select
            aria-label="Filter goals by category"
            className="form-select form-select-sm"
            style={{ width: 'auto', minWidth: '140px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="row g-3">
          {filteredGoals.map((goal) => (
            <div key={goal._id} className="col-12 col-md-6 col-xl-4">
              <MonthlyGoalCard
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onOpenProgressModal={onOpenProgressModal}
                onToggleMilestone={onToggleMilestone}
                onAddMilestone={onAddMilestone}
                onDeleteMilestone={onDeleteMilestone}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="goals-empty-state text-center py-5" role="status">
          <span className="empty-icon-circle mb-2 d-inline-flex align-items-center justify-content-center">
            <Target size={24} />
          </span>
          <h3 className="fw-semibold mt-2 mb-1">
            {goals.length === 0 ? 'No goals for this month yet' : 'No matching goals found'}
          </h3>
          <p className="text-muted small mb-3">
            {goals.length === 0
              ? 'Choose 2 to 4 meaningful intentions to focus your efforts and weekly commitments.'
              : 'Try changing your status or category filters to see your other goals.'}
          </p>
          {goals.length > 0 && <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setStatusFilter('all'); setCategoryFilter('all') }}>Clear filters</button>}
          {goals.length === 0 && (
            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
              onClick={onOpenNewGoalModal}
            >
              <Plus size={16} />
              <span>Set Your First Monthly Goal</span>
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default MonthlyGoalsSection
