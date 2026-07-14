import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../features/auth/authSlice'

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
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
      await dispatch(register(form)).unwrap()
      navigate('/FindHouse')
    } catch (err) {
      setError(err || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <h1>Register</h1>
      <p>Create an account to get your personal profile.</p>

      {error && <p className="error-msg">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            maxLength={255}
            required
          />
        </label>

        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </label>

        <label>
          First name
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            maxLength={30}
            required
          />
        </label>

        <label>
          Last name
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            maxLength={30}
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
            minLength={8}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>

      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}

export default Register