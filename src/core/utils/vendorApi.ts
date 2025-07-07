import { getToken } from '@/composables/token'
import axios from 'axios'

const vendorAPI = axios.create({
  baseURL: import.meta.env.VITE_API_VENDOR_BASE_URL,
})

vendorAPI.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = token
  return config
})

export default vendorAPI
