import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const result = await register({ name: formData.get('name'), email: formData.get('email'), password: formData.get('password') })
    setSubmitting(false)
    if (result.success) {
      navigate('/app/dashboard', { replace: true })
    } else {
      setError(result.error || 'We could not create your account. Please try again.')
    }
  }

  return (
    <div className="auth-form">
      <div className="auth-form-heading">
        <span className="auth-kicker">A GOOD DAY TO BEGIN</span>
        <h1>Start your journey</h1>
        <p>A little structure for the things you want to become.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={submitting}>
        {error && <div className="alert alert-danger auth-alert" role="alert">{error}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="name">Your name</label>
          <input className="form-control auth-control" id="name" name="name" type="text" autoComplete="name" placeholder="Your full name" required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email address</label>
          <input className="form-control auth-control" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="password-control">
            <input className="form-control auth-control" id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" placeholder="At least 8 characters" required />
            <button className="icon-button password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        <button className="btn btn-primary auth-submit w-100" type="submit" disabled={submitting}>
          {submitting ? 'Creating your account...' : <>Create account <ArrowRight size={17} /></>}
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  )
}

export default RegisterPage
