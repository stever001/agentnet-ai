// src/admin/AdminLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('agentnet_admin_token')
    nav('/admin/login')
  }
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">AgentNet Admin</h1>
        <div className="flex gap-2">
          <Link className="px-3 py-2 rounded bg-white/10" to="/admin/pages">Pages</Link>
          <Link className="px-3 py-2 rounded bg-white/10" to="/admin/standards">Standards</Link>
          <button className="px-3 py-2 rounded bg-red-500/80" onClick={logout}>Logout</button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
