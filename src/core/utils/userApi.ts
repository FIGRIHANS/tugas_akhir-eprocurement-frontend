import axios from 'axios'
import { getToken } from '@/composables/token'

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

userApi.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = token
    return config
  }
)

export default userApi