import { defineStore } from 'pinia'
import api from '@/core/utils/api'

export const useLoginStore = defineStore('login', () => {
  const callLogin = async (username: string, password: string) => {
    const response = await api.post('/auth/sign-in', {
      userName: username,
      userPassword: password
    })

    return response.data
  }

  return { callLogin }
})
