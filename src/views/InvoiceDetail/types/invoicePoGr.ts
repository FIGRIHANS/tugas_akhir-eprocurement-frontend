import type { WhtCodeTypes } from '@/stores/master-data/types/invoiceMasterData' 
export interface itemsPoGrType {
  id: number
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  itemAmount: number
  quantity: number
  taxCode: string
  vatAmount: number
  uom: string
  itemText: string
  conditionType: string
  conditionTypeDesc: string
  qcStatus: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: number
  department: string
  whtCodeList?: WhtCodeTypes[]
}