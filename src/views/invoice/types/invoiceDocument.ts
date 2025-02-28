export interface documentFormTypes {
  invoiceDocument: File | null
  invoiceDocumentError?: boolean
  tax: File | null
  taxError?: boolean
  bast: File | null
  bastError?: boolean
  referenceDocument: File | null
  referenceDocumentError?: boolean
  buktiPotong: File | null
  buktiPotongError?: boolean
  otherDocument: File | null
  otherDocumentError?: boolean
}