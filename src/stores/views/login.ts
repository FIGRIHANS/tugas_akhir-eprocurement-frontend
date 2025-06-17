import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ResponseUser } from './types/login'
import api from '@/core/utils/api'
import userApi from '@/core/utils/userApi'
import vendorApi from '@/core/utils/vendorApi'

export const useLoginStore = defineStore('login', () => {
  const selectedLogin = ref<string>('')
  const userData = ref<ResponseUser>()
  const isVendor = ref<boolean>(false)
  const isSendForgot = ref<boolean>(false)
  const isSendNewPassword = ref<boolean>(false)

  const clearUserData = () => {
    userData.value = {} as ResponseUser
  }

  const callLogin = async (username: string, password: string) => {
    const response = await api.post('/auth/sign-in', {
      userName: username,
      userPassword: password,
    })

    return response.data
  }

  const callLoginVendor = async (username: string, password: string) => {
    const response = await vendorApi.post('/public/vendor/login', {
      request: {
        username: username,
        email: '',
        password: password,
      },
    })

    return response.data
  }

  const callUser = async (username: string) => {
    const response = await userApi.get(`/user?userName=${username}`)

    userData.value = response.data.result.content

    return response.data
  }

  return {
    selectedLogin,
    isVendor,
    isSendForgot,
    isSendNewPassword,
    userData,
    clearUserData,
    callLogin,
    callUser,
    callLoginVendor
  }
})
