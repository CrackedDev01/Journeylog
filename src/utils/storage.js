// Utility functions for handling auth token and user data in localStorage

const STORAGE_KEYS = {
  TOKEN: 'journeylog_token',
  USER: 'journeylog_user',
}

export const storage = {
  // Token functions
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  },
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },
  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  },

  // User functions
  setUser: (user) => {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(user)
    )
  },
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    return !!token
  },
}
