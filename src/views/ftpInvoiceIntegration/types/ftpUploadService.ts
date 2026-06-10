import invoiceHttp from '@/core/utils/invoiceApi'
import type { responseFileTypes } from '@/views/invoice/types/invoiceDocument'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'
import type { ListPoTypes } from '@/stores/views/invoice/types/submission'
import type {
  FtpFilePreview,
  FtpSyncPreview,
  FtpSyncResult,
  FtpUploadListItem,
  FtpUploadMetadata,
  FtpUploadOriginalFileNames,
} from './ftpUpload'
import {
  normalizeFtpUploadListItem,
  resolveFtpInvoiceFileName,
  resolveFtpReferenceFileName,
  resolveFtpTaxFileName,
} from './ftpUpload'

export const FTP_SYNC_CONTEXT_KEY = 'ftp_sync_context'
export const ACTIVE_FTP_UPLOAD_UID_KEY = 'activeFtpUploadUId'

const FTP_INVOICE_SOURCE = 3
const DRAFT_STATUS_CODE = 0
const DRAFT_STATUS_NAME = 'draft'

export type FtpDataListRow = ListPoTypes & {
  ftpUploadUId?: string | null
  ftpUploadStatus?: string | null
}

export const buildFtpUploadMetadata = (vendorName: string): FtpUploadMetadata => ({
  vendorName: vendorName.trim(),
  source: 'ftp',
  status: 'Uploaded',
})

export interface FtpSyncContext {
  ftpUploadUId: string
  savedInvoiceUId?: string | null
  syncedAt?: string | null
  warnings?: string[]
  manualFields?: string[]
  draft?: Record<string, unknown> | null
  preview?: FtpSyncPreview | null
  invoice?: Record<string, unknown> | null
  invoiceListItem?: Record<string, unknown> | null
  vendorName?: string | null
  invoiceDocument?: responseFileTypes | null
  taxDocument?: responseFileTypes | null
  referenceDocument?: responseFileTypes | null
  parsedPreview?: Record<string, unknown> | null
}

export interface FtpUploadUpdatePayload {
  status: string
  parsedPreview?: Record<string, unknown> | null
  linkedInvoiceId?: string | null
}

const unwrapApiContent = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== 'object') return {}

  const root = payload as Record<string, unknown>
  let content = root.content ?? root

  if (content && typeof content === 'object' && !Array.isArray(content)) {
    const contentObj = content as Record<string, unknown>
    if (contentObj.result && typeof contentObj.result === 'object') {
      content = contentObj.result as Record<string, unknown>
    }
  }

  if (Array.isArray(content)) return (content[0] as Record<string, unknown>) || {}

  return (content as Record<string, unknown>) || {}
}

export const parseFtpUploadList = (payload: unknown): FtpUploadListItem[] => {
  const root = unwrapApiContent(payload)
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(root)
      ? root
      : (root.items as unknown[]) || (root.data as unknown[]) || []

  if (!Array.isArray(items)) return []

  return items.map((item) => normalizeFtpUploadListItem(item as FtpUploadListItem))
}

export const parseFtpUploadDetail = (payload: unknown): FtpUploadListItem => {
  const detail = unwrapApiContent(payload)
  return normalizeFtpUploadListItem(detail as FtpUploadListItem)
}

