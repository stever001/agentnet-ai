// src/admin/PagesList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function PagesList() {
  const [pages, setPages] = useState([])

  async function load() {
    const { data } = await api.get('/pages/all')
    setPages(data)
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pages</h2>
        <Link className="px-3 py-2 rounded bg-brand text-surface" to="/admin/pages/__new">New Page</Link>
      </div>
      <div className="border border-white/10 rounded">
        {pages.map(p => (
          <div key={p.slug} className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-white/60">{p.slug} • {p.status}</div>
            </div>
            <div className="flex gap-2">
              <Link className="px-2 py-1 rounded bg-white/10" to={`/admin/pages/${p.slug}`}>Edit</Link>
              <button
                className="px-2 py-1 rounded bg-red-500/80"
                onClick={async () => { await api.delete(`/pages/${p.slug}`); load() }}
              >Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
