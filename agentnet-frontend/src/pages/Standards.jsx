// agentnet-frontend/src/pages/Standards.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Standards() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || '' // ✅ fallback to proxy
    axios.get(`${base}/api/standards`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setItems(res.data)
        } else {
          console.error("Unexpected response:", res.data)
          setItems([])
        }
      })
      .catch(err => {
        console.error("Error fetching standards:", err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <h1 className="text-3xl font-bold mb-4">Standards</h1>
        <p className="text-muted">Loading standards…</p>
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Standards</h1>
      <p className="text-muted mb-6">
        Living standards for agent registration, capsules, and more.
      </p>

      <ul className="grid gap-4">
        {items.length === 0 && (
          <li className="text-muted">No standards published yet.</li>
        )}
        {items.map(it => (
          <li
            key={it.id}
            className="rounded-xl border border-white/10 p-4 hover:bg-white/5 transition"
          >
            <Link
              to={`/standards/${it.slug}`}
              className="text-lg font-semibold underline"
            >
              {it.title}
            </Link>
            <div className="text-xs text-muted mt-1">
              v{it.version} • updated {new Date(it.updatedAt).toLocaleString()}
            </div>
            {it.summary && <p className="mt-2">{it.summary}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
