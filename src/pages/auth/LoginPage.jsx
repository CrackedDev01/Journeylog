import React from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lightbulb } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const result = await login({ email: formData.get('email'), password: formData.get('password') })
    setSubmitting(false)
    if (result.success) {
      navigate(location.state?.from?.pathname || '/app/dashboard', { replace: true })
    } else {
      setError(result.error || 'We could not sign you in. Check your details and try again.')
    }
  }

  return (
    <div className="auth-form">
      <div className="auth-form-heading">
        <span className="auth-kicker"><Lightbulb size={14} /> YOUR NEXT CHAPTER</span>
        <h1>Welcome back</h1>
        <p>Pick up where you left off. Your progress is waiting.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={submitting}>
        {error && <div className="alert alert-danger auth-alert" role="alert">{error}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email address</label>
          <input className="form-control auth-control" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="password-control">
            <input className="form-control auth-control" id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required />
            <button className="icon-button password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        <button className="btn btn-primary auth-submit w-100" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : <>Sign in <ArrowRight size={17} /></>}
        </button>
      </form>
      <p className="auth-switch">New to JourneyLog? <Link to="/register">Create an account</Link></p>
    </div>
  )
}

export default LoginPage
