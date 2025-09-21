import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { verify as apiVerify } from '../api'

export default function TwoFactor(){
  const nav = useNavigate()
  const { state } = useLocation()
  const email = state?.email || ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await apiVerify({ email, code })
      nav('/chat')
    }catch(err){
      setError(err?.response?.data?.message || 'Verification failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="card">
      <h2 className="heading">Two-factor verification</h2>
      <div className="muted">A 6-digit code was sent to {email}</div>
      <form onSubmit={onSubmit}>
        <Input label="Code" value={code} onChange={(e)=> setCode(e.target.value)} placeholder="123456" maxLength={6} />
        <div style={{ height: 12 }} />
        {error && <div className="muted" style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ height: 8 }} />
        <Button disabled={loading || code.length!==6}>{loading ? 'Verifying...' : 'Verify'}</Button>
      </form>
    </div>
  )
}

