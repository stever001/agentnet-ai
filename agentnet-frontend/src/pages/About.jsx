import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function About() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios.get(`${base}/api/pages/about`)
      .then(r => setPage(r.data))
      .catch(err => {
        console.error("Error fetching about page:", err)
        setPage(null)
      })
  }, [])

  if (!page) {
    return <p className="text-muted">About page is not available yet.</p>
  }

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <ReactMarkdown className="prose prose-invert">{page.content_md}</ReactMarkdown>
    </article>
  )
}

