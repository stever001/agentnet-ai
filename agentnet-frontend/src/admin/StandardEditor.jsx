// agentnet-frontend/src/admin/StandardEditor.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function StandardEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [groups, setGroups] = useState([])

  const [groupSelection, setGroupSelection] = useState('')
  const [customGroup, setCustomGroup] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    version: '',
    summary: '',
    content_md: '',
    group: '',
    section: '',
    status: 'draft',
  })

  // --- Fetch available groups for dropdown ---
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || ''
    const token = localStorage.getItem('agentnet_admin_token')
    if (!token) return
    axios
      .get(`${base}/api/standards/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroups(res.data || []))
      .catch((err) => {
        console.warn('Warning: could not fetch groups:', err.message)
        setGroups([])
      })
  }, [])

  // --- Load existing standard for editing (skip __new) ---
  useEffect(() => {
    if (!slug || slug === '__new') {
      setLoading(false)
      return
    }

    const base = import.meta.env.VITE_API_BASE || ''
    const token = localStorage.getItem('agentnet_admin_token')

    axios
      .get(`${base}/api/standards/admin/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          // normalize status to lowercase for consistency
          const normalized = {
            ...res.data,
            status: res.data.status ? res.data.status.toLowerCase() : 'draft',
          }
          setForm((prev) => ({ ...prev, ...normalized }))
          setGroupSelection(res.data.group || '')
        }
      })
      .catch((err) => {
        console.error('Error fetching standard:', err)
        setError('Failed to load standard')
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const base = import.meta.env.VITE_API_BASE || ''
      const token = localStorage.getItem('agentnet_admin_token')
      const headers = { Authorization: `Bearer ${token}` }

      const payload = { ...form }

      // merge custom group if used
      if (groupSelection === '__custom' && customGroup.trim()) {
        payload.group = customGroup.trim()
      } else {
        payload.group = groupSelection || form.group
      }

      // ensure status stays lowercase
      if (payload.status) payload.status = payload.status.toLowerCase()

      // create or update
      if (!slug || slug === '__new') {
        await axios.post(`${base}/api/standards`, payload, { headers })
      } else {
        await axios.put(`${base}/api/standards/${slug}`, payload, { headers })
      }

      navigate('/admin/standards')
    } catch (err) {
      console.error('Error saving standard:', err)
      setError('Failed to save standard')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4 text-slate-900">Standard Editor</h1>
        <p className="text-slate-500">Loading…</p>
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-slate-900">
        {slug && slug !== '__new' ? 'Edit Standard' : 'Create Standard'}
      </h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug || ''}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          />
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Version</label>
          <input
            type="text"
            name="version"
            value={form.version || ''}
            onChange={handleChange}
            placeholder="e.g. 1.0.0"
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          />
        </div>

        {/* Group (dropdown + optional new entry) */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Group</label>
          <select
            value={groupSelection || form.group || ''}
            onChange={(e) => {
              const val = e.target.value
              setGroupSelection(val)
              if (val !== '__custom') {
                setCustomGroup('')
                setForm((prev) => ({ ...prev, group: val }))
              }
            }}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          >
            <option value="">-- Select Group --</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
            <option value="__custom">+ Create New Group</option>
          </select>

          {groupSelection === '__custom' && (
            <input
              type="text"
              value={customGroup}
              onChange={(e) => setCustomGroup(e.target.value)}
              placeholder="Enter new group name"
              className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            />
          )}
        </div>

        {/* Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Section</label>
          <input
            type="number"
            name="section"
            step="0.1"
            value={form.section || ''}
            onChange={handleChange}
            placeholder="e.g. 7.3"
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Summary</label>
          <textarea
            name="summary"
            value={form.summary || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
          />
        </div>

        {/* Markdown content */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Content (Markdown)
          </label>
          <textarea
            name="content_md"
            value={form.content_md || ''}
            onChange={handleChange}
            rows={10}
            required
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-800"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            value={form.status?.toLowerCase() || 'draft'}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={`mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 ${
              form.status === 'published' ? 'text-slate-800' : 'text-gray-500'
            }`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Standard'}
          </button>
        </div>
      </form>
    </section>
  )
}
