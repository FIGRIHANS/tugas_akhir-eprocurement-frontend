import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData' 
export interface itemsCostType {
  activityExpense: string
  itemAmount: number
  debitCredit: string
  taxCode: string
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtCodeList?: WhtCodeTypes[]
  isEdit: boolean
}