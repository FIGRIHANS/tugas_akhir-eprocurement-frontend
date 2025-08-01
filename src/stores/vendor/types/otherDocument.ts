export interface IOtherDocumentData {
  id: number
  vendorID: number
  documentName: string
  documentNo: string
  documentUrl: string
  isActive: boolean
  changeRequestID: number | null
  issuedUTCDate: string
  expiredUTCDate: string
  remark: string
}
