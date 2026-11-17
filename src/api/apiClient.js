import axios from 'axios'

// Use the hosted API unless an environment-specific backend is configured.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://journeylog-backend.vercel.app/api/v1',
})

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('journeylog_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (token expired or invalid). 503 means the backend
    // itself could not reach the database — never log the user out for that.
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('journeylog_token')
      localStorage.removeItem('journeylog_user')
      // Note: Actual redirect should be handled in AuthContext or via router
      // This is just to prevent infinite loops
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        // Dispatch event or call auth context to handle redirect
        window.dispatchEvent(new Event('authExpired'))
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
