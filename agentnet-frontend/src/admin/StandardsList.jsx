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
        (s.status || '').toLowerCase().includes(term)
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
            placeholder="Search (slug, title, status)"
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
          <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wide bg-black/20 border-b border-gray-700">
            <div className="col-span-3">Title</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Updated</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {filtered.map(s => (
            <div
              key={s.slug}
              className="grid grid-cols-12 items-center px-4 py-3 border-b border-gray-800"
            >
              <div className="col-span-3">
                <div className="font-medium">{s.title || <span className="opacity-60">(untitled)</span>}</div>
                <div className="text-xs opacity-70 line-clamp-1">{s.description}</div>
              </div>
              <div className="col-span-3 text-sm">{s.slug}</div>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs ${
                    s.status === 'published'
                      ? 'bg-green-600/20 text-green-300 border border-green-700/40'
                      : 'bg-yellow-600/20 text-yellow-200 border border-yellow-700/40'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current inline-block" />
                  {s.status || 'draft'}
                </span>
              </div>
              <div className="col-span-3 text-sm">{formatDate(s.updatedAt)}</div>
              <div className="col-span-1 flex items-center justify-end gap-2">
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
