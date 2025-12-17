import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData'
export interface itemsPoGrType {
  id: number
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string | null
  taxCode: string
  quantity: number
  uom: string
  itemText: string
  currency: string
  conditionType: string
  conditionTypeDesc: string
  qcStatus: string
  postingDate: string | null
  enteredOn: string
  purchasingOrg: string
  department: string
  currencyLC: string
  currencyTC: string
  itemAmountLC: number
  itemAmountTC: number
  vatAmount?: number
  whtType?: string
  whtCode?: string
  whtBaseAmount?: number
  whtAmount?: number
  isEdit?: boolean
  poNoError: boolean
  poItemError: boolean
  departementError: boolean
  whtCodeList?: WhtCodeTypes[]
}

export interface PoGrSearchTypes {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  taxCode: string
  quantity: number
  unit: string
  itemText: string
  currency: string
  conditionType: string
  conditionTypeDesc: string
  qcStatus: string
  postingDate: string
  enteredOn: string
  purchasingOrg: string
  department: string
  currencyLC: string
  currencyTC: string
  itemAmountLC: number
  itemAmountTC: number
  itemAmount: number
  uom: string
  materialDescription: string
  isActive?: boolean
}
