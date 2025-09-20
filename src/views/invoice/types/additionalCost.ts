import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData'
export interface itemsCostType {
  activity: number | null
  activityCode: string
  activityName: string
  itemAmount: number
  debitCredit: string
  taxCode: string
  vatAmount: number
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: number
  whtCodeList?: WhtCodeTypes[]
  isEdit: boolean
  isActivityError?: boolean
  isItemAmountError?: boolean
  isDebitCreditError?: boolean
}

export interface costExpenseType {
  id: number
  activityExpenses: number
  itemAmount: number
  itemText: string
  debitCredit: string
  taxCode: string
  vatAmount: number
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: null
}
