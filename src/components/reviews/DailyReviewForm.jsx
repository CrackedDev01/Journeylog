import React, { useState } from 'react'
import dailyReviewService from '../../services/dailyReview.service'
import { formatApiError } from '../../utils/formatApiError'

const FEELINGS = ['great', 'good', 'neutral', 'tired', 'difficult']

const DailyReviewForm = ({ existing = null, dailyPlanId = null, onSaved }) => {
  const [mainWin, setMainWin] = useState(existing?.mainWin || '')
  const [mainChallenge, setMainChallenge] = useState(existing?.mainChallenge || '')
  const [whatWentWell, setWhatWentWell] = useState(existing?.whatWentWell || '')
  const [lessonLearned, setLessonLearned] = useState(existing?.lessonLearned || '')
  const [tomorrowFocus, setTomorrowFocus] = useState(existing?.tomorrowFocus || '')
  const [dayRating, setDayRating] = useState(existing?.dayRating || '')
  const [dayFeeling, setDayFeeling] = useState(existing?.dayFeeling || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        mainWin: mainWin.trim() || undefined,
        mainChallenge: mainChallenge.trim() || undefined,
        whatWentWell: whatWentWell.trim() || undefined,
        lessonLearned: lessonLearned.trim() || undefined,
        tomorrowFocus: tomorrowFocus.trim() || undefined,
        dayRating: dayRating ? Number(dayRating) : undefined,
        dayFeeling: dayFeeling || undefined,
      }
      let result
      if (existing?._id) {
        result = await dailyReviewService.update(existing._id, payload)
      } else {
        result = await dailyReviewService.create({
          date: new Date().toISOString().split('T')[0],
          dailyPlan: dailyPlanId || undefined,
          ...payload,
        })
      }
      if (onSaved) onSaved(result?.data?.review ?? result?.review ?? result)
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="mb-2">
        <label className="form-label" htmlFor="dr-mainwin">Main win of the day</label>
        <textarea id="dr-mainwin" className="form-control" rows={2} maxLength={500} value={mainWin} onChange={(e) => setMainWin(e.target.value)} placeholder="What went best today?" />
      </div>
      <div className="mb-2">
        <label className="form-label" htmlFor="dr-challenge">Main challenge</label>
        <textarea id="dr-challenge" className="form-control" rows={2} maxLength={500} value={mainChallenge} onChange={(e) => setMainChallenge(e.target.value)} placeholder="What was hardest?" />
      </div>
      <div className="mb-2">
        <label className="form-label" htmlFor="dr-wentwell">What went well</label>
        <textarea id="dr-wentwell" className="form-control" rows={2} maxLength={500} value={whatWentWell} onChange={(e) => setWhatWentWell(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label" htmlFor="dr-lesson">Lesson learned</label>
        <textarea id="dr-lesson" className="form-control" rows={2} maxLength={500} value={lessonLearned} onChange={(e) => setLessonLearned(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label" htmlFor="dr-tomorrow">Tomorrow's focus</label>
        <input id="dr-tomorrow" className="form-control" maxLength={500} value={tomorrowFocus} onChange={(e) => setTomorrowFocus(e.target.value)} placeholder="One thing for tomorrow" />
      </div>
      <div className="row g-2 mb-3">
        <div className="col-6">
          <label className="form-label" htmlFor="dr-rating">Day rating (1–5)</label>
          <select id="dr-rating" className="form-select" value={dayRating} onChange={(e) => setDayRating(e.target.value)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="col-6">
          <label className="form-label" htmlFor="dr-feeling">How the day felt</label>
          <select id="dr-feeling" className="form-select" value={dayFeeling} onChange={(e) => setDayFeeling(e.target.value)}>
            <option value="">—</option>
            {FEELINGS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
        {saving ? 'Saving…' : existing ? 'Update review' : 'Save review'}
      </button>
    </form>
  )
}

export default DailyReviewForm
