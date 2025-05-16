import axios from "axios";

const vendorAPI = axios.create({
  baseURL: import.meta.env.VITE_API_VENDOR_BASE_URL,
})

export default vendorAPI
