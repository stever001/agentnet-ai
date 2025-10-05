// src/admin/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/admin/login', { password })
      localStorage.setItem('agentnet_admin_token', data.token)
      nav('/admin')
    } catch (err) {
      setError('Invalid password')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="password"
          className="px-3 py-2 rounded bg-white/10 border border-white/10"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button className="px-4 py-2 rounded bg-brand text-surface">Login</button>
      </form>
    </div>
  )
}
