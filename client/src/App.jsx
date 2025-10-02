import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import TwoFactor from './pages/TwoFactor'
import Chat from './pages/Chat'
import { logout as apiLogout } from './api'

function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const isAuthRoute = ['/login', '/register', '/two-factor'].includes(location.pathname)

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoggingOut(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <nav className="navbar">
      <div className="brand">uiuBot</div>
      <div className="links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/chat">Chat</Link>
        {!isAuthRoute && (
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        )}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/two-factor" element={<TwoFactor />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  )
}