export const parseFtpUploadCreateResponse = (payload: unknown): FtpUploadListItem => {
  const content = unwrapApiContent(payload)
  const resultNode =
    content.result && typeof content.result === 'object'
      ? (content.result as Record<string, unknown>)
      : content
  const nested =
    resultNode.content && typeof resultNode.content === 'object'
      ? (resultNode.content as Record<string, unknown>)
      : content.content && typeof content.content === 'object'
        ? (content.content as Record<string, unknown>)
        : {}

  return normalizeFtpUploadListItem({
    ...(nested as FtpUploadListItem),
    invoiceUId:
      (resultNode.invoiceUId as string) ||
      (content.invoiceUId as string) ||
      (nested.invoiceUId as string) ||
      (content.invoiceUid as string) ||
      null,
    vendorName:
      (nested.vendorName as string) ||
      (resultNode.vendorName as string) ||
      (content.vendorName as string) ||
      null,
    vendorId:
      (nested.vendorId as number | null) ??
      (resultNode.vendorId as number | null) ??
      (content.vendorId as number | null) ??
      null,
    status: (resultNode.status as string) || (content.status as string) || 'Uploaded',
    files:
      (resultNode.files as FtpUploadListItem['files']) ||
      (content.files as FtpUploadListItem['files']) ||
      (nested.files as FtpUploadListItem['files']),
    parsedPreview:
      (content.parsedPreview as Record<string, unknown>) ||
      (nested.parsedPreview as Record<string, unknown>) ||
      null,
  })
}

export const fetchFtpUploadList = async (): Promise<FtpUploadListItem[]> => {
  const resp = await invoiceHttp.get('/invoice/ftp-uploads', {
    params: { page: 1, pageSize: 1000 },
  })

  const content = resp?.data?.result?.content ?? resp?.data?.result ?? resp?.data ?? []
  return parseFtpUploadList(content)
}

export const fetchFtpUploadDetail = async (invoiceUId: string): Promise<FtpUploadListItem> => {
  const resp = await invoiceHttp.get(`/invoice/ftp-uploads/${invoiceUId}`)
  const content = resp?.data?.result?.content ?? resp?.data?.result ?? resp?.data ?? {}
  return parseFtpUploadDetail(content)
}

export const updateFtpUpload = async (
  invoiceUId: string,
  payload: FtpUploadUpdatePayload,
): Promise<void> => {
  await invoiceHttp.put(`/invoice/ftp-uploads/${invoiceUId}`, payload)
}

export const parseFtpSyncContent = (payload: unknown): FtpSyncResult => {
  const content = unwrapApiContent(payload)
  const invoice = (content.invoice as Record<string, unknown>) || {}
  const header = (invoice.header as Record<string, unknown>) || {}
  const draft = (content.draft as Record<string, unknown>) || {}
  const draftHeader = (draft.header as Record<string, unknown>) || {}

  return {
    ftpUploadUId: String(content.ftpUploadUId || content.invoiceUId || ''),
    savedInvoiceUId: String(
      header.invoiceUId || content.savedInvoiceUId || draftHeader.invoiceUId || '',
    ),
    syncedAt: (content.syncedAt as string) || null,
    warnings: Array.isArray(content.warnings) ? (content.warnings as string[]) : [],
    manualFields: Array.isArray(content.manualFields)
      ? (content.manualFields as string[])
      : ['documentNo', 'pogr'],
    draft,
    preview: (content.preview as FtpSyncPreview) || {},
    invoice,
    invoiceListItem: (content.invoiceListItem as Record<string, unknown>) || null,
  }
}

export const resolveSavedInvoiceUIdFromSync = (sync: FtpSyncResult): string => {
  return sync.savedInvoiceUId || ''
}

export const syncFtpUpload = async (invoiceUId: string, force = false): Promise<FtpSyncResult> => {
  const resp = await invoiceHttp.post(
    `/invoice/ftp-uploads/${invoiceUId}/sync`,
    null,
    {
      params: force ? { force: true } : undefined,
      timeout: 120000,
    },
  )

  const content = resp?.data?.result?.content ?? resp?.data?.result ?? resp?.data ?? {}
  return parseFtpSyncContent(content)
}

export const buildSyncContextFromSyncResponse = (sync: FtpSyncResult): FtpSyncContext => ({
  ftpUploadUId: sync.ftpUploadUId,
  savedInvoiceUId: sync.savedInvoiceUId,
  syncedAt: sync.syncedAt,
  warnings: sync.warnings,
  manualFields: sync.manualFields,
  draft: sync.draft,
  preview: sync.preview,
  invoice: sync.invoice,
  invoiceListItem: sync.invoiceListItem,
})

export const saveActiveFtpUploadUId = (ftpUploadUId: string) => {
  sessionStorage.setItem(ACTIVE_FTP_UPLOAD_UID_KEY, ftpUploadUId)
}

export const getActiveFtpUploadUId = (): string | null => {
  return sessionStorage.getItem(ACTIVE_FTP_UPLOAD_UID_KEY)
}

export const clearActiveFtpUploadUId = () => {
  sessionStorage.removeItem(ACTIVE_FTP_UPLOAD_UID_KEY)
}

export const resolveFtpUploadUIdFromRow = (row: FtpDataListRow): string | null => {
  const uid = row.ftpUploadUId || row.invoiceUId
  return uid ? String(uid) : null
}

export const isFtpSourceRow = (row: FtpDataListRow) => {
  const sourceName = row.invoiceSourceName?.toLowerCase() || ''
  return row.invoiceSource === FTP_INVOICE_SOURCE || sourceName.includes('ftp')
}

export const isDraftFtpDataRow = (row: FtpDataListRow) => {
  return row.statusCode === DRAFT_STATUS_CODE || row.statusName?.toLowerCase() === DRAFT_STATUS_NAME
}

export const canSyncFtpDataRow = (row: FtpDataListRow) => {
  const uid = resolveFtpUploadUIdFromRow(row)
  if (!uid) return false
  if (row.ftpUploadStatus === 'Done') return false
  if (!isFtpSourceRow(row) || !isDraftFtpDataRow(row)) return false
  if (!row.vendorName?.trim()) return false
  return true
}

const previewToDocument = (
  file: FtpFilePreview | null | undefined,
  fallbackName: string,
): responseFileTypes | null => {
  const path = file?.url || file?.blobPath
  if (!path) return null

  return {
    id: 0,
    name: file?.fileName || fallbackName,
    path,
    previewPath: file?.url || file?.blobPath || path,
    fileSize: '0',
  }
}

const documentFromDraft = (
  documents: unknown,
  documentType: number,
  fallbackName: string,
): responseFileTypes | null => {
  if (!Array.isArray(documents)) return null

  const doc = documents.find(
    (item) =>
      item &&
      typeof item === 'object' &&
      Number((item as Record<string, unknown>).documentType) === documentType,
  ) as Record<string, unknown> | undefined

  if (!doc?.documentUrl) return null

  return {
    id: Number(doc.id) || 0,
    name: String(doc.documentName || fallbackName),
    path: String(doc.documentUrl),
    previewPath: String(doc.documentUrl),
    fileSize: String(doc.documentSize ?? '0'),
  }
}

