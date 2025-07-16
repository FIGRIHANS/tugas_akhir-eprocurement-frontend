import axios from 'axios'
import { getToken } from '@/composables/token'

const vendorApi = axios.create({
  baseURL: import.meta.env.VITE_API_VENDOR_BASE_URL,
})

vendorApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = token
  return config
})

export default vendorApi
