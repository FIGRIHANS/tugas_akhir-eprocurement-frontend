import type { invoiceQrData } from './invoiceQrdata'
import type { invoiceOcrData } from './invoiceOcrData'

export type OcrVerificationSnapshot = {
  qrData: invoiceQrData
  ocrData: invoiceOcrData
  editableRemarks: Record<number, string>
  pjapSyncStatus: string | null
  taxVerificationClicked: boolean
  pjapVerificationClicked: boolean
  isVerify: boolean
  scannedOcrStatus: string
  scannedTaxInvoiceNo: string
}
