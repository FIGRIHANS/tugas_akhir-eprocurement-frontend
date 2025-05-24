export interface itemsPoGrType {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  taxCode: string
  itemAmount: number
  quantity: number
  uom: string
  material: string
  materialDescription: string
  currency: string
  conditionType: string
  postingDate: string
  enteredOn: string
  purchasingOrg: string
  department: string
  whtType?: string
  whtCode?: string
  whtBaseAmount?: number
  whtAmount?: number
  isEdit?: boolean
}

export interface PoGrSearchTypes {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  taxCode: string
  itemAmount: number
  quantity: number
  uom: string
  material: string
  materialDescription: string
  currency: string
  conditionType: string
  postingDate: string
  enteredOn: string
  purchasingOrg: string
  department: string
  isActive?: boolean
}