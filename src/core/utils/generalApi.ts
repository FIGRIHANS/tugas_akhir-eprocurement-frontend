import axios from 'axios'
import { getToken } from '@/composables/token'

const generalApi = axios.create({
  baseURL: import.meta.env.VITE_API_GENERAL_BASE_URL,
})

const generateRequestId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {}
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

generalApi.interceptors.request.use((config) => {
  let token = getToken()
  if (!token) {
    try {
      const sessionData = localStorage.getItem('session_data')
      if (sessionData) {
        const params = new URLSearchParams(sessionData)
        const t = params.get('token_dts')
        if (t) token = t
      }
    } catch {
      // ignore
    }
  }

  if (!config.headers) config.headers = {} as any
  if (token) config.headers.Authorization = token
  // attach x-request-id for tracing
  if (!config.headers['x-request-id'] && !config.headers['X-Request-Id']) {
    config.headers['x-request-id'] = generateRequestId()
  }
  return config
})

export default generalApi
