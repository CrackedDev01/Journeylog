import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return <section className="state-page"><div className="state-card"><span className="state-icon"><Compass size={28} /></span><span className="section-eyebrow">404 · PAGE NOT FOUND</span><h1>A small detour</h1><p>This page may have moved, or the link may be incorrect. Let’s get you back to your day.</p><Link className="btn btn-primary d-inline-flex align-items-center gap-2" to="/app/today"><ArrowLeft size={16} />Back to my workspace</Link></div></section>
}
