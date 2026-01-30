export interface AgingPeriod {
  period: string
  amount: number
  count: number
}

export interface UpcomingPayment {
  period: string
  amount: number
  count: number
}

export interface InvoiceStatusItem {
  label: string
  amount: number
  count: number
  color: string
}

export interface TimeSeriesChartItem {
  id: string
  label: string
  paidOnTime: number
  avgAge: number
  current: number
  processing: number
  overdue: number
}

export interface AgingTrendData {
  id: string
  label: string
  paidOnTime: number
  avgAge: number
  current: number
  processing: number
  overdue: number
  trendValue: number
}
