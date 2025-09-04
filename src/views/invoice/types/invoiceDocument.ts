export interface documentFormTypes {
  invoiceDocument: responseFileTypes | null
  invoiceDocumentError?: boolean
  tax: responseFileTypes | null
  taxError?: boolean
  referenceDocument: responseFileTypes | null
  referenceDocumentError?: boolean
  otherDocument: responseFileTypes | null
  otherDocumentError?: boolean
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}

export interface responseFileTypes {
  id: number
  name: string
  path: string
  fileSize: string
}
