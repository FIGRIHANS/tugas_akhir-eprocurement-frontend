export interface documentFormTypes {
  invoiceDocument: File | null
  invoiceDocumentError?: boolean
  tax: File | null
  taxError?: boolean
  referenceDocument: File | null
  referenceDocumentError?: boolean
  otherDocument: File | null
  otherDocumentError?: boolean
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}
