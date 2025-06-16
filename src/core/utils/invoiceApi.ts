import axios from 'axios'
import { getToken } from '@/composables/token'

const invoiceApi = axios.create({
  baseURL: import.meta.env.VITE_API_INVOICE_BASE_URL,
})

invoiceApi.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = token
    return config
  }
)

export default invoiceApi
