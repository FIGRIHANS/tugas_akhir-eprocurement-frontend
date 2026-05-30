import invoiceApi from '@/core/utils/invoiceApi'
import type { ResponseData } from './types/api'

export interface InvoiceMonthTrendItem {
  monthLabel: string
  paidOnTime: number
  avgAge: number
  current: number
  processing: number
  overdue: number
}

export interface InvoiceAnalyticsData {
  totalOutstandingAmount: number
  totalOutstandingCount: number
  overduePercentage: number

  // AP Aging
  agingCurrentAmount: number
  agingCurrentCount: number
  aging1To30Amount: number
  aging1To30Count: number
  aging31To60Amount: number
  aging31To60Count: number
  agingMoreThan60Amount: number
  agingMoreThan60Count: number

  // Status Monitoring
  statusSubmittedAmount: number
  statusSubmittedCount: number
  statusInApprovalAmount: number
  statusInApprovalCount: number
  statusApprovedAmount: number
  statusApprovedCount: number
  statusRejectedAmount: number
  statusRejectedCount: number
  statusPaidAmount: number
  statusPaidCount: number
  statusOverdueAmount: number
  statusOverdueCount: number

  monthlyTrends: InvoiceMonthTrendItem[]
}

const InvoiceAnalyticsService = {
  async getAnalytics(): Promise<ResponseData<InvoiceAnalyticsData>> {
    const response = await invoiceApi.get<ResponseData<InvoiceAnalyticsData>>('/invoice/analytics')
    return response.data
  }
}

export default InvoiceAnalyticsService
