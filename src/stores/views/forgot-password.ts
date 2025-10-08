import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/core/utils/api'

export interface ISendResetPasswordEmailPayload {
  vendorId: string
  email: string
  vendorName: string
}

export interface IResetPasswordPayload {
  vendorId: number | string
  newPassword: string
  resetToken: string
}

export const useForgotPasswordStore = defineStore('forgot-password', () => {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isEmailSent = ref<boolean>(false)
  const isPasswordReset = ref<boolean>(false)

  const clearError = () => {
    error.value = null
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    isEmailSent.value = false
    isPasswordReset.value = false
  }

  const sendResetPasswordEmail = async (payload: ISendResetPasswordEmailPayload) => {
    loading.value = true
    error.value = null
    isEmailSent.value = false

    try {
      const response = await api.post('/auth/vendor/send-reset-password-email', payload)

      isEmailSent.value = true
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

  const resetPasswordWithNewPassword = async (payload: IResetPasswordPayload) => {
    loading.value = true
    error.value = null
    isPasswordReset.value = false

    try {
      const response = await api.post('/auth/vendor/reset-password-with-new-password', payload)

      isPasswordReset.value = true
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
    clearError,
    resetState,
    sendResetPasswordEmail,
    resetPasswordWithNewPassword,
  }
})
