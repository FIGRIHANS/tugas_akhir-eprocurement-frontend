export interface itemsPoGrType {
  poNumber: string
  poItem: string
  GrDocumentNo: string
  GrDocumentItem: string
  GrDocumentDate: string
  taxCode: string
  itemAmount: string
  quantity: string
  unit: string
  itemText: string
  conditionType: string
  whtType: string
  whtCode: string
  whtBaseAmount: string
  category: string

  amountInvoice: string
  vatAmount: string
  
  totalNetAmount: string
  isEdit?: boolean
}