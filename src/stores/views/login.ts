import { defineStore } from 'pinia'
import api from '@/core/utils/api'
import userApi from '@/core/utils/userApi'

export const useLoginStore = defineStore('login', () => {
  const callLogin = async (username: string, password: string) => {
    const response = await api.post('/auth/sign-in', {
      userName: username,
      userPassword: password,
    })

    return response.data
  }

  const callUser = async (username: string) => {
    const response = await userApi.get(`/user?userName=${username}`)

    return response.data
  }

  return { callLogin, callUser }
})
