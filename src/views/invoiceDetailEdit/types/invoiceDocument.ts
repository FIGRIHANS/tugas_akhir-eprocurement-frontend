export interface documentFormTypes {
  invoiceDocument: attachmentFileTypes | null
  invoiceDocumentError?: boolean
  tax: attachmentFileTypes | null
  taxError?: boolean
  referenceDocument: attachmentFileTypes | null
  referenceDocumentError?: boolean
  otherDocument: attachmentFileTypes | null
  otherDocumentError?: boolean
}

export interface attachmentFileTypes {
  name?: string
  path: string
  fileSize: string
}

export interface listFormTypes {
  title: string
  varName: string
  varErrorName: string
}