export const applyFtpSyncDraftToForm = (
  form: formTypes,
  context: FtpSyncContext,
  companyList: Array<{ code: string; name: string }>,
  vendorList: Array<{ sapCode: string; vendorName: string; vendorId: string; npwp?: string }> = [],
) => {
  const skipManual = new Set(context.manualFields || ['documentNo', 'pogr'])
  const savedInvoice = context.invoice || {}
  const draft = context.draft || {}
  const header =
    ((savedInvoice.header as Record<string, unknown>) ||
      (draft.header as Record<string, unknown>) ||
      {}) as Record<string, unknown>
  const vendor =
    ((savedInvoice.vendor as Record<string, unknown>) ||
      (draft.vendor as Record<string, unknown>) ||
      {}) as Record<string, unknown>
  const calculation =
    ((savedInvoice.calculation as Record<string, unknown>) ||
      (draft.calculation as Record<string, unknown>) ||
      {}) as Record<string, unknown>
  const ocr =
    ((savedInvoice.ocr as Record<string, unknown>) ||
      (draft.ocr as Record<string, unknown>) ||
      {}) as Record<string, unknown>
  const preview = context.preview || {}
  const documents = savedInvoice.documents ?? draft.documents

  const preservedVendorNo = form.invoiceVendorNo
  const preservedPoGr = skipManual.has('pogr') ? [...(form.invoicePoGr || [])] : null

  form.invoiceUId = String(
    context.savedInvoiceUId || header.invoiceUId || context.ftpUploadUId || '',
  )
  form.status = Number(header.statusCode ?? 0)

  if (header.invoiceTypeCode != null) form.invoiceType = String(header.invoiceTypeCode)
  if (header.invoiceTypeName) form.invoiceTypeName = String(header.invoiceTypeName)
  if (header.invoiceDPCode != null) form.invoiceDp = String(header.invoiceDPCode)

  if (header.companyCode) {
    form.companyCode = resolveCompanyCodeValue(String(header.companyCode), companyList)
    const match = companyList.find((item) => item.code === form.companyCode)
    if (match) {
      const parts = match.name.split(' - ')
      form.companyName = parts.length > 1 ? parts[parts.length - 1].trim() : match.name
    }
  } else if (header.companyName) {
    form.companyName = String(header.companyName)
  }

  if (!skipManual.has('documentNo') && header.documentNo != null) {
    form.invoiceVendorNo = String(header.documentNo)
  } else if (skipManual.has('documentNo')) {
    form.invoiceVendorNo = preservedVendorNo || ''
  }

  if (header.invoiceNo) form.invoiceNo = String(header.invoiceNo)
  if (header.invoiceDate) form.invoiceDate = String(header.invoiceDate)
  if (header.taxNo) form.taxNoInvoice = String(header.taxNo)
  if (header.currCode) form.currency = String(header.currCode)
  if (header.notes) form.description = String(header.notes)

  const vendorNameFromSync =
    (vendor.vendorName as string) || context.vendorName || form.vendorName || ''
  if (vendorNameFromSync) {
    form.vendorName = String(vendorNameFromSync)
    const vendorMatch = vendorList.find(
      (item) => item.vendorName.trim().toLowerCase() === form.vendorName.trim().toLowerCase(),
    )
    if (vendorMatch) form.vendorId = vendorMatch.sapCode
  }
  if (vendor.npwp) form.npwp = String(vendor.npwp)

  form.subtotal = Number(calculation.subtotal) || 0
  form.vatAmount = Number(calculation.vatAmount) || 0
  form.whtAmount = Number(calculation.whtAmount) || 0
  form.additionalCostCalc = Number(calculation.additionalCost) || 0
  form.totalGrossAmount = Number(calculation.totalGrossAmount) || 0
  form.totalNetAmount = Number(calculation.totalNetAmount) || 0

  form.ocrVendorName = ocr.vendorName ? String(ocr.vendorName) : form.ocrVendorName
  form.vendorNPWP = ocr.vendorNPWP ? String(ocr.vendorNPWP) : form.vendorNPWP
  form.ocrCompanyName = ocr.companyName ? String(ocr.companyName) : form.ocrCompanyName
  form.npwpCompany = ocr.npwpCompany ? String(ocr.npwpCompany) : form.npwpCompany
  form.taxInvoiceNumber = ocr.taxInvoiceNumber ? String(ocr.taxInvoiceNumber) : form.taxInvoiceNumber
  form.taxInvoiceDate = ocr.taxInvoiceDate ? String(ocr.taxInvoiceDate) : form.taxInvoiceDate
  form.salesAmount = ocr.salesAmount != null ? Number(ocr.salesAmount) : form.salesAmount
  form.otherDPP = ocr.otherDPP != null ? Number(ocr.otherDPP) : form.otherDPP
  form.ocrVatAmount = ocr.vatAmount != null ? Number(ocr.vatAmount) : form.ocrVatAmount
  form.ocrVatbmAmount = ocr.vatbmAmount != null ? Number(ocr.vatbmAmount) : form.ocrVatbmAmount
  form.taxInvoiceStatus = ocr.taxInvoiceStatus ? String(ocr.taxInvoiceStatus) : form.taxInvoiceStatus
  form.referenceNo = ocr.referenceNo ? String(ocr.referenceNo) : form.referenceNo

  const invoiceDocument =
    previewToDocument(preview.invoice, 'invoice.pdf') ||
    documentFromDraft(documents, 1, 'invoice.pdf')
  const taxDocument =
    previewToDocument(preview.tax, 'tax.pdf') || documentFromDraft(documents, 2, 'tax.pdf')
  const referenceDocument =
    previewToDocument(preview.reference, 'reference.pdf') ||
    documentFromDraft(documents, 3, 'reference.pdf')

  if (invoiceDocument) form.invoiceDocument = invoiceDocument
  if (taxDocument) form.tax = taxDocument
  if (referenceDocument) form.referenceDocument = referenceDocument

  if (skipManual.has('pogr')) {
    form.invoicePoGr = preservedPoGr || []
  } else if (!form.invoicePoGr?.length) {
    form.invoicePoGr = []
  }
}

