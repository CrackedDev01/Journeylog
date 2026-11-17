import React, { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import dashboardService from '../../services/dashboard.service'

const StreakBadge = ({ refreshKey = 0 }) => {
  const [streak, setStreak] = useState(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await dashboardService.getStreak()
        const data = response?.data?.data ?? response?.data ?? null
        if (active) {
          setStreak(data)
          setUnavailable(false)
        }
      } catch {
        if (active) setUnavailable(true)
      }
    }
    load()
    return () => { active = false }
  }, [refreshKey])

  if (unavailable && !streak) return null

  const count = streak?.currentStreak ?? 0
  const completedToday = streak?.completedToday ?? false
  const atRisk = streak?.streakAtRisk ?? false

  let message
  if (unavailable) {
    message = 'Streak unavailable right now.'
  } else if (count === 0) {
    message = 'Start your streak today by completing one meaningful activity.'
  } else if (completedToday) {
    message = "Today's streak is secured. Come back tomorrow to continue."
  } else if (atRisk) {
    message = `You've made progress for ${count} consecutive day${count === 1 ? '' : 's'}. Complete an activity today to keep it going.`
  } else {
    message = `You've made progress for ${count} consecutive day${count === 1 ? '' : 's'}.`
  }

  return (
    <div className="streak-badge d-flex align-items-center gap-2" role="status" aria-live="polite" title={message}>
      <Flame size={18} aria-hidden="true" />
      <span><strong>{count}</strong> Day Streak</span>
      <span className="visually-hidden">{message}</span>
    </div>
  )
}

export default StreakBadge
