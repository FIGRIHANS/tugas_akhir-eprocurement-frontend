import { resolveDocumentUrlForApi } from '@/composables/documentPreview'
import { parseIndoDate } from '@/composables/parseIndoDate'
import { extractGrFromText, extractGrFromUnknown } from '@/core/utils/grDocumentNo'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'
import type { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

type VerificationStore = ReturnType<typeof useInvoiceVerificationStore>

const isEditableDraftStatus = (status?: number) =>
  status === 0 || status === -1 || status === 5

/**
 * Read uploaded tax / reference blobs via OCR APIs and seed empty form fields.
 */
export const applyOcrFromUploadedDocuments = async (
  form: formTypes,
  verificationApi: VerificationStore,
): Promise<string | null> => {
  if (!isEditableDraftStatus(form.status)) return null

  let extractedGr: string | null = null

  if (form.tax && resolveDocumentUrlForApi(form.tax) && !form.taxNoInvoice?.trim()) {
    try {
      const qr = await verificationApi.uploadFileQr(form.tax)
      if (qr?.taxDocumentNumber) form.taxNoInvoice = qr.taxDocumentNumber
      if (!form.taxDate && qr?.taxDocumentDate) {
        form.taxDate = parseIndoDate(qr.taxDocumentDate)
      }
    } catch (error) {
      console.debug('Tax document QR autofill failed', error)
    }
  }

  if (form.referenceDocument && resolveDocumentUrlForApi(form.referenceDocument)) {
    try {
      const ocr = (await verificationApi.uploadFileOcr(form.referenceDocument)) as Record<string, unknown>
      const grFromReference = extractGrFromUnknown(ocr)
      if (grFromReference) {
        extractedGr = grFromReference
        if (!form.invoiceVendorNo?.trim()) {
          form.invoiceVendorNo = grFromReference
        }
      } else {
        const refText = String(ocr.reference || ocr.referenceNo || '').trim()
        const grFromText = extractGrFromText(refText)
        if (grFromText) {
          extractedGr = grFromText
          if (!form.invoiceVendorNo?.trim()) form.invoiceVendorNo = grFromText
        }
      }
    } catch (error) {
      console.debug('Reference document OCR autofill failed', error)
    }
  }

  return extractedGr
}
