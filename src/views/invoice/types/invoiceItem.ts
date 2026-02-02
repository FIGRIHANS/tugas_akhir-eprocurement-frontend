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
  realizationAmount: number
  variance: number
  hasRealizationInput?: boolean
  isTextLimitExceeded?: boolean
  isEdit: boolean
}
