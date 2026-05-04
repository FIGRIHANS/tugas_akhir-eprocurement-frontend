export interface DnStats {
  total: number
  onDelivery: number
  received: number
  partialReceived: number
  completed: number
}

export interface RcStats {
  total: number
  waitingApproval: number
  completed: number
  rejected: number
  hasDiscrepancy: number
}

export interface PoStats {
  total: number
  open: number
  partiallyDelivered: number
  delivered: number
  closed: number
  totalValue: number
  totalValueFormatted: string
}

export interface KpiCard {
  label: string
  value: number | string
  icon: string
  colorClass: string
  bgClass: string
  borderClass: string
}
