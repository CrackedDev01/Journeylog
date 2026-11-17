// Manual service-worker registration + update/offline state.
// Uses injectRegister: false so registration only happens in production builds
// and never interferes with `vite dev`.
let updateHandler = null
let waitingWorker = null

export const onServiceWorkerUpdate = (handler) => {
  updateHandler = handler
}

const notifyUpdate = (registration) => {
  waitingWorker = registration.waiting || null
  if (typeof updateHandler === 'function') updateHandler()
}

export const applyServiceWorkerUpdate = () => {
  if (waitingWorker) {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    waitingWorker = null
  } else {
    window.location.reload()
  }
}

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return
  if (!import.meta.env.PROD) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (registration.waiting) notifyUpdate(registration)
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing
          if (!worker) return
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUpdate(registration)
            }
          })
        })
      })
      .catch(() => {
        // Service worker is an enhancement; the app works without it.
      })
  })
}

export const isStandaloneDisplay = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true
