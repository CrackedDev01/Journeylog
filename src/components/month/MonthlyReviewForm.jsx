import Modal from '../common/Modal'
import React, { useState, useEffect } from 'react'
import { BookOpen, Check, X, Star, RefreshCw, Lightbulb, Trophy, AlertTriangle, ArrowRight } from 'lucide-react'

const StarRating = ({ value, onChange, label }) => {
  return (
    <div>
      <span className="form-label d-block small fw-semibold mb-1">{label}</span>
      <div className="d-flex align-items-center gap-1" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-link p-1 text-decoration-none"
            onClick={() => onChange(star)}
            aria-label={`${star} of 5`}
            aria-pressed={value === star}
          >
            <Star
              size={22}
              className={star <= value ? 'text-warning fill-warning' : 'text-muted'}
              style={star <= value ? { fill: 'var(--color-brass)', color: 'var(--color-brass)' } : {}}
            />
          </button>
        ))}
        <span className="small text-muted ms-2">
          {value ? `${value} / 5` : 'Not rated'}
        </span>
      </div>
    </div>
  )
}

const MonthlyReviewForm = ({
  isOpen,
  onClose,
  onSubmit,
  onRefreshSnapshot,
  initialReview = null,
  year,
  month
}) => {
  const isEdit = Boolean(initialReview?._id)

  const [biggestWin, setBiggestWin] = useState('')
  const [biggestChallenge, setBiggestChallenge] = useState('')
  const [whatWorked, setWhatWorked] = useState('')
  const [whatDidNotWork, setWhatDidNotWork] = useState('')
  const [mainLesson, setMainLesson] = useState('')
  const [whatToContinue, setWhatToContinue] = useState('')
  const [whatToStop, setWhatToStop] = useState('')
  const [whatToImprove, setWhatToImprove] = useState('')
  const [nextMonthFocus, setNextMonthFocus] = useState('')
  const [notes, setNotes] = useState('')
  const [monthRating, setMonthRating] = useState(0)
  const [satisfactionRating, setSatisfactionRating] = useState(0)

  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialReview) {
      setBiggestWin(initialReview.biggestWin || '')
      setBiggestChallenge(initialReview.biggestChallenge || '')
      setWhatWorked(initialReview.whatWorked || '')
      setWhatDidNotWork(initialReview.whatDidNotWork || '')
      setMainLesson(initialReview.mainLesson || '')
      setWhatToContinue(initialReview.whatToContinue || '')
      setWhatToStop(initialReview.whatToStop || '')
      setWhatToImprove(initialReview.whatToImprove || '')
      setNextMonthFocus(initialReview.nextMonthFocus || '')
      setNotes(initialReview.notes || '')
      setMonthRating(initialReview.monthRating || 0)
      setSatisfactionRating(initialReview.satisfactionRating || 0)
    } else {
      setBiggestWin('')
      setBiggestChallenge('')
      setWhatWorked('')
      setWhatDidNotWork('')
      setMainLesson('')
      setWhatToContinue('')
      setWhatToStop('')
      setWhatToImprove('')
      setNextMonthFocus('')
      setNotes('')
      setMonthRating(0)
      setSatisfactionRating(0)
    }
    setError('')
  }, [initialReview, isOpen])

  if (!isOpen) return null

  const handleRefresh = async () => {
    if (!initialReview?._id || refreshing) return
    setRefreshing(true)
    setError('')
    try {
      await onRefreshSnapshot(initialReview._id)
    } catch (err) {
      setError('Could not refresh snapshot data')
    } finally {
      setRefreshing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      year,
      month,
      biggestWin: biggestWin.trim(),
      biggestChallenge: biggestChallenge.trim(),
      whatWorked: whatWorked.trim(),
      whatDidNotWork: whatDidNotWork.trim(),
      mainLesson: mainLesson.trim(),
      whatToContinue: whatToContinue.trim(),
      whatToStop: whatToStop.trim(),
      whatToImprove: whatToImprove.trim(),
      nextMonthFocus: nextMonthFocus.trim(),
      notes: notes.trim(),
    }

    if (monthRating > 0) payload.monthRating = monthRating
    if (satisfactionRating > 0) payload.satisfactionRating = satisfactionRating

    try {
      await onSubmit(payload, initialReview?._id)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="review-form-heading" busy={submitting}>
      <div className="modal-card-custom modal-card-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="modal-icon-badge">
              <BookOpen size={18} />
            </span>
            <div>
              <h2 id="review-form-heading" className="modal-title-custom mb-0">
                {isEdit ? 'Edit Monthly Review' : 'New Monthly Review'}
              </h2>
              <div className="text-muted small">
                Pause, reflect, and harvest wisdom from this month
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isEdit && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-xs d-inline-flex align-items-center gap-1"
                onClick={handleRefresh}
                disabled={refreshing}
                title="Refresh metrics snapshot from tasks and sessions"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh Snapshot</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-close-custom"
              onClick={onClose}
              aria-label="Close"
            disabled={submitting}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-custom max-h-modal">
            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Ratings Section */}
            <div className="review-section-box p-3 rounded mb-3 bg-light border">
              <h3 className="section-eyebrow mb-2">SELF-ASSESSMENT</h3>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <StarRating
                    label="Overall Month Rating"
                    value={monthRating}
                    onChange={setMonthRating}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <StarRating
                    label="Personal Satisfaction Rating"
                    value={satisfactionRating}
                    onChange={setSatisfactionRating}
                  />
                </div>
              </div>
            </div>

            {/* Section 1: Highlights & Challenges */}
            <div className="review-section-box p-3 rounded mb-3 border">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Trophy size={16} className="text-gold" />
                <h3 className="review-section-title mb-0 fw-semibold">Wins & Obstacles</h3>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" htmlFor="review-form-biggestWin">
                  Biggest Win
                </label>
                <textarea id="review-form-biggestWin"
                  rows={2}
                  maxLength={500}
                  className="form-control form-control-sm"
                  placeholder="What was the most meaningful breakthrough, completion, or victory?"
                  value={biggestWin}
                  onChange={(e) => setBiggestWin(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold" htmlFor="review-form-biggestChallenge">
                  Biggest Challenge
                </label>
                <textarea id="review-form-biggestChallenge"
                  rows={2}
                  maxLength={500}
                  className="form-control form-control-sm"
                  placeholder="What obstacles, roadblocks, or unexpected friction did you encounter?"
                  value={biggestChallenge}
                  onChange={(e) => setBiggestChallenge(e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Analysis */}
            <div className="review-section-box p-3 rounded mb-3 border">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-primary" />
                <h3 className="review-section-title mb-0 fw-semibold">What Worked & Main Lessons</h3>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" htmlFor="review-form-whatWorked">What Worked Well</label>
                  <textarea id="review-form-whatWorked"
                    rows={2}
                    maxLength={500}
                    className="form-control form-control-sm"
                    placeholder="Strategies, systems, or mindsets that worked..."
                    value={whatWorked}
                    onChange={(e) => setWhatWorked(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" htmlFor="review-form-whatDidNotWork">What Did Not Work</label>
                  <textarea id="review-form-whatDidNotWork"
                    rows={2}
                    maxLength={500}
                    className="form-control form-control-sm"
                    placeholder="Approaches that caused burnout, delay, or distraction..."
                    value={whatDidNotWork}
                    onChange={(e) => setWhatDidNotWork(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold" htmlFor="review-form-mainLesson">Main Lesson Learned</label>
                <textarea id="review-form-mainLesson"
                  rows={2}
                  maxLength={500}
                  className="form-control form-control-sm"
                  placeholder="If you could teach yourself one truth this month, what would it be?"
                  value={mainLesson}
                  onChange={(e) => setMainLesson(e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: The Start / Stop / Continue Triad */}
            <div className="review-section-box p-3 rounded mb-3 border">
              <h3 className="section-eyebrow mb-2">CONTINUOUS CALIBRATION</h3>
              <div className="row g-2 mb-1">
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-success" htmlFor="review-form-whatToContinue">What to Continue</label>
                  <textarea id="review-form-whatToContinue"
                    rows={2}
                    maxLength={500}
                    className="form-control form-control-sm"
                    placeholder="Habits or rituals to keep going..."
                    value={whatToContinue}
                    onChange={(e) => setWhatToContinue(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-danger" htmlFor="review-form-whatToStop">What to Stop</label>
                  <textarea id="review-form-whatToStop"
                    rows={2}
                    maxLength={500}
                    className="form-control form-control-sm"
                    placeholder="Unproductive behaviors to eliminate..."
                    value={whatToStop}
                    onChange={(e) => setWhatToStop(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-warning" htmlFor="review-form-whatToImprove">What to Improve</label>
                  <textarea id="review-form-whatToImprove"
                    rows={2}
                    maxLength={500}
                    className="form-control form-control-sm"
                    placeholder="Areas where slight adjustments make big difference..."
                    value={whatToImprove}
                    onChange={(e) => setWhatToImprove(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Looking Forward & Notes */}
            <div className="review-section-box p-3 rounded mb-2 border">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ArrowRight size={16} className="text-primary" />
                <h3 className="review-section-title mb-0 fw-semibold">Next Month Focus</h3>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" htmlFor="review-form-nextMonthFocus">
                  Primary Focus for Next Month
                </label>
                <textarea id="review-form-nextMonthFocus"
                  rows={2}
                  maxLength={500}
                  className="form-control form-control-sm"
                  placeholder="What is the single most vital priority or intention for next month?"
                  value={nextMonthFocus}
                  onChange={(e) => setNextMonthFocus(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold" htmlFor="review-form-notes">
                  Additional Notes & Observations
                </label>
                <textarea id="review-form-notes"
                  rows={2}
                  maxLength={1000}
                  className="form-control form-control-sm"
                  placeholder="Any other observations, feelings, or gratitude..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer-custom d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEdit ? 'Save Review' : 'Complete Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default MonthlyReviewForm
