// agentnet-frontend/src/lib/api.js
import axios from 'axios'

/**
 * Resolve API base:
 * - If VITE_API_BASE is set (e.g., http://localhost:5174), use it.
 * - Otherwise, default to same-origin and rely on /api (proxy or server).
 */
const envBase = (import.meta.env?.VITE_API_BASE || '').trim()
const base = envBase ? envBase.replace(/\/$/, '') : '' // '' -> same origin
const baseURL = `${base}/api`

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

/** Token helpers */
export function setAdminToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agentnet_admin_token', token)
  }
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('agentnet_admin_token')
  }
}

function isAdminPath() {
  if (typeof window === 'undefined') return false
  return window.location?.pathname?.startsWith('/admin')
}

/** Attach Authorization header if we have a token */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('agentnet_admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Handle auth errors: auto-logout on admin routes */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if ((status === 401 || status === 403) && isAdminPath()) {
      clearAdminToken()
      // avoid redirect loops if already on login
      if (!window.location.pathname.startsWith('/admin/login')) {
        const reason = status === 401 ? 'expired' : 'forbidden'
        window.location.assign(`/admin/login?reason=${reason}`)
      }
    }
    return Promise.reject(err)
  }
)

export default api
