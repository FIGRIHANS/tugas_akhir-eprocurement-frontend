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
  expiredMoreTwoMonthCount: number
}

const TaxService = {
  async getAnalytics(): Promise<ResponseData<TaxAnalyticsData>> {
    const response = await invoiceApi.get<ResponseData<TaxAnalyticsData>>('/taxsync/analytics')
    return response.data
  }
}

export default TaxService
