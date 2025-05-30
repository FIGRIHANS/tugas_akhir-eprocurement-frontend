import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/core/utils/api'
import userApi from '@/core/utils/userApi'

export const useLoginStore = defineStore('login', () => {
  const selectedLogin = ref<string>('')
  const isVendor = ref<boolean>(false)
  const isSendForgot = ref<boolean>(false)
  const isSendNewPassword = ref<boolean>(true)

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

  return {
    selectedLogin,
    isVendor,
    isSendForgot,
    isSendNewPassword,
    callLogin,
    callUser
  }
})
