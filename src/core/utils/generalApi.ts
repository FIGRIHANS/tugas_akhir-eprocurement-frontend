import axios from 'axios'

const generalApi = axios.create({
  baseURL: import.meta.env.VITE_API_GENERAL_BASE_URL,
})

export default generalApi
