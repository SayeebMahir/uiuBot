import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { register as apiRegister } from '../api'

export default function Register(){
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', studentId:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e)=> setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await apiRegister(form)
      nav('/login')
    }catch(err){
      setError(err?.response?.data?.message || 'Registration failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="card">
      <h2 className="heading">Create your uiuBot account</h2>
      <form onSubmit={onSubmit} className="col">
        <Input label="Full name" name="name" value={form.name} onChange={onChange} placeholder="e.g. Mahmud Hasan" />
        <div style={{ height: 8 }} />
        <Input label="University email" name="email" value={form.email} onChange={onChange} placeholder="name@uiu.ac.bd" />
        <div style={{ height: 8 }} />
        <Input label="Student ID" name="studentId" value={form.studentId} onChange={onChange} placeholder="e.g. 0112XXXXXX" />
        <div style={{ height: 8 }} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Strong password" />
        <div style={{ height: 12 }} />
        {error && <div className="muted" style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ height: 8 }} />
        <Button disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
      </form>
    </div>
  )
}

