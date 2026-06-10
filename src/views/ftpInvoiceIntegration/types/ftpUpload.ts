export const DEFAULT_INVOICE_FILE_NAME = 'invoice.pdf'
export const DEFAULT_TAX_FILE_NAME = 'tax.pdf'
export const DEFAULT_REFERENCE_FILE_NAME = 'reference.pdf'

export const GENERIC_STORED_FILE_NAMES = new Set([
  DEFAULT_INVOICE_FILE_NAME,
  DEFAULT_TAX_FILE_NAME,
  DEFAULT_REFERENCE_FILE_NAME,
])

export type FtpUploadOriginalFileNames = {
  invoice?: string | null
  tax?: string | null
  reference?: string | null
}

export interface FtpUploadFileDetail {
  fileName?: string | null
  name?: string | null
  originalFileName?: string | null
  uploadedFileName?: string | null
  blobPath?: string | null
  url?: string | null
}

export interface FtpUploadListItem {
  id?: string | number
  invoiceUId?: string | null
  invoiceNo?: string | null
  documentNo?: string | null
  companyCode?: string | null
  status?: string | null
  invoiceFileUrl?: string | null
  taxFileUrl?: string | null
  referenceFileUrl?: string | null
  invoiceFileName?: string | null
  taxFileName?: string | null
  referenceFileName?: string | null
  vatAttached?: boolean
  createdAt?: string | null
  vendorName?: string | null
  invoiceBlobPath?: string | null
  taxBlobPath?: string | null
  referenceBlobPath?: string | null
  files?: {
    invoice?: FtpUploadFileDetail | null
    tax?: FtpUploadFileDetail | null
    reference?: FtpUploadFileDetail | null
  } | null
  parsedPreview?: Record<string, unknown> | null
}

const isGenericStoredFileName = (name: string | null | undefined) => {
  if (!name) return false
  return GENERIC_STORED_FILE_NAMES.has(name.toLowerCase())
}

const pickFirstValidName = (...names: Array<string | null | undefined>) => {
  for (const name of names) {
    if (name && String(name).trim() !== '' && !isGenericStoredFileName(name)) {
      return String(name)
    }
  }

  for (const name of names) {
    if (name && String(name).trim() !== '') return String(name)
  }

  return null
}

export const resolveFtpInvoiceFileName = (
  item: FtpUploadListItem,
  cache?: FtpUploadOriginalFileNames,
) => {
  return (
    pickFirstValidName(
      item.invoiceFileName,
      item.files?.invoice?.originalFileName,
      item.files?.invoice?.uploadedFileName,
      item.files?.invoice?.fileName,
      item.files?.invoice?.name,
      cache?.invoice,
    ) ?? DEFAULT_INVOICE_FILE_NAME
  )
}

export const resolveFtpTaxFileName = (
  item: FtpUploadListItem,
  cache?: FtpUploadOriginalFileNames,
) => {
  return (
    pickFirstValidName(
      item.taxFileName,
      item.files?.tax?.originalFileName,
      item.files?.tax?.uploadedFileName,
      item.files?.tax?.fileName,
      item.files?.tax?.name,
      cache?.tax,
    ) ?? DEFAULT_TAX_FILE_NAME
  )
}

export const resolveFtpReferenceFileName = (
  item: FtpUploadListItem,
  cache?: FtpUploadOriginalFileNames,
) => {
  const name = pickFirstValidName(
    item.referenceFileName,
    item.files?.reference?.originalFileName,
    item.files?.reference?.uploadedFileName,
    item.files?.reference?.fileName,
    item.files?.reference?.name,
    cache?.reference,
  )

  return name ?? '-'
}

export const normalizeFtpUploadListItem = (
  item: FtpUploadListItem,
  cache?: FtpUploadOriginalFileNames,
): FtpUploadListItem => {
  const referenceFileName = resolveFtpReferenceFileName(item, cache)

  return {
    ...item,
    invoiceUId: item.invoiceUId ? String(item.invoiceUId) : item.invoiceUId,
    invoiceFileName: resolveFtpInvoiceFileName(item, cache),
    taxFileName: resolveFtpTaxFileName(item, cache),
    referenceFileName: referenceFileName === '-' ? null : referenceFileName,
  }
}
