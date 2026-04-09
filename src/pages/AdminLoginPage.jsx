import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isAdminAuthenticated, loginAdmin } from '../data/adminAuth'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const fromPath = location.state?.from?.pathname
  const redirectTo = typeof fromPath === 'string' && fromPath ? fromPath : '/admin/'

  if (isAdminAuthenticated()) {
    return <Navigate to={redirectTo} replace />
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (loginAdmin(password)) {
      navigate(redirectTo, { replace: true })
      return
    }
    setError('Incorrect password')
  }

  return (
    <div className="admin-page admin-login-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          <span>Admin login</span>
        </nav>
        <h1 className="admin-page__title">Admin login</h1>
        <p className="admin-page__intro">Enter password to access admin pages.</p>

        <form className="admin-login-page__form" onSubmit={onSubmit} noValidate>
          <label className="sale-field sale-field--wide">
            <span className="sale-field__label">Password</span>
            <input
              type="password"
              className="sale-field__input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? (
            <p className="addcar-page__alert addcar-page__alert--error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="addcar-form__actions">
            <button type="submit" className="sale-btn sale-btn--primary">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
