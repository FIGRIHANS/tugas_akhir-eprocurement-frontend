import invoiceHttp from '@/core/utils/invoiceApi'
import type { responseFileTypes } from '@/views/invoice/types/invoiceDocument'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'
import type { ListPoTypes } from '@/stores/views/invoice/types/submission'
import type {
  FtpFilePreview,
  FtpInvoiceListItem,
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

const DRAFT_STATUS_CODE = 0
const DRAFT_STATUS_NAME = 'draft'

export type FtpDataDocument = {
  documentType: number
  documentName: string
  documentUrl: string
}

export type FtpDataListRow = ListPoTypes & {
  reffId?: string | null
  ftpUploadUId?: string | null
  /** Portal status from API `status`: Draft / Uploaded / Done */
  portalStatus?: string | null
  ftpUploadStatus?: string | null
  flagSync?: boolean
  hasDraft?: boolean
  source?: string | null
  documents?: FtpDataDocument[]
  invoiceListItem?: FtpInvoiceListItem | null
  invoiceVendorNo?: string | null
  submittedDocumentNo?: string | null
  taxNo?: string | null
  dpp?: number | null
  vatAmount?: number | null
}

export interface FtpDataQueryParams {
  statusCode?: number | null
  companyCode?: string
  invoiceTypeCode?: number
  invoiceDate?: string
  page?: number
  pageSize?: number
  searchText?: string
}

export interface FtpDataListResponse {
  items: FtpDataListRow[]
  total: number
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
  hasDraft?: boolean
  draft?: Record<string, unknown> | null
  preview?: FtpSyncPreview | null
  invoice?: Record<string, unknown> | null
  ftpData?: FtpDataListRow | null
  invoiceListItem?: FtpInvoiceListItem | null
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

  return items.map((item) => {
    const normalized = normalizeFtpUploadListItem(item as FtpUploadListItem)
    return {
      ...normalized,
      status: resolveFtpUploadTabStatus(normalized.status),
    }
  })
}

export const parseFtpUploadDetail = (payload: unknown): FtpUploadListItem => {
  const detail = unwrapApiContent(payload)
  const normalized = normalizeFtpUploadListItem(detail as FtpUploadListItem)
  return {
    ...normalized,
    status: resolveFtpUploadTabStatus(normalized.status),
  }
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
    status: resolveFtpUploadTabStatus(
      (resultNode.status as string) || (content.status as string) || 'Uploaded',
    ),
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

const toOptionalNumber = (value: unknown): number | null => {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const toOptionalString = (value: unknown): string | null => {
  if (value == null) return null
  const text = String(value).trim()
  return text || null
}

const parseFtpInvoiceDate = (value: unknown): string => {
  const raw = toOptionalString(value)
  if (!raw) return ''
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  }
  return raw
}

const resolveFtpDataReffId = (item: Record<string, unknown>): string => {
  return (
    toOptionalString(item.reffId) ||
    toOptionalString(item.invoiceUId) ||
    toOptionalString(item.invoiceUid) ||
    toOptionalString(item.ftpUploadUId) ||
    toOptionalString(item.ftpUploadUid) ||
    toOptionalString(item.uploadUId) ||
    ''
  )
}

export const resolveFtpRowUid = (row: FtpDataListRow): string => {
  return String(row.reffId || row.invoiceUId || row.ftpUploadUId || '')
}

/** Status badge label on FTP Data grid — invoice workflow (Drafted, dll.). */
export const getFtpDataStatusLabel = (row: FtpDataListRow): string => {
  if (row.statusName?.trim()) return row.statusName
  if (row.hasDraft || row.statusCode === DRAFT_STATUS_CODE) return 'Drafted'
  return '-'
}

export const formatFtpDataCompany = (row: FtpDataListRow): string => {
  const code = row.companyCode?.trim()
  const name = row.companyName?.trim()
  if (code && name) return `${code} - ${name}`
  return code || name || '-'
}

export const formatFtpDataAmount = (value?: number | null): string => {
  if (value == null || value === 0) return '-'
  return String(value)
}

/** Buka form Invoice Data (bukan preview PDF saja). */
export const canOpenFtpInvoiceForm = (row: FtpDataListRow): boolean => {
  return (
    row.hasDraft === true ||
    row.portalStatus === 'Draft' ||
    row.statusCode === DRAFT_STATUS_CODE
  )
}

/**
 * Status portal di tab Upload Invoice & Tax Document — hanya Uploaded / Done.
 * Backend kadang mengirim Draft karena auto-create draft invoice; tetap tampilkan Uploaded.
 */
export const resolveFtpUploadTabStatus = (status: string | null | undefined): string => {
  const raw = (status || '').trim()
  if (!raw) return 'Uploaded'

  const lower = raw.toLowerCase()
  if (lower === 'done') return 'Done'
  if (lower === 'draft' || lower === 'drafted' || lower === 'uploaded') return 'Uploaded'

  return raw
}

/** Upload tab: status Uploaded dari GET /ftp-uploads. */
export const isFtpUploadedRow = (row: FtpDataListRow): boolean => {
  const status = resolveFtpUploadTabStatus(row.ftpUploadStatus || row.portalStatus)
  return status.toLowerCase() === 'uploaded'
}

export const normalizeFtpDataListItem = (item: Record<string, unknown>): FtpDataListRow => {
  const reffId = resolveFtpDataReffId(item)
  const ftpUploadUId =
    toOptionalString(item.ftpUploadUId) ||
    toOptionalString(item.ftpUploadUid) ||
    reffId ||
    null
  const portalStatus = toOptionalString(item.status)
  const isDone = portalStatus === 'Done'
  const hasDraft =
    item.hasDraft === true || (!isDone && !!toOptionalString(item.vendorName))
  const statusCode =
    item.statusCode != null && item.statusCode !== ''
      ? Number(item.statusCode)
      : hasDraft
        ? DRAFT_STATUS_CODE
        : null
  const invoiceListItem = (item.invoiceListItem as FtpInvoiceListItem) || null
  const statusName =
    toOptionalString(item.statusName) ||
    invoiceListItem?.statusName ||
    (hasDraft || statusCode === DRAFT_STATUS_CODE ? 'Drafted' : null) ||
    ''
  const documents = Array.isArray(item.documents)
    ? (item.documents as FtpDataDocument[])
    : []

  return {
    id: Number(item.id) || 0,
    invoiceUId: reffId,
    reffId,
    ftpUploadUId,
    invoiceTypeCode: Number(item.invoiceTypeCode ?? invoiceListItem?.invoiceTypeCode) || 0,
    invoiceTypeName: String(item.invoiceTypeName || invoiceListItem?.invoiceTypeName || ''),
    invoiceDPCode: Number(item.invoiceDPCode ?? invoiceListItem?.invoiceDPCode) || 0,
    invoiceDPName: String(item.invoiceDPName || invoiceListItem?.invoiceDPName || ''),
    companyCode: String(item.companyCode || invoiceListItem?.companyCode || ''),
    companyName: String(item.companyName || invoiceListItem?.companyName || ''),
    documentNo: String(
      item.invoiceVendorNo || item.documentNo || invoiceListItem?.documentNo || '',
    ),
    invoiceNo: String(
      item.submittedDocumentNo ||
        item.submitttedDocumentNo ||
        item.invoiceNo ||
        invoiceListItem?.invoiceNo ||
        '',
    ),
    invoiceDate: parseFtpInvoiceDate(item.invoiceDate),
    statusCode: statusCode ?? -1,
    statusName,
    poNo: toOptionalString(item.poNo ?? invoiceListItem?.poNo),
    grDocumentNo: String(item.grDocumentNo || invoiceListItem?.grDocumentNo || ''),
    estimatedPaymentDate: toOptionalString(
      item.estimatedPaymentDate ?? invoiceListItem?.estimatedPaymentDate,
    ),
    totalGrossAmount:
      Number(item.totalGrossAmount ?? invoiceListItem?.totalGrossAmount ?? item.dpp) || 0,
    totalNetAmount: Number(item.totalNetAmount ?? invoiceListItem?.totalNetAmount) || 0,
    vendorName: String(item.vendorName || invoiceListItem?.vendorName || ''),
    isOpenChild: false,
    createdUtcDate: String(item.createdDate || item.createdUtcDate || item.createdAt || ''),
    invoiceSourceName: toOptionalString(item.source || item.invoiceSourceName) || 'FTP',
    invoiceSource: toOptionalNumber(item.invoiceSource) ?? (item.source === 'ftp' ? 3 : null),
    fpStatus: (item.fpStatus as boolean | null) ?? null,
    vatStatus: (item.vatStatus as boolean | null) ?? null,
    whtStatus: (item.whtStatus as boolean | null) ?? null,
    poPrice: (item.poPrice as boolean | null) ?? null,
    sapPostingCode: toOptionalString(item.sapPostingCode),
    portalStatus,
    ftpUploadStatus: toOptionalString(item.ftpUploadStatus || item.uploadStatus) || portalStatus,
    flagSync: item.flagSync === true,
    hasDraft,
    source: toOptionalString(item.source),
    documents,
    invoiceListItem,
    invoiceVendorNo: toOptionalString(item.invoiceVendorNo),
    submittedDocumentNo: toOptionalString(item.submittedDocumentNo || item.submitttedDocumentNo),
    taxNo: toOptionalString(item.taxNo || invoiceListItem?.taxNo),
    dpp: toOptionalNumber(item.dpp),
    vatAmount: toOptionalNumber(item.vatAmount),
  }
}

export const mapFtpDataRowToUploadListItem = (row: FtpDataListRow): FtpUploadListItem => {
  const findDoc = (documentType: number) =>
    row.documents?.find((doc) => doc.documentType === documentType)

  const invoiceDoc = findDoc(1)
  const taxDoc = findDoc(2)
  const referenceDoc = findDoc(3)
  const uid = row.ftpUploadUId || row.reffId || row.invoiceUId

  return {
    invoiceUId: uid,
    vendorName: row.vendorName,
    invoiceNo: row.invoiceNo || null,
    documentNo: row.documentNo || row.invoiceVendorNo || null,
    status: resolveFtpUploadTabStatus(row.ftpUploadStatus || row.portalStatus || 'Uploaded'),
    createdAt: row.createdUtcDate || null,
    invoiceFileName: invoiceDoc?.documentName || null,
    taxFileName: taxDoc?.documentName || null,
    referenceFileName: referenceDoc?.documentName || null,
    invoiceFileUrl: invoiceDoc?.documentUrl || null,
    taxFileUrl: taxDoc?.documentUrl || null,
    referenceFileUrl: referenceDoc?.documentUrl || null,
    files: {
      invoice: invoiceDoc
        ? { fileName: invoiceDoc.documentName, url: invoiceDoc.documentUrl }
        : null,
      tax: taxDoc ? { fileName: taxDoc.documentName, url: taxDoc.documentUrl } : null,
      reference: referenceDoc
        ? { fileName: referenceDoc.documentName, url: referenceDoc.documentUrl }
        : null,
    },
  }
}

export const fetchFtpUploadListFromData = async (): Promise<FtpUploadListItem[]> => {
  const { items } = await fetchFtpDataList({ page: 1, pageSize: 1000 })
  return items.filter((row) => isFtpUploadedRow(row)).map(mapFtpDataRowToUploadListItem)
}

export const parseFtpDataList = (payload: unknown): FtpDataListRow[] => {
  return parseFtpDataListResponse(payload).items
}

export const parseFtpDataListResponse = (payload: unknown): FtpDataListResponse => {
  const root = unwrapApiContent(payload)
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(root)
      ? root
      : (root.items as unknown[]) || (root.data as unknown[]) || []

  if (!Array.isArray(items)) {
    return { items: [], total: Number(root.total) || 0 }
  }

  const normalized = items
    .filter((item) => item && typeof item === 'object')
    .map((item) => normalizeFtpDataListItem(item as Record<string, unknown>))

  return {
    items: normalized,
    total: Number(root.total) || normalized.length,
  }
}

export const fetchFtpDataList = async (
  params: FtpDataQueryParams = {},
): Promise<FtpDataListResponse> => {
  const resp = await invoiceHttp.get('/invoice/ftp-data', {
    params: {
      companyCode: params.companyCode || null,
      invoiceTypeCode: params.invoiceTypeCode || null,
      invoiceDate: params.invoiceDate || null,
      statuscode: params.statusCode ?? null,
      searchText: params.searchText || null,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 1000,
    },
  })

  const content = resp?.data?.result?.content ?? resp?.data?.result ?? resp?.data ?? {}
  return parseFtpDataListResponse(content)
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

const DEFAULT_MANUAL_FIELDS = ['documentNo', 'pogr']

const hasSectionData = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0
}

const resolveFtpInvoiceSection = <T extends Record<string, unknown>>(
  invoice: Record<string, unknown>,
  draft: Record<string, unknown>,
  key: string,
): T => {
  const fromInvoice = invoice[key]
  if (hasSectionData(fromInvoice)) return fromInvoice as T

  const fromDraft = draft[key]
  if (hasSectionData(fromDraft)) return fromDraft as T

  return {} as T
}

export const parseFtpSyncContent = (
  payload: unknown,
  ftpUploadUId?: string,
): FtpSyncResult => {
  const content = unwrapApiContent(payload)
  const invoice = (content.invoice as Record<string, unknown>) || {}
  const header = (invoice.header as Record<string, unknown>) || {}
  const draft = (content.draft as Record<string, unknown>) || {}
  const draftHeader = (draft.header as Record<string, unknown>) || {}

  const ftpDataRaw = (content.ftpData as Record<string, unknown>) || null
  const ftpDataFromListItem =
    !ftpDataRaw && content.invoiceListItem
      ? (content.invoiceListItem as Record<string, unknown>)
      : null

  return {
    ftpUploadUId: String(ftpUploadUId || content.ftpUploadUId || ''),
    savedInvoiceUId: String(
      header.invoiceUId || content.savedInvoiceUId || draftHeader.invoiceUId || '',
    ),
    syncedAt: (content.syncedAt as string) || null,
    warnings: Array.isArray(content.warnings) ? (content.warnings as string[]) : [],
    manualFields: Array.isArray(content.manualFields)
      ? (content.manualFields as string[])
      : DEFAULT_MANUAL_FIELDS,
    hasDraft: content.hasDraft === true,
    draft,
    preview: (content.preview as FtpSyncPreview) || {},
    invoice,
    ftpData: ftpDataRaw || ftpDataFromListItem,
    invoiceListItem: (content.invoiceListItem as FtpInvoiceListItem) || null,
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
  return parseFtpSyncContent(content, invoiceUId)
}

const resolveVendorNameFromInvoice = (invoice: Record<string, unknown>): string | null => {
  const vendor = (invoice.vendor as Record<string, unknown>) || {}
  const header = (invoice.header as Record<string, unknown>) || {}
  return (
    (vendor.vendorName as string) ||
    (header.vendorName as string) ||
    null
  )
}

export const buildFtpSyncContextFromDataRow = (row: FtpDataListRow): FtpSyncContext => {
  const uid = resolveFtpRowUid(row)
  const listItem = row.invoiceListItem

  const documents =
    row.documents?.map((doc) => ({
      id: 0,
      documentType: doc.documentType,
      documentName: doc.documentName,
      documentUrl: doc.documentUrl,
      documentSize: '0',
    })) || []

  const invoice: Record<string, unknown> = {
    header: {
      invoiceUId: uid,
      statusCode:
        row.statusCode != null && row.statusCode >= 0 ? row.statusCode : DRAFT_STATUS_CODE,
      statusName: row.statusName || 'Drafted',
      invoiceTypeCode: row.invoiceTypeCode || listItem?.invoiceTypeCode || 901,
      invoiceTypeName: row.invoiceTypeName || listItem?.invoiceTypeName || 'PO',
      invoiceDPCode: row.invoiceDPCode || listItem?.invoiceDPCode || 9011,
      companyCode: row.companyCode || listItem?.companyCode || '',
      companyName: row.companyName || listItem?.companyName || '',
      invoiceNo: row.invoiceNo || listItem?.invoiceNo || '',
      invoiceDate: row.invoiceDate || listItem?.invoiceDate || '',
      taxNo: row.taxNo || '',
      documentNo: null,
    },
    vendor: {
      vendorName: row.vendorName || listItem?.vendorName || '',
    },
    calculation: {
      subtotal: row.dpp ?? listItem?.dpp ?? 0,
      vatAmount: row.vatAmount ?? listItem?.vatAmount ?? 0,
      totalGrossAmount: row.totalGrossAmount ?? listItem?.totalGrossAmount ?? 0,
      totalNetAmount: row.totalNetAmount ?? listItem?.totalNetAmount ?? 0,
      whtAmount: 0,
      additionalCost: 0,
    },
    documents,
    ocr: {},
    pogr: [],
  }

  return {
    ftpUploadUId: uid,
    savedInvoiceUId: uid,
    hasDraft: row.hasDraft !== false,
    manualFields: [...DEFAULT_MANUAL_FIELDS],
    invoice,
    invoiceListItem: listItem,
    vendorName: row.vendorName || listItem?.vendorName || null,
  }
}

export const buildSyncContextFromSyncResponse = (sync: FtpSyncResult): FtpSyncContext => ({
  ftpUploadUId: sync.ftpUploadUId,
  savedInvoiceUId: sync.savedInvoiceUId,
  syncedAt: sync.syncedAt,
  warnings: sync.warnings,
  manualFields: sync.manualFields,
  hasDraft: sync.hasDraft,
  draft: sync.draft,
  preview: sync.preview,
  invoice: sync.invoice,
  ftpData: normalizeFtpSyncFtpData(sync.ftpData),
  invoiceListItem: sync.invoiceListItem,
  vendorName: resolveVendorNameFromInvoice(sync.invoice),
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
  const uid = row.ftpUploadUId || row.reffId || row.invoiceUId
  return uid ? String(uid) : null
}

export const upsertFtpDataListRow = (
  list: FtpDataListRow[],
  ftpData: FtpDataListRow | null | undefined,
): FtpDataListRow[] => {
  if (!ftpData) return list

  const rowKey = resolveFtpUploadUIdFromRow(ftpData) || ftpData.invoiceUId
  if (!rowKey) return [ftpData, ...list]

  const index = list.findIndex((row) => {
    const existingKey = resolveFtpUploadUIdFromRow(row) || row.invoiceUId
    return existingKey === rowKey
  })

  if (index < 0) return [ftpData, ...list]

  const updated = [...list]
  updated[index] = { ...updated[index], ...ftpData }
  return updated
}

export const normalizeFtpSyncFtpData = (
  ftpData: Record<string, unknown> | null | undefined,
): FtpDataListRow | null => {
  if (!ftpData || typeof ftpData !== 'object') return null
  return normalizeFtpDataListItem(ftpData)
}

export const isDraftFtpDataRow = (row: FtpDataListRow) => canOpenFtpInvoiceForm(row)

/** @deprecated use canOpenFtpInvoiceForm */
export const canOpenFtpDraftForm = (row: FtpDataListRow) => canOpenFtpInvoiceForm(row)

/** Sync = retry/refresh OCR — bukan gatekeeper buka form. */
export const canSyncFtpDataRow = (row: FtpDataListRow) => {
  const uid = resolveFtpUploadUIdFromRow(row)
  if (!uid) return false
  return row.portalStatus !== 'Done'
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

const applyFtpVendorToForm = (
  form: formTypes,
  vendor: Record<string, unknown>,
  header: Record<string, unknown>,
  context: FtpSyncContext,
  vendorList: Array<{ sapCode: string; vendorName: string; vendorId: string; npwp?: string }>,
) => {
  const vendorNameFromSync =
    (vendor.vendorName as string) ||
    (header.vendorName as string) ||
    context.vendorName ||
    form.vendorName ||
    ''

  if (vendorNameFromSync) {
    form.vendorName = String(vendorNameFromSync)
    const vendorMatch = vendorList.find(
      (item) => item.vendorName.trim().toLowerCase() === form.vendorName.trim().toLowerCase(),
    )
    if (vendorMatch) form.vendorId = vendorMatch.sapCode
  }

  if (vendor.vendorId != null && !form.vendorId) {
    form.vendorId = String(vendor.vendorId)
  }
  if (vendor.npwp) form.npwp = String(vendor.npwp)
  if (vendor.vendorAddress) form.address = String(vendor.vendorAddress)
}

const applyFtpOcrToForm = (form: formTypes, ocr: Record<string, unknown>) => {
  if (ocr.vendorName) form.ocrVendorName = String(ocr.vendorName)
  if (ocr.vendorNPWP) form.vendorNPWP = String(ocr.vendorNPWP)
  if (ocr.companyName) form.ocrCompanyName = String(ocr.companyName)
  if (ocr.npwpCompany) form.npwpCompany = String(ocr.npwpCompany)
  if (ocr.taxInvoiceNumber) form.taxInvoiceNumber = String(ocr.taxInvoiceNumber)
  if (ocr.taxInvoiceDate) form.taxInvoiceDate = String(ocr.taxInvoiceDate)
  if (ocr.salesAmount != null) form.salesAmount = Number(ocr.salesAmount)
  if (ocr.otherDPP != null) form.otherDPP = Number(ocr.otherDPP)
  if (ocr.vatAmount != null) form.ocrVatAmount = Number(ocr.vatAmount)
  if (ocr.vatbmAmount != null) form.ocrVatbmAmount = Number(ocr.vatbmAmount)
  if (ocr.taxInvoiceStatus) form.taxInvoiceStatus = String(ocr.taxInvoiceStatus)
  if (ocr.referenceNo) form.referenceNo = String(ocr.referenceNo)
}

const applyFtpCalculationToForm = (form: formTypes, calculation: Record<string, unknown>) => {
  if (calculation.subtotal != null) form.subtotal = Number(calculation.subtotal) || 0
  if (calculation.vatAmount != null) form.vatAmount = Number(calculation.vatAmount) || 0
  if (calculation.whtAmount != null) form.whtAmount = Number(calculation.whtAmount) || 0
  if (calculation.additionalCost != null) {
    form.additionalCostCalc = Number(calculation.additionalCost) || 0
  }
  if (calculation.totalGrossAmount != null) {
    form.totalGrossAmount = Number(calculation.totalGrossAmount) || 0
  }
  if (calculation.totalNetAmount != null) {
    form.totalNetAmount = Number(calculation.totalNetAmount) || 0
  }
}

/** Summary fields from `content.invoiceListItem` (list-invoice shape) for preview display. */
export const applyFtpInvoiceListItemToForm = (
  form: formTypes,
  listItem: FtpInvoiceListItem | null | undefined,
  companyList: Array<{ code: string; name: string }>,
  skipManual: Set<string>,
) => {
  if (!listItem) return

  if (listItem.invoiceTypeCode != null) form.invoiceType = String(listItem.invoiceTypeCode)
  if (listItem.invoiceTypeName) form.invoiceTypeName = listItem.invoiceTypeName
  if (listItem.invoiceDPCode != null) form.invoiceDp = String(listItem.invoiceDPCode)
  if (listItem.statusCode != null) form.status = Number(listItem.statusCode)
  if (listItem.invoiceSourceName) form.invoiceSource = listItem.invoiceSourceName

  if (listItem.companyCode) {
    form.companyCode = resolveCompanyCodeValue(listItem.companyCode, companyList)
    const match = companyList.find((item) => item.code === form.companyCode)
    if (match) {
      const parts = match.name.split(' - ')
      form.companyName = parts.length > 1 ? parts[parts.length - 1].trim() : match.name
    }
  } else if (listItem.companyName) {
    form.companyName = listItem.companyName
  }

  if (listItem.vendorName) form.vendorName = listItem.vendorName
  if (listItem.invoiceNo) form.invoiceNo = listItem.invoiceNo
  if (listItem.invoiceDate) form.invoiceDate = listItem.invoiceDate

  if (listItem.dpp != null) form.subtotal = Number(listItem.dpp) || 0
  if (listItem.vatAmount != null) form.vatAmount = Number(listItem.vatAmount) || 0
  if (listItem.whtAmount != null) form.whtAmount = Number(listItem.whtAmount) || 0
  if (listItem.totalGrossAmount != null) {
    form.totalGrossAmount = Number(listItem.totalGrossAmount) || 0
  }
  if (listItem.totalNetAmount != null) {
    form.totalNetAmount = Number(listItem.totalNetAmount) || 0
  }

  // documentNo and pOs are manual — never bind from invoiceListItem
  if (!skipManual.has('documentNo') && listItem.documentNo != null) {
    form.invoiceVendorNo = String(listItem.documentNo)
  }
}

/** Bind form detail from `content.invoice` after FTP sync. */
export const applyFtpSyncDraftToForm = (
  form: formTypes,
  context: FtpSyncContext,
  companyList: Array<{ code: string; name: string }>,
  vendorList: Array<{ sapCode: string; vendorName: string; vendorId: string; npwp?: string }> = [],
) => {
  const skipManual = new Set(context.manualFields || DEFAULT_MANUAL_FIELDS)
  const savedInvoice = context.invoice || {}
  const draft = context.draft || {}
  const header = resolveFtpInvoiceSection<Record<string, unknown>>(savedInvoice, draft, 'header')
  const vendor = resolveFtpInvoiceSection<Record<string, unknown>>(savedInvoice, draft, 'vendor')
  const calculation = resolveFtpInvoiceSection<Record<string, unknown>>(
    savedInvoice,
    draft,
    'calculation',
  )
  const ocr = resolveFtpInvoiceSection<Record<string, unknown>>(savedInvoice, draft, 'ocr')
  const preview = context.preview || {}
  const documents =
    (Array.isArray(savedInvoice.documents) && savedInvoice.documents.length > 0
      ? savedInvoice.documents
      : null) ?? draft.documents

  const preservedVendorNo = form.invoiceVendorNo
  const preservedPoGr = skipManual.has('pogr') ? [...(form.invoicePoGr || [])] : null

  form.invoiceUId = String(
    context.savedInvoiceUId || header.invoiceUId || context.ftpUploadUId || '',
  )
  if (header.statusCode != null) form.status = Number(header.statusCode)
  if (header.invoiceTypeCode != null) form.invoiceType = String(header.invoiceTypeCode)
  if (header.invoiceTypeName) form.invoiceTypeName = String(header.invoiceTypeName)
  if (header.invoiceDPCode != null) form.invoiceDp = String(header.invoiceDPCode)
  if (header.invoiceSourceName) form.invoiceSource = String(header.invoiceSourceName)

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

  applyFtpVendorToForm(form, vendor, header, context, vendorList)
  applyFtpCalculationToForm(form, calculation)
  applyFtpOcrToForm(form, ocr)

  const invoiceDocument =
    documentFromDraft(documents, 1, 'invoice.pdf') ||
    previewToDocument(preview.invoice, 'invoice.pdf')
  const taxDocument =
    documentFromDraft(documents, 2, 'tax.pdf') || previewToDocument(preview.tax, 'tax.pdf')
  const referenceDocument =
    documentFromDraft(documents, 3, 'reference.pdf') ||
    previewToDocument(preview.reference, 'reference.pdf')

  if (invoiceDocument) form.invoiceDocument = invoiceDocument
  if (taxDocument) form.tax = taxDocument
  if (referenceDocument) form.referenceDocument = referenceDocument

  // invoiceVendorNo (documentNo) and PO/GR are manual — never auto-fill from sync
  if (skipManual.has('pogr')) {
    form.invoicePoGr = preservedPoGr || []
  } else if (!form.invoicePoGr?.length) {
    form.invoicePoGr = []
  }

  applyFtpInvoiceListItemToForm(form, context.invoiceListItem, companyList, skipManual)
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
