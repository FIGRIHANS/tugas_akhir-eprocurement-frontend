export interface ApSummaryData {
  date: Date
  amount: number
  count: number
}

export interface AgingTrendData {
  period: string
  amount: number
  count: number
}

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

export interface TimeSeriesData {
  date: Date
  paidOnTime: number
  avgAge: number
}
