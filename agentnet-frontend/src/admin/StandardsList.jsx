// agentnet-frontend/src/admin/StandardsList.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function formatDate(dt) {
  if (!dt) return ''
  try {
    const d = new Date(dt)
    return d.toLocaleString()
  } catch {
    return dt
  }
}

export default function StandardsList() {
  const [standards, setStandards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const nav = useNavigate()

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/standards/all')
      setStandards(data || [])
    } catch (e) {
      console.error(e)
      setError('Failed to load standards.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return standards
    return standards.filter(s => {
      return (
        (s.slug || '').toLowerCase().includes(term) ||
        (s.title || '').toLowerCase().includes(term) ||
        (s.description || '').toLowerCase().includes(term) ||
        (s.status || '').toLowerCase().includes(term) ||
        (s.version || '').toLowerCase().includes(term)
      )
    })
  }, [q, standards])

  async function onDelete(slug) {
    const yes = window.confirm(`Delete standard "${slug}"? This cannot be undone.`)
    if (!yes) return
    try {
      await api.delete(`/standards/${encodeURIComponent(slug)}`)
      await load()
    } catch (e) {
      console.error(e)
      alert('Delete failed.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Standards</h2>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search (title, version, status)"
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none"
          />
          <button
            onClick={() => nav('/admin/standards/__new')}
            className="px-3 py-2 rounded bg-indigo-600 text-white"
          >
            New Standard
          </button>
        </div>
      </div>

      {error && <div className="text-red-400">{error}</div>}
      {loading ? (
        <div className="text-sm opacity-70">Loading standards…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm opacity-70">No standards found.</div>
      ) : (
        <div className="overflow-hidden rounded border border-gray-700">
          {/* ✅ Column headers updated */}
          <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wide bg-black/20 border-b border-gray-700">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Version</div>
            <div className="col-span-3">Updated</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filtered.map(s => (
            <div
              key={s.slug}
              className="grid grid-cols-12 items-center px-4 py-3 border-b border-gray-800"
            >
              {/* Title */}
              <div className="col-span-4">
                <div className="font-medium">
                  {s.title || <span className="opacity-60">(untitled)</span>}
                </div>
                <div className="text-xs opacity-70 line-clamp-1">{s.description}</div>
              </div>

              {/* Version */}
              <div className="col-span-2 text-sm font-mono">
                {s.version ? `v${s.version}` : '—'}
              </div>

              {/* Updated */}
              <div className="col-span-3 text-sm">{formatDate(s.updatedAt)}</div>

              {/* Status */}
              <div className="col-span-1 text-center text-sm font-medium">
                <span
                  className={
                    s.status === 'published' ? 'text-slate-200' : 'text-gray-500'
                  }
                >
                  {s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : 'Draft'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  to={`/admin/standards/${encodeURIComponent(s.slug)}`}
                  className="px-2 py-1 rounded border border-gray-600 hover:border-gray-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(s.slug)}
                  className="px-2 py-1 rounded bg-red-600/80 text-white hover:bg-red-600"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
