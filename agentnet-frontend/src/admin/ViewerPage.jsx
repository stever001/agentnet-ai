// agentnet-frontend/src/admin/ViewerPage.jsx
import { useEffect, useState } from 'react'
import viewerAPI from '../utils/viewerApi'

// simple relative time helper
function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

// color-coded score badge
function ScoreBar({ score }) {
  let color = 'bg-green-500'
  if (score < 70) color = 'bg-yellow-400'
  if (score < 40) color = 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-sm font-medium">{score}</span>
    </div>
  )
}

// hint badge
function HintBadge({ level }) {
  const styles = {
    good: 'bg-green-100 text-green-700',
    warn: 'bg-yellow-100 text-yellow-700',
    bad: 'bg-red-100 text-red-700',
  }
  const text =
    level === 'good' ? 'Optimized' :
    level === 'warn' ? 'Needs Review' :
    'Needs Update'

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[level]}`}>
      {text}
    </span>
  )
}

export default function ViewerPage() {
  const [nodes, setNodes] = useState([])
  const [capsules, setCapsules] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await viewerAPI.get('/nodes')
        setNodes(res.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load nodes')
      } finally {
        setLoading(false)
      }
    }
    fetchNodes()
  }, [])

  async function handleSelectNode(nodeId) {
    setSelectedNode(nodeId)
    setCapsules([])
    try {
      const res = await viewerAPI.get(`/node/${nodeId}`)
      setCapsules(res.data.capsules || [])
    } catch (err) {
      console.error('Error loading capsules:', err)
    }
  }

  if (loading) return <p>Loading Node & Capsule Viewer...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Node & Capsule Viewer</h1>
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Domain</th>
              <th className="px-3 py-2">Capsules</th>
              <th className="px-3 py-2">Last Crawl</th>
              <th className="px-3 py-2">AIO Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n) => (
              <tr
                key={n.id}
                onClick={() => handleSelectNode(n.id)}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedNode === n.id ? 'bg-gray-50' : ''
                }`}
              >
                <td className="px-3 py-2 font-mono text-xs">{n.id}</td>
                <td className="px-3 py-2">{n.domain}</td>
                <td className="px-3 py-2">{n.capsuleCount}</td>
                <td className="px-3 py-2">{timeAgo(n.lastCrawl)}</td>
                <td className="px-3 py-2">
                  {n.capsuleCount >= 5 ? (
                    <HintBadge level="good" />
                  ) : n.capsuleCount >= 3 ? (
                    <HintBadge level="warn" />
                  ) : (
                    <HintBadge level="bad" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNode && (
        <div className="mt-6 p-4 border rounded-xl shadow-sm bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">
            Capsules for <span className="font-mono text-sm">{selectedNode}</span>
          </h2>
          {capsules.length === 0 ? (
            <p className="text-sm text-gray-500">No capsules found.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Capsule ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">AIO Score</th>
                </tr>
              </thead>
              <tbody>
                {capsules.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-3 py-2 font-mono text-xs">{c.id}</td>
                    <td className="px-3 py-2">{c.type}</td>
                    <td className="px-3 py-2">
                      <ScoreBar score={c.aioScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
