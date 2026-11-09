import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Lost & Found Portal
        </Link>
        <div className="navbar-links">
          <Link to="/browse">Browse Items</Link>
          {user ? (
            <>
              <span className="navbar-user">Hello, {user.full_name}</span>
              {user.role === 'admin' && (
                <Link to="/admin">Admin Dashboard</Link>
              )}
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
