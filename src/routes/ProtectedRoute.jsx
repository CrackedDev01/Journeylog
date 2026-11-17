import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Route component that requires authentication
 * Redirects to login if not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="dashboard-loading">
      <span className="spinner-border spinner-border-sm" role="status" />
      <span>Getting your space ready...</span>
    </div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Render protected routes
  return <Outlet />
}

export default ProtectedRoute
