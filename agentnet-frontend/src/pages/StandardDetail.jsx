// agentnet-frontend/src/pages/StandardDetail.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function StandardDetail() {
  const { slug } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || ''
    axios.get(`${base}/api/standards/${slug}`)
      .then(r => {
        setDoc(r.data)
      })
      .catch(err => {
        console.error("Error loading standard:", err)
        setDoc(null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <div className="p-6 text-muted">Loading…</div>
  }

  if (!doc) {
    return <div className="p-6 text-red-400">Standard not found.</div>
  }

  return (
    <article className="prose prose-invert max-w-3xl mx-auto p-6">
      <h1>{doc.title}</h1>
      {doc.version && (
        <p className="text-sm text-gray-400">Version {doc.version}</p>
      )}
      <ReactMarkdown>{doc.content_md}</ReactMarkdown>
    </article>
  )
}
