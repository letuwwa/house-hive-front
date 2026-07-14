import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    identifier: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await dispatch(login(form)).unwrap() //errors in the backend get caught
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <h1>Login</h1>
      <p></p>

      {error && <p className="error-msg">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email or Username
          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default Login