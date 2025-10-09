import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData'
export interface itemsCostType {
  id: number
  activityId: number | null
  activityExpense: string
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
  itemText: string
}
