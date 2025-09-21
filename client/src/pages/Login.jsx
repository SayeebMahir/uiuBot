import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { login as apiLogin } from '../api'

export default function Login(){
  const nav = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e)=> setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await apiLogin(form)
      nav('/two-factor', { state: { email: form.email } })
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="card">
      <h2 className="heading">Login to uiuBot</h2>
      <form onSubmit={onSubmit}>
        <Input label="University email" name="email" value={form.email} onChange={onChange} placeholder="name@uiu.ac.bd" />
        <div style={{ height: 8 }} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Your password" />
        <div style={{ height: 12 }} />
        {error && <div className="muted" style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ height: 8 }} />
        <Button disabled={loading}>{loading ? 'Sending code...' : 'Continue'}</Button>
      </form>
    </div>
  )
}

