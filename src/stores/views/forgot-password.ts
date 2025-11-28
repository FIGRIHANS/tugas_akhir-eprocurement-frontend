import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/core/utils/api'

export interface ISendResetPasswordEmailPayload {
  email: string
}

export interface IResetPasswordPayload {
  email: string
  newPassword: string
  resetToken: string
}

export interface IResetPasswordResponse {
  result: {
    isError: boolean
    message: string
  }
}

export const useForgotPasswordStore = defineStore('forgot-password', () => {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isEmailSent = ref<boolean>(false)
  const isPasswordReset = ref<boolean>(false)
  const resetPasswordResponse = ref<IResetPasswordResponse | null>(null)
  const sendNewPasswordResponse = ref<IResetPasswordResponse | null>(null)
  const clearError = () => {
    error.value = null
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    isEmailSent.value = false
    isPasswordReset.value = false
    resetPasswordResponse.value = null
    sendNewPasswordResponse.value = null
  }

  const sendResetPasswordEmail = async (payload: ISendResetPasswordEmailPayload) => {
    loading.value = true
    error.value = null
    isEmailSent.value = false

    try {
      const response = await api.post('/auth/vendor/reset-password', payload)

      isEmailSent.value = true
      resetPasswordResponse.value = response.data
      return response.data
    } catch (err) {
      console.log(err, 'err')
      if (err instanceof Error) {
        error.value = err.message || 'Failed to send reset password email'
      } else {
        error.value = 'An unexpected error occurred'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPasswordWithNewPassword = async (payload: IResetPasswordPayload) => {
    loading.value = true
    error.value = null
    isPasswordReset.value = false

    try {
      const response = await api.post('/auth/vendor/reset-password-with-new-password', payload)

      isPasswordReset.value = true

      sendNewPasswordResponse.value = response.data
      return response.data
    } catch (err) {
      console.log(err, 'err')
      if (err instanceof Error) {
        error.value = err.message || 'Failed to reset password'
      } else {
        error.value = 'An unexpected error occurred'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendEmployeeResetPasswordEmail = async (payload: ISendResetPasswordEmailPayload) => {
    loading.value = true
    error.value = null
    isEmailSent.value = false

    try {
      const response = await api.post('/auth/user/reset-password', payload)

      isEmailSent.value = true

      resetPasswordResponse.value = response.data
      return response.data
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message || 'Failed to send reset password email'
      } else {
        error.value = 'An unexpected error occurred'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetEmployeePasswordWithNewPassword = async (payload: IResetPasswordPayload) => {
    loading.value = true
    error.value = null
    isPasswordReset.value = false

    try {
      const response = await api.post('/auth/user/reset-password-with-new-password', payload)

      isPasswordReset.value = true

      sendNewPasswordResponse.value = response.data
      return response.data
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message || 'Failed to reset password'
      } else {
        error.value = 'An unexpected error occurred'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    isEmailSent,
    isPasswordReset,
    resetPasswordResponse,
    sendNewPasswordResponse,
    clearError,
    resetState,
    sendResetPasswordEmail,
    resetPasswordWithNewPassword,
    sendEmployeeResetPasswordEmail,
    resetEmployeePasswordWithNewPassword,
  }
})
