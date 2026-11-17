import React from 'react'
import { BookOpen, Star, Trophy, Lightbulb, Edit2, Trash2, ArrowRight } from 'lucide-react'

const MonthlyReviewCard = ({
  review,
  onOpenReviewModal,
  onDeleteReview,
  year,
  monthName
}) => {
  const hasReview = Boolean(review?._id)

  return (
    <section className="dashboard-panel review-card-panel">
      <div className="panel-heading mb-3">
        <div>
          <span className="section-eyebrow">REFLECTION & HARVEST</span>
          <h2 className="mb-0">Monthly Review</h2>
        </div>
        <span className="panel-icon panel-icon-gold">
          <BookOpen size={18} />
        </span>
      </div>

      {hasReview ? (
        <div className="review-content-card">
          {/* Top header with ratings & edit */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {review.monthRating > 0 && (
                <div className="d-flex align-items-center gap-1">
                  <span className="text-muted small">Month Rating:</span>
                  <div className="d-flex text-warning">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= review.monthRating ? 'var(--color-brass)' : 'none'}
                        color={s <= review.monthRating ? 'var(--color-brass)' : '#8a938c'}
                      />
                    ))}
                  </div>
                </div>
              )}

              {review.satisfactionRating > 0 && (
                <div className="d-flex align-items-center gap-1">
                  <span className="text-muted small">Satisfaction:</span>
                  <div className="d-flex text-warning">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= review.satisfactionRating ? 'var(--color-brass)' : 'none'}
                        color={s <= review.satisfactionRating ? 'var(--color-brass)' : '#8a938c'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-xs d-inline-flex align-items-center gap-1"
                onClick={onOpenReviewModal}
              >
                <Edit2 size={12} />
                <span>Edit Review</span>
              </button>

              <button
                type="button"
                className="btn btn-link btn-xs text-danger text-decoration-none p-0"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete the monthly review for ${monthName} ${year}?`)) {
                    onDeleteReview(review._id)
                  }
                }}
                title="Delete Review"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="row g-3">
            {review.biggestWin && (
              <div className="col-12 col-md-6">
                <div className="p-3 rounded bg-sage-light border h-100">
                  <div className="d-flex align-items-center gap-1.5 text-success mb-1">
                    <Trophy size={15} />
                    <strong className="small text-uppercase">Biggest Win</strong>
                  </div>
                  <p className="mb-0 text-dark small">{review.biggestWin}</p>
                </div>
              </div>
            )}

            {review.mainLesson && (
              <div className="col-12 col-md-6">
                <div className="p-3 rounded bg-light border h-100">
                  <div className="d-flex align-items-center gap-1.5 text-primary mb-1">
                    <Lightbulb size={15} />
                    <strong className="small text-uppercase">Main Lesson</strong>
                  </div>
                  <p className="mb-0 text-dark small">{review.mainLesson}</p>
                </div>
              </div>
            )}

            {review.nextMonthFocus && (
              <div className="col-12">
                <div className="p-3 rounded bg-gold-light border">
                  <div className="d-flex align-items-center gap-1.5 text-gold-dark mb-1">
                    <ArrowRight size={15} />
                    <strong className="small text-uppercase">Next Month Focus</strong>
                  </div>
                  <p className="mb-0 text-dark small">{review.nextMonthFocus}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-review-banner p-4 rounded text-center border">
          <div className="empty-icon-circle mx-auto mb-2 text-primary">
            <Lightbulb size={24} />
          </div>
          <h4 className="fw-semibold mb-1">Harvest Your Learnings for {monthName}</h4>
          <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '480px' }}>
            Taking 10 minutes to reflect on what worked, what challenged you, and what to carry forward closes the loop on your monthly goals.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
            onClick={onOpenReviewModal}
          >
            <BookOpen size={15} />
            <span>Complete Monthly Review</span>
          </button>
        </div>
      )}
    </section>
  )
}

export default MonthlyReviewCard
