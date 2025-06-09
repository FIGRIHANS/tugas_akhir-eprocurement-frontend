import type { ApiResponse } from '@/core/type/api'
import generalApi from '@/core/utils/generalApi'
import { defineStore } from 'pinia'

export type NotifEmailBody = {
  recepientName: string
  message: string
  recepients: {
    emailTo: string
    emailCc: string
    emailBcc: string
  }
}

export const useNotifEmailStore = defineStore('notifEmail', () => {
  const send = async (body: NotifEmailBody) => {
    const response: ApiResponse<unknown> = await generalApi.post(
      '/notification/email/vendor-data-updates',
      body,
    )
    return response.data
  }

  return { send }
})
