import axios from 'axios'

const vendorApi = axios.create({
  baseURL: import.meta.env.VITE_API_VENDOR_BASE_URL,
})

export default vendorApi
