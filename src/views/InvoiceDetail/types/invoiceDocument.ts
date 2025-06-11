export interface documentFormTypes {
  invoiceDocument: documentDetailTypes | null
  tax: documentDetailTypes | null
  referenceDocument: documentDetailTypes | null
  otherDocument: documentDetailTypes | null
}

export interface documentDetailTypes {
  documentType: number
  documentName: string
  documentUrl: string
  documentSize: number
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}
