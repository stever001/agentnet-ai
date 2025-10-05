// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Standards from './pages/Standards.jsx'
import Docs from './pages/Docs.jsx'
import Page from './pages/Page.jsx'   // ✅ dynamic page
import StandardDetail from './pages/StandardDetail.jsx' // ✅ NEW

// --- Admin imports ---
import AdminLogin from './admin/AdminLogin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import PagesList from './admin/PagesList.jsx'
import PageEditor from './admin/PageEditor.jsx'
import StandardsList from './admin/StandardsList.jsx'
import StandardEditor from './admin/StandardEditor.jsx'

// Simple client-side guard for admin JWT
function RequireAdmin({ children }) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('agentnet_admin_token')
    : null
  return token ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/standards/:slug" element={<StandardDetail />} /> {/* ✅ NEW */}
          <Route path="/docs/:slug?" element={<Docs />} />

          {/* Admin: keep ABOVE the dynamic slug route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<PagesList />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/:slug" element={<PageEditor />} />
            <Route path="standards" element={<StandardsList />} />
            <Route path="standards/:slug" element={<StandardEditor />} />
          </Route>

          {/* Dynamic content pages (published only) */}
          <Route path="/:slug" element={<Page />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
