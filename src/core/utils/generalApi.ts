import axios from 'axios'

const generalAPI = axios.create({
  baseURL: import.meta.env.VITE_API_GENERAL_URL,
})

export default generalAPI
