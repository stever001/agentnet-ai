// src/components/Navbar.jsx
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const linkBase = 'px-3 py-2 rounded-xl hover:opacity-90 transition'
const active = 'bg-brand text-surface'
const inactive = 'text-ink/80'

export default function Navbar() {
  const [extraPages, setExtraPages] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  const baseLinks = [
    { slug: 'about', label: 'About' },
    { slug: 'standards', label: 'Standards' },
    { slug: 'docs', label: 'Docs' }
  ]

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios
      .get(`${base}/api/pages`)
      .then(r => {
        const filtered = r.data.filter(
          p =>
            !['home', 'about', 'docs', 'standards'].includes(
              p.slug.toLowerCase()
            )
        )
        setExtraPages(filtered)
      })
      .catch(err => {
        console.error('Error fetching nav pages:', err)
        setExtraPages([])
      })
  }, [])

  const allLinks = [
    ...baseLinks,
    ...extraPages.map(p => ({ slug: p.slug, label: p.title }))
  ]

  return (
    <header className="w-full border-b border-white/10 bg-surface/80 backdrop-blur relative z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold">
          AgentNet.ai
        </Link>

        {/* Fixed minimal links */}
        <nav className="flex items-center gap-2">
          {baseLinks.map(l => (
            <NavLink
              key={l.slug}
              to={`/${l.slug}`}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger always visible */}
        <button
          className="px-3 py-2 rounded-xl hover:bg-white/10 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Slide-in drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dim background */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer panel */}
            <motion.aside
              className="fixed top-0 right-0 h-full w-64 bg-surface border-l border-white/10 shadow-xl z-50 p-6 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl hover:opacity-80"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {allLinks.map(l => (
                  <NavLink
                    key={l.slug}
                    to={`/${l.slug}`}
                    className={({ isActive }) =>
                      `block ${linkBase} ${
                        isActive ? active : inactive
                      } hover:bg-white/10`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
