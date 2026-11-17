// Utility function for formatting dates

/**
 * Format a date using browser's locale settings
 * @param {Date} date - Date to format
 * @param {Object} options - Formatting options (passed to toLocaleDateString)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return new Date().toLocaleDateString(undefined, options)
  }
  
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

/**
 * Format time in HH:MM format
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return '--:--'
  }
  
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Calculate time difference between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Object} Object with hours, minutes, seconds
 */
export const formatDuration = (start, end) => {
  if (!(start instanceof Date) || isNaN(start) || 
      !(end instanceof Date) || isNaN(end)) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }
  
  const diffMs = end - start
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return { hours, minutes, seconds }
}

/**
 * Format duration as HH:MM string
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} Formatted duration string
 */
export const formatDurationHM = (start, end) => {
  const { hours, minutes } = formatDuration(start, end)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const getMonthName = (monthNumber) => {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) return ''
  return MONTH_NAMES[monthNumber - 1]
}

export const formatMonthYear = (year, monthNumber) => {
  const name = getMonthName(monthNumber)
  return name ? `${name} ${year}` : `${year}`
}

export default { formatDate, formatTime, formatDuration, formatDurationHM, MONTH_NAMES, getMonthName, formatMonthYear }
