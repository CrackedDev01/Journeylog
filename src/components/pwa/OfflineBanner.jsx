import React, { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

const OfflineBanner = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="alert alert-warning d-flex align-items-center gap-2 mb-3" role="alert">
      <WifiOff size={17} aria-hidden="true" />
      <span>
        You're offline. JourneyLog needs an internet connection to save or load your data —
        please reconnect and try again.
      </span>
    </div>
  )
}

export default OfflineBanner
