import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="back-home">
        🏠 Back to Login
      </Link>
    </div>
  )
}

export default NotFound
