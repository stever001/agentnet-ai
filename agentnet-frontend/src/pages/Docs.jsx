// agentnet-frontend/src/pages/Docs.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

export default function Docs() {
  const [pages, setPages] = useState([])
  const [doc, setDoc] = useState(null)
  const { slug } = useParams()

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios.get(`${base}/api/pages`)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : []
        setPages(data.filter(p => p.slug.startsWith('docs') || p.slug === 'docs'))
      })
      .catch(err => {
        console.error("Error fetching docs list:", err)
        setPages([])
      })
  }, [])

  useEffect(() => {
    if (!slug) return
    const base = import.meta.env.VITE_API_BASE
    axios.get(`${base}/api/pages/${slug}`)
      .then(r => setDoc(r.data))
      .catch(err => {
        console.error("Error fetching doc page:", err)
        setDoc(null)
      })
  }, [slug])

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="col-span-1 border-r border-white/10 pr-4">
        <h2 className="text-lg font-semibold mb-3">Docs</h2>
        <ul className="space-y-2">
          {pages.map(p => (
            <li key={p.id}>
              <Link 
                to={`/docs/${p.slug}`} 
                className="hover:underline text-brand"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <section className="col-span-3">
        {doc ? (
          <article>
            <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
            <ReactMarkdown className="prose prose-invert">{doc.content_md}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-muted">Select a document from the sidebar.</p>
        )}
      </section>
    </div>
  )
}
