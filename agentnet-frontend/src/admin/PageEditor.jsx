// src/admin/PageEditor.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function PageEditor() {
  const { slug } = useParams()
  const nav = useNavigate()
  const isNew = slug === '__new'
  const [form, setForm] = useState({ slug: '', title: '', content_md: '', status: 'published' })

  useEffect(() => {
    if (!isNew) {
      api.get(`/pages/${slug}`)
        .then(({ data }) => setForm({ slug: data.slug, title: data.title, content_md: data.content_md, status: data.status }))
        .catch(() => {}) // if not published, might 404; consider an /admin/read endpoint if needed
    }
  }, [slug, isNew])

  async function save() {
    if (!form.slug || !form.title || !form.content_md) return
    await api.post('/pages', form)
    nav('/admin/pages')
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{isNew ? 'New Page' : 'Edit Page'}</h2>
      <div className="grid gap-3">
        <input className="px-3 py-2 rounded bg-white/10" placeholder="slug" value={form.slug} onChange={e=>setForm(f=>({...f, slug:e.target.value}))}/>
        <input className="px-3 py-2 rounded bg-white/10" placeholder="title" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))}/>
        <select className="px-3 py-2 rounded bg-white/10" value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value}))}>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <textarea className="px-3 py-2 rounded bg-white/10 min-h-[320px]" placeholder="Markdown content" value={form.content_md} onChange={e=>setForm(f=>({...f, content_md:e.target.value}))}/>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-brand text-surface" onClick={save}>Save</button>
        <button className="px-3 py-2 rounded bg-white/10" onClick={()=>nav('/admin/pages')}>Cancel</button>
      </div>
    </div>
  )
}
