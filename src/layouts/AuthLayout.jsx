import React from 'react'
import { Outlet } from 'react-router-dom'
import { Check, ArrowUpRight, TrendingUp, LockKeyhole } from 'lucide-react'
import BrandMark from '../components/common/BrandMark'
import './AuthLayout.css'

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <div className="auth-frame">
        <section className="auth-story" aria-label="About JourneyLog">
          <div className="auth-brand"><BrandMark />JourneyLog</div>
          <div className="auth-story-copy">
            <span className="eyebrow"><span className="story-rule" /> SMALL STEPS. MEANINGFUL CHANGE.</span>
            <h2>A little more<br />intention.<br /><em>A lot more you.</em></h2>
            <p>A quiet space to plan your days, build better habits, and see how far you’ve come.</p>
          </div>
          <div className="auth-preview" aria-label="Illustrative weekly progress">
            <div className="preview-heading"><span className="eyebrow">THE POWER OF SHOWING UP</span><ArrowUpRight size={18} /></div>
            <div className="preview-habit"><span className="habit-check"><TrendingUp size={18} /></span><div><strong>Make time for yourself</strong><span>One small promise, every day</span></div></div>
            <div className="preview-days">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div key={index}><span>{day}</span><i className={index < 5 ? 'day-complete' : ''}>{index < 5 ? <Check size={15} /> : <span className="day-dot" />}</i></div>)}</div>
            <div className="preview-footer"><span>Consistency starts small.</span><span>Sample week</span></div>
          </div>
          <p className="auth-footnote">Less pressure. More progress.</p>
        </section>
        <section className="auth-form-pane" aria-label="Your account">
          <div className="auth-mobile-brand"><BrandMark />JourneyLog</div>
          <div className="auth-form-content"><Outlet /></div>
          <p className="auth-privacy"><LockKeyhole size={14} /> Your space. Your pace. Your next chapter.</p>
        </section>
      </div>
    </main>
  )
}
