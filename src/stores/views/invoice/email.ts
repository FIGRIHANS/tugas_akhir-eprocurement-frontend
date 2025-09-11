import type { ApiResponse } from '@/core/type/api'
import generalApi from '@/core/utils/generalApi'
import { defineStore } from 'pinia'

export type NotifEmailBody = {
  recepientName: string
  invoiceNo: string
  recepients: {
    emailTo: string
    emailCc: string
    emailBcc: string
  }
}

export const useNotifInvoiceEmailStore = defineStore('useNotifInvoiceEmailStore', () => {
  const sendVerificationReminderEmail = async (body: NotifEmailBody) => {
    const response: ApiResponse<unknown> = await generalApi.post(
      '/notification/email/invoice-verification-reminder',
      body,
    )
    return response.data
  }

  return { sendVerificationReminderEmail }
})
