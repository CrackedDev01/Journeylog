import React from 'react'
export default function DashboardSkeleton({ label = 'Loading your progress' }) {
  return <div className="dashboard-skeleton" role="status" aria-label={label} aria-busy="true"><span className="visually-hidden">{label}</span><div className="skeleton-metrics" aria-hidden="true"><div className="skeleton-block" /><div className="skeleton-block" /><div className="skeleton-block" /></div><div className="skeleton-block skeleton-content" aria-hidden="true" /></div>
}
