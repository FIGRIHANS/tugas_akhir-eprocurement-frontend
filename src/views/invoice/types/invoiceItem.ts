export interface invoiceItemTypes {
  activity: number | null
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
  isEdit: boolean
}