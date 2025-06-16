export interface documentFormTypes {
  invoiceDocument: documentDetailTypes | null
  invoiceDocumentError?: boolean
  tax: documentDetailTypes | null
  taxError?: boolean
  referenceDocument: documentDetailTypes | null
  referenceDocumentError?: boolean
  otherDocument: documentDetailTypes | null
  otherDocumentError?: boolean
}

export interface documentDetailTypes {
  name?: string
  path: string
  fileSize: string
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}
