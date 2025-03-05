export interface documentFormTypes {
  invoiceDocument: File | null
  tax: File | null
  referenceDocument: File | null
  otherDocument: File | null
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}
