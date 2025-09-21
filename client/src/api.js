import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function register(data){
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function login(data){
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function verify(data){
  const res = await api.post('/auth/verify', data)
  return res.data
}

export async function logout(){
  const res = await api.post('/auth/logout')
  return res.data
}

export async function sendMessage(data){
  const res = await api.post('/chat/send', data)
  return res.data
}

export async function getHistory(threadId){
  const res = await api.get('/chat/history', { params: { threadId } })
  return res.data
}

