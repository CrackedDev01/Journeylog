import React from 'react'
import { ChevronLeft, ChevronRight, Plus, Lightbulb, BookOpen, Calendar } from 'lucide-react'
import { getMonthName } from '../../utils/dateFormat'

const MonthHeader = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onCurrentMonth,
  isCurrentMonth,
  onOpenNewGoalModal,
  onToggleReview,
  hasReview
}) => {
  const monthName = getMonthName(month)

  return (
    <div className="month-header-wrapper">
      <div className="row align-items-center g-3">
        <div className="col-12 col-md">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="section-eyebrow">LOOKING BACK, MOVING FORWARD</span>
            {isCurrentMonth && (
              <span className="current-month-badge">
                <Lightbulb size={13} /> Current Month
              </span>
            )}
          </div>
          <h1 className="month-heading-title">
            {monthName} {year}
            <span className="heading-period">.</span>
          </h1>
          <p className="month-heading-subtitle mb-0">
            Choose what matters this month. Make progress, then take time to reflect.
          </p>
        </div>

        <div className="col-12 col-md-auto">
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Month Navigation */}
            <div className="btn-group month-nav-group" role="group" aria-label="Month Navigation">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onPrevMonth}
                title="Previous month"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              {!isCurrentMonth && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onCurrentMonth}
                  title="Jump to current month"
                >
                  <Calendar size={14} className="me-1" /> This Month
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onNextMonth}
                title="Next month"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Actions */}
            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
              onClick={onOpenNewGoalModal}
            >
              <Plus size={16} />
              <span>New Goal</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1.5 ${hasReview ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
              onClick={onToggleReview}
            >
              <BookOpen size={16} />
              <span>{hasReview ? 'View Review' : 'Monthly Review'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthHeader
