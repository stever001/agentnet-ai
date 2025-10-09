import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/admin/login', { email, password })
      if (data?.ok && data?.token) {
        localStorage.setItem('agentnet_admin_token', data.token)
        nav('/admin') // redirect to dashboard
      } else {
        setError('Login failed — invalid credentials')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError('Invalid email or password')
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 bg-white/10 p-6 rounded-xl border border-white/10">
        <input
          type="email"
          required
          placeholder="Email"
          className="px-3 py-2 rounded bg-white/10 border border-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="px-3 py-2 rounded bg-white/10 border border-white/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-400 text-center">{error}</div>}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-brand text-surface font-semibold hover:opacity-90 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
