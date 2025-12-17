import axios from 'axios'
import { getToken } from '@/composables/token'

const generalApi = axios.create({
  baseURL: import.meta.env.VITE_API_GENERAL_BASE_URL,
})

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

  if (token) config.headers.Authorization = token
  return config
})

export default generalApi
