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

export interface FtpUploadMetadata {
  vendorName: string
  invoiceNo?: string | null
  documentNo?: string | null
  uploaderId?: string
  source?: string
  status?: string
  notes?: string | null
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
  vendorId?: number | null
  vendorName?: string | null
  status?: string | null
  invoiceFileUrl?: string | null
  taxFileUrl?: string | null
  referenceFileUrl?: string | null
  invoiceFileName?: string | null
  taxFileName?: string | null
  referenceFileName?: string | null
  vatAttached?: boolean
  createdAt?: string | null
  linkedInvoiceId?: string | null
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

export interface FtpFilePreview {
  fileName?: string | null
  blobPath?: string | null
  url?: string | null
}

export interface FtpSyncPreview {
  invoice?: FtpFilePreview | null
  tax?: FtpFilePreview | null
  reference?: FtpFilePreview | null
}

/** List-row shape returned in sync response `content.invoiceListItem`. */
export interface FtpInvoiceListItem {
  invoiceTypeCode?: number
  invoiceTypeName?: string
  invoiceDPCode?: number
  invoiceDPName?: string
  statusCode?: number
  statusName?: string
  invoiceSourceId?: number
  invoiceSource?: number
  invoiceSourceName?: string
  companyCode?: string
  companyName?: string
  vendorName?: string
  documentNo?: string | null
  invoiceNo?: string | null
  invoiceDate?: string | null
  dpp?: number
  vatAmount?: number
  whtAmount?: number
  totalGrossAmount?: number
  totalNetAmount?: number
  poNo?: string | null
  grDocumentNo?: string | null
  estimatedPaymentDate?: string | null
  pOs?: unknown[]
}

export interface FtpSyncResult {
  ftpUploadUId: string
  savedInvoiceUId: string
  syncedAt?: string | null
  warnings: string[]
  manualFields: string[]
  hasDraft: boolean
  draft: Record<string, unknown>
  preview: FtpSyncPreview
  invoice: Record<string, unknown>
  ftpData: Record<string, unknown> | null
  /** @deprecated use ftpData for list update */
  invoiceListItem: FtpInvoiceListItem | null
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
