import invoiceApi from '@/core/utils/invoiceApi'
import type { ResponseData } from './types/api'

export interface TaxAnalyticsData {
  fpmApprovedCount: number
  fpmApprovedAmount: number
  fpmCreditedCount: number
  fpmCreditedAmount: number
  fpmUncreditedCount: number
  fpmUncreditedAmount: number
  taxInvoiceDefectCount: number
  taxInvoiceDefectAmount: number
  expiredLessTwoMonthCount: number
  expiredLessTwoMonthAmount: number
  expiredMoreTwoMonthCount: number
  expiredMoreTwoMonthAmount: number

  // WHT breakdown — PPh 21
  whtPph21DraftCount: number
  whtPph21DraftAmount: number
  whtPph21DoneCount: number
  whtPph21DoneAmount: number
  whtPph21ErrorCount: number
  whtPph21ErrorAmount: number

  // WHT breakdown — BPU Unifikasi
  whtBpuDraftCount: number
  whtBpuDraftAmount: number
  whtBpuDoneCount: number
  whtBpuDoneAmount: number
  whtBpuErrorCount: number
  whtBpuErrorAmount: number
}

const TaxService = {
  async getAnalytics(params?: { month?: number, year?: number }): Promise<ResponseData<TaxAnalyticsData>> {
    const response = await invoiceApi.get<ResponseData<TaxAnalyticsData>>('/taxsync/analytics', { params })
    return response.data
  }
}

export default TaxService
