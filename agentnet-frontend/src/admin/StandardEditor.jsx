// agentnet-frontend/src/admin/StandardEditor.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

const EMPTY = {
  slug: '',
  title: '',
  description: '',
  content_md: '',
  status: 'draft', // 'draft' | 'published'
}

export default function StandardEditor() {
  const { slug } = useParams()
  const isNew = slug === '__new'
  const nav = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [origSlug, setOrigSlug] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadExisting() {
      setLoading(true)
      setError('')
      try {
        // Use the admin list so we can edit drafts too
        const { data } = await api.get('/standards/all')
        const found = (data || []).find(s => s.slug === slug)
        if (!cancelled) {
          if (!found) {
            setError('Standard not found.')
          } else {
            setForm({
              slug: found.slug || '',
              title: found.title || '',
              description: found.description || '',
              content_md: found.content_md || '',
              status: found.status || 'draft',
            })
            setOrigSlug(found.slug || '')
          }
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('Failed to load standard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (!isNew) loadExisting()
    else {
      setForm(EMPTY)
      setOrigSlug('')
    }

    return () => {
      cancelled = true
    }
  }, [slug, isNew])

  async function save() {
    setSaving(true)
    setError('')
    try {
      if (!form.slug || !form.title || !form.content_md) {
        setError('Please fill slug, title, and content.')
        setSaving(false)
        return
      }

      // Upsert
      await api.post('/standards', {
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description || '',
        content_md: form.content_md,
        status: form.status || 'draft',
      })

      // If editing + slug changed, optionally remove the old one to avoid duplicates
      if (!isNew && origSlug && origSlug !== form.slug.trim()) {
        try {
          await api.delete(`/standards/${encodeURIComponent(origSlug)}`)
        } catch (e) {
          console.warn('Old slug cleanup failed (non-fatal):', e)
        }
      }

      nav('/admin/standards')
    } catch (e) {
      console.error(e)
      setError('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (isNew) return
    const yes = window.confirm(`Delete "${origSlug}"? This cannot be undone.`)
    if (!yes) return
    try {
      await api.delete(`/standards/${encodeURIComponent(origSlug)}`)
      nav('/admin/standards')
    } catch (e) {
      console.error(e)
      alert('Delete failed.')
    }
  }

  if (loading) {
    return <div className="opacity-70 text-sm">Loading…</div>
  }
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-400">{error}</div>
        <button
          className="px-3 py-2 rounded border border-gray-600"
          onClick={() => nav('/admin/standards')}
        >
          Back to list
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isNew ? 'New Standard' : `Edit: ${origSlug}`}
        </h2>
        {!isNew && (
          <button
            onClick={remove}
            className="px-3 py-2 rounded bg-red-600/80 text-white hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm opacity-80">Slug</span>
          <input
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            placeholder="unique-identifier"
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Title</span>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Human-readable title"
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Status</span>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Description (optional)</span>
          <input
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Short summary for lists/previews"
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Content (Markdown)</span>
          <textarea
            value={form.content_md}
            onChange={e => setForm(f => ({ ...f, content_md: e.target.value }))}
            placeholder="# Heading\n\nBody text in **Markdown**…"
            className="px-3 py-2 rounded border border-gray-700 bg-transparent outline-none min-h-[320px]"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          disabled={saving}
          onClick={save}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => nav('/admin/standards')}
          className="px-4 py-2 rounded border border-gray-600"
        >
          Cancel
        </button>
      </div>

      {/* Optional: simple live preview */}
      {form.content_md?.trim() && (
        <details className="mt-6">
          <summary className="cursor-pointer opacity-80">Raw Markdown preview</summary>
          <pre className="mt-3 whitespace-pre-wrap text-sm opacity-90 border border-gray-700 rounded p-3">
            {form.content_md}
          </pre>
        </details>
      )}
    </div>
  )
}