const toDocument = (
  file:
    | {
        fileName?: string | null
        blobPath?: string | null
        url?: string | null
      }
    | null
    | undefined,
  displayName: string,
): responseFileTypes | null => {
  const path = file?.blobPath || file?.url
  if (!path) return null

  return {
    id: 0,
    name: displayName,
    path,
    previewPath: file?.url || file?.blobPath || path,
    fileSize: '0',
  }
}

export const buildSyncContextFromDetail = (
  detail: FtpUploadListItem,
  nameFallbacks?: FtpUploadOriginalFileNames,
): FtpSyncContext => {
  const normalized = normalizeFtpUploadListItem(detail, nameFallbacks)

  return {
    ftpUploadUId: String(normalized.invoiceUId || ''),
    vendorName: normalized.vendorName || null,
    invoiceDocument: toDocument(
      normalized.files?.invoice || {
        fileName: normalized.invoiceFileName,
        blobPath: normalized.invoiceBlobPath,
        url: normalized.invoiceFileUrl,
      },
      resolveFtpInvoiceFileName(normalized, nameFallbacks),
    ),
    taxDocument: toDocument(
      normalized.files?.tax || {
        fileName: normalized.taxFileName,
        blobPath: normalized.taxBlobPath,
        url: normalized.taxFileUrl,
      },
      resolveFtpTaxFileName(normalized, nameFallbacks),
    ),
    referenceDocument: (() => {
      const refName = resolveFtpReferenceFileName(normalized, nameFallbacks)
      if (refName === '-') return null
      return toDocument(
        normalized.files?.reference || {
          fileName: normalized.referenceFileName,
          blobPath: normalized.referenceBlobPath,
          url: normalized.referenceFileUrl,
        },
        refName,
      )
    })(),
    parsedPreview: normalized.parsedPreview || null,
  }
}

export const saveFtpSyncContext = (context: FtpSyncContext) => {
  sessionStorage.setItem(FTP_SYNC_CONTEXT_KEY, JSON.stringify(context))
}

export const getFtpSyncContext = (): FtpSyncContext | null => {
  try {
    const raw = sessionStorage.getItem(FTP_SYNC_CONTEXT_KEY)
    return raw ? (JSON.parse(raw) as FtpSyncContext) : null
  } catch {
    return null
  }
}

export const clearFtpSyncContext = () => {
  sessionStorage.removeItem(FTP_SYNC_CONTEXT_KEY)
}

export const clearFtpSyncSession = () => {
  clearFtpSyncContext()
  clearActiveFtpUploadUId()
}

export const resolveCompanyCodeValue = (
  backendValue: string | null | undefined,
  companyList: Array<{ code: string; name: string }>,
): string => {
  if (!backendValue) return ''

  const normalized = backendValue.trim()
  const exactCode = companyList.find((item) => item.code === normalized)
  if (exactCode) return exactCode.code

  const exactName = companyList.find(
    (item) => item.name.trim().toLowerCase() === normalized.toLowerCase(),
  )
  if (exactName) return exactName.code

  const partial = companyList.find(
    (item) =>
      item.name.toLowerCase().includes(normalized.toLowerCase()) ||
      normalized.toLowerCase().includes(item.name.toLowerCase().replace(/\s+/g, '')),
  )
  return partial?.code || normalized
}

export const sortFtpUploadsByNewest = (items: FtpUploadListItem[]) => {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bTime - aTime
  })
}
