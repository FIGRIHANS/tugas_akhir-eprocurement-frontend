import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData'
export interface invoiceItemTypes {
  id: number
  activity: number | null
  activityCode: string
  activityName: string
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
  whtBaseAmount: string
  whtAmount: string
  whtCodeList?: WhtCodeTypes[]
  isTextLimitExceeded?: boolean
  isEdit: boolean
}
