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
      <section className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Standards</h1>
        <p className="text-slate-500">Loading standards…</p>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        AgentNet Standards
      </h1>

      {/* optional tagline — commented out for now */}
      {/*
      <p className="text-slate-600 mb-6">
        Living standards for agent registration, capsules, and interoperability.
      </p>
      */}

      <ul className="grid gap-5">
        {items.length === 0 && (
          <li className="text-slate-500">No standards published yet.</li>
        )}

        {items.map(it => (
          <li
            key={it.id}
            className="rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition"
          >
            <Link
              to={`/standards/${it.slug}`}
              className="text-lg font-semibold underline text-slate-900 hover:text-blue-700"
            >
              {it.title}
            </Link>

            {/* Version + Updated line */}
            <div className="text-xs text-slate-500 mt-1">
              {it.version ? `v${it.version}` : 'v0.x'} • updated{" "}
              {it.updatedAt
                ? new Date(it.updatedAt).toLocaleString()
                : 'unknown'}
            </div>

            {it.summary && (
              <p className="mt-2 text-slate-700 leading-relaxed">
                {it.summary}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
