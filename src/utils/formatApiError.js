// Utility function to format API error messages for display in UI

/**
 * Format API error response into a user-friendly message
 * @param {Object} error - Axios error object
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  // Handle network errors
  if (!error.response) {
    if (error.request) {
      // Request was made but no response received
      return 'Unable to connect to server. Please check your internet connection.'
    } else {
      // Error occurred while setting up the request
      return 'An error occurred while making the request.'
    }
  }

  const { status, data } = error.response

  // Handle 4xx errors (client errors)
  if (status >= 400 && status < 500) {
    // Handle validation errors from backend
    if (data && data.message) {
      return data.message
    }

    // Handle specific status codes
    switch (status) {
      case 400:
        return 'Bad request. Please check your input and try again.'
      case 401:
        return 'Invalid email or password. Please try again.'
      case 403:
        return 'You do not have permission to access this resource.'
      case 404:
        return 'The requested resource was not found.'
      case 429:
        return 'Too many requests. Please try again later.'
      default:
        return `Error ${status}: ${data.message || 'Client error'}`
    }
  }

  // Handle 5xx errors (server errors)
  if (status >= 500 && status < 600) {
    if (data && data.message) {
      return data.message
    }
    return 'Server error. Please try again later.'
  }

  // Fallback
  return error.message || 'An unknown error occurred'
}

/**
 * Format validation errors from backend
 * @param {Object} error - Axios error object with validation errors
 * @returns {Object} Object with field-specific errors
 */
export const formatValidationErrors = (error) => {
  if (!error.response || !error.response.data) {
    return {}
  }

  const { data } = error.response

  // Handle different validation error formats
  if (data.errors && typeof data.errors === 'object') {
    // Format: { errors: { field: ['error1', 'error2'] } }
    const formatted = {}
    for (const [field, messages] of Object.entries(data.errors)) {
      formatted[field] = messages[0] // Take first error message
    }
    return formatted
  }

  if (data.validationErrors) {
    // Format: { validationErrors: [{ field: 'email', message: 'Invalid email' }] }
    const formatted = {}
    data.validationErrors.forEach((err) => {
      formatted[err.field] = err.message
    })
    return formatted
  }

  return {}
}
