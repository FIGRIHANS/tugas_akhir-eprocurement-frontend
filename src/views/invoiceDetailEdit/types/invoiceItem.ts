import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData'
export interface invoiceItemTypes {
  activity: string
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
  whtAmount: number
  whtCodeList?: WhtCodeTypes[]
  isEdit: boolean
}
