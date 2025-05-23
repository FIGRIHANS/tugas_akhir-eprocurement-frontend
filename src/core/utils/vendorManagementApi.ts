import axios from 'axios'

const vendorManagementApi = axios.create({
  baseURL: import.meta.env.VITE_API_VENDOR_MANAGEMENT_BASE_URL,
})

export default vendorManagementApi
