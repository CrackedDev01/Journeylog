import React, { useEffect, useState } from 'react'
import dailyReviewService from '../services/dailyReview.service'
import weeklyReviewService from '../services/weeklyReview.service'
import monthlyReviewService from '../services/monthlyReview.service'
import { formatApiError } from '../utils/formatApiError'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'

export default function ReviewsPage() {
  const [tab, setTab] = useState('daily')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true); setError('')
    const load = async () => {
      try {
        let res
        if (tab === 'daily') res = await dailyReviewService.getReviews()
        else if (tab === 'weekly') res = await weeklyReviewService.getReviews()
        else res = await monthlyReviewService.getMonthlyReviews()
        setData(res)
      } catch (e) { setError(formatApiError(e)) }
      finally { setLoading(false) }
    }
    load()
  }, [tab])

  const items = data?.data?.reviews || data?.reviews || data?.data || []

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <span className="section-eyebrow">REFLECTION</span>
          <h1>Reviews<span className="heading-period">.</span></h1>
          <p>Review your progress and reflect on what happened.</p>
        </div>
      </header>
      <div className="mb-3">
        {['daily','weekly','monthly'].map(t => (
          <button key={t} className={`btn btn-sm me-2 ${tab===t?'btn-primary':'btn-outline-secondary'}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>
      {loading ? <DashboardSkeleton /> : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          {Array.isArray(items) && items.length ? items.map((r,i) => (
            <div key={r._id||i} className="card mb-2">
              <div className="card-body">
                <pre style={{fontSize:12, whiteSpace:'pre-wrap'}}>{JSON.stringify(r, null, 2)}</pre>
              </div>
            </div>
          )) : <div className="text-muted p-4">No reviews yet.</div>}
        </div>
      )}
    </div>
  )
}