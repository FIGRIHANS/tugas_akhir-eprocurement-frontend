import type { ApiResponse } from '@/core/type/api'
import generalApi from '@/core/utils/generalApi'
import { defineStore } from 'pinia'

export type ChangeDataEmailBody = {
  recepientName: string
  recepients: {
    emailTo: string
    emailCc: string
    emailBcc: string
  }
}

export const useChangeDataEmailStore = defineStore('changeDataEmail', () => {
  const sendEmail = async (body: ChangeDataEmailBody) => {
    const response: ApiResponse<unknown> = await generalApi.post(
      '/notification/email/vendor-data-changedata',
      body,
    )
    return response.data
  }
  return { sendEmail }
})
