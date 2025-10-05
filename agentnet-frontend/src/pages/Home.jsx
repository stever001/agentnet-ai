import { useEffect, useState } from 'react'
import axios from 'axios'
import MarkdownRenderer from '../components/MarkdownRenderer.jsx'

export default function Home(){
  const [data, setData] = useState(null)
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios.get(`${base}/api/pages/home`).then(r => setData(r.data)).catch(() => setData(null))
  }, [])
  return (
    <section>
      <div className="rounded-2xl p-8 bg-white/5 border border-white/10">
        <h1 className="text-3xl font-bold mb-2">AgentNet.ai</h1>
        <p className="text-muted mb-6">A registry and standards hub for agentic, machine-readable web content.</p>
        {data ? <MarkdownRenderer markdown={data.content_md} /> : <p>Loading…</p>}
      </div>
    </section>
  )
}
