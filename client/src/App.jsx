import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TwoFactor from './pages/TwoFactor'
import Chat from './pages/Chat'

function Nav() {
  return (
    <nav className="navbar">
      <div className="brand">uiuBot</div>
      <div className="links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/chat">Chat</Link>
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

