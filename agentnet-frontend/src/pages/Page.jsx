// src/pages/Page.jsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function Page() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios
      .get(`${base}/api/pages/${slug}`)
      .then((res) => setPage(res.data))
      .catch((err) => {
        console.error("Error fetching page:", err)
        setError("Page not found.")
      })
  }, [slug])

  if (error) return <div className="text-red-500">{error}</div>
  if (!page) return <div>Loading...</div>

  return (
    <article className="prose prose-invert max-w-none">
      <h1>{page.title}</h1>
      <ReactMarkdown>{page.content_md}</ReactMarkdown>
    </article>
  )
}
