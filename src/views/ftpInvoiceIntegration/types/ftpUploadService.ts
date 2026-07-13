import invoiceHttp from '@/core/utils/invoiceApi'
import { extractGrFromText } from '@/core/utils/grDocumentNo'
import { isEditableInvoiceStatus, resolveInvoiceRejectReason } from '@/core/utils/invoiceSubmissionRoute'
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

  const normalized = items.map((item) => {
    const row = normalizeFtpUploadListItem(item as FtpUploadListItem)
    return {
      ...row,
      status: resolveFtpUploadTabStatus(row.status),
    }
  })

  return sortFtpUploadsByNewest(normalized)
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

const normalizePreviewText = (value: unknown): string => {
  if (value == null) return ''
  return String(value).trim()
}

type ParsedPreviewEntry = { key: string; value: string }

const flattenParsedPreview = (value: unknown, parentKey = ''): ParsedPreviewEntry[] => {
  if (!value || typeof value !== 'object') return []

  const entries: ParsedPreviewEntry[] = []
  const record = value as Record<string, unknown>
  for (const [rawKey, rawValue] of Object.entries(record)) {
    const key = rawKey.toLowerCase()
    const fullKey = parentKey ? `${parentKey}.${key}` : key

    if (rawValue == null) continue

    if (typeof rawValue === 'string' || typeof rawValue === 'number') {
      const text = normalizePreviewText(rawValue)
      if (text) entries.push({ key: fullKey, value: text })
      continue
    }

    if (Array.isArray(rawValue)) {
      for (const child of rawValue) {
        entries.push(...flattenParsedPreview(child, fullKey))
      }
      continue
    }

    entries.push(...flattenParsedPreview(rawValue, fullKey))
  }

  return entries
}

const findParsedPreviewValue = (
  parsedPreview: Record<string, unknown> | null | undefined,
  patterns: RegExp[],
): string => {
  if (!parsedPreview) return ''
  const entries = flattenParsedPreview(parsedPreview)
  const match = entries.find((entry) => patterns.some((pattern) => pattern.test(entry.key)))
  return match?.value || ''
}

const readParsedPreviewDirectValue = (
  parsedPreview: Record<string, unknown> | null | undefined,
  keys: string[],
): string => {
  if (!parsedPreview) return ''
  for (const key of keys) {
    const value = normalizePreviewText(parsedPreview[key])
    if (value) return value
  }
  return ''
}

const resolveParsedPreviewInvoiceVendorNo = (
  parsedPreview: Record<string, unknown> | null | undefined,
): string => {
  const direct = readParsedPreviewDirectValue(parsedPreview, [
    'invoiceVendorNo',
    'invoice_vendor_no',
    'documentNo',
    'document_no',
    'vendorInvoiceNo',
    'invoiceNo',
    'invoice_no',
    'reference',
  ])
  if (direct) return direct

  return findParsedPreviewValue(parsedPreview, [
    /invoicevendorno/,
    /invoice_vendor_no/,
    /invoice\.vendor\.no/,
    /documentno/,
    /vendorinvoiceno/,
    /invoiceno/,
    /invoicenumber/,
    /^reference$/,
  ])
}

const resolveParsedPreviewGrDocumentNo = (
  parsedPreview: Record<string, unknown> | null | undefined,
): string => {
  const direct = findParsedPreviewValue(parsedPreview, [
    /grdocumentno/,
    /gr_document_no/,
    /goodsreceipt.*document.*no/,
    /goodsreceipt.*no/,
    /grno/,
  ])
  if (direct) return direct

  const fallback = flattenParsedPreview(parsedPreview).find((entry) => {
    if (!/gr/.test(entry.key)) return false
    return /^GR[-/A-Z0-9]{6,}$/i.test(entry.value.replace(/\s+/g, ''))
  })
  return fallback?.value || ''
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

/** Sembunyikan Submitted Document No hanya untuk status draft workflow (bukan flag hasDraft). */
export const shouldHideSubmittedDocumentNo = (
  row: Pick<FtpDataListRow, 'statusCode' | 'portalStatus' | 'statusName'>,
): boolean => {
  const statusName = row.statusName?.trim().toLowerCase()
  return (
    row.portalStatus?.toLowerCase() === 'draft' ||
    row.statusCode === DRAFT_STATUS_CODE ||
    statusName === 'draft' ||
    statusName === 'drafted'
  )
}

export const isFtpDraftDataRow = (
  row: Pick<FtpDataListRow, 'hasDraft' | 'statusCode' | 'portalStatus' | 'statusName'>,
): boolean => {
  const statusName = row.statusName?.trim().toLowerCase()
  return (
    row.hasDraft === true ||
    row.portalStatus?.toLowerCase() === 'draft' ||
    row.statusCode === DRAFT_STATUS_CODE ||
    statusName === 'draft' ||
    statusName === 'drafted'
  )
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

/** Badge class selaras dengan modal Upload FTP Document (primary = teal, success = Done). */
export const getFtpUploadTabStatusBadgeClass = (status: string | null | undefined): string => {
  return resolveFtpUploadTabStatus(status) === 'Done' ? 'badge-success' : 'badge-primary'
}

/** Upload tab: status Uploaded dari GET /ftp-uploads. */
export const isFtpUploadedRow = (row: FtpDataListRow): boolean => {
  const status = resolveFtpUploadTabStatus(row.ftpUploadStatus || row.portalStatus)
  return status.toLowerCase() === 'uploaded'
}

const readNestedHeaderDocumentNo = (item: Record<string, unknown>): string => {
  const invoice = (item.invoice as Record<string, unknown>) || {}
  const draft = (item.draft as Record<string, unknown>) || {}
  const header =
    ((invoice.header as Record<string, unknown>) ||
      (draft.header as Record<string, unknown>) ||
      {}) as Record<string, unknown>

  return normalizePreviewText(header.documentNo)
}

const readNestedHeaderInvoiceNo = (item: Record<string, unknown>): string => {
  const invoice = (item.invoice as Record<string, unknown>) || {}
  const draft = (item.draft as Record<string, unknown>) || {}
  const header =
    ((invoice.header as Record<string, unknown>) ||
      (draft.header as Record<string, unknown>) ||
      {}) as Record<string, unknown>

  return normalizePreviewText(header.invoiceNo)
}

const resolveFtpListSubmittedDocumentNo = (
  item: Record<string, unknown>,
  invoiceListItem: FtpInvoiceListItem | null,
): string => {
  const candidates = [
    item.invoiceNo,
    invoiceListItem?.invoiceNo,
    readNestedHeaderInvoiceNo(item),
    item.submittedDocumentNo,
    item.submitttedDocumentNo,
  ]

  for (const candidate of candidates) {
    const value = normalizePreviewText(candidate)
    if (value) return value
  }

  return ''
}

const readItemReference = (item: Record<string, unknown>): string => {
  const preview = (item.preview as Record<string, unknown>) || {}
  const parsedPreview =
    (item.parsedPreview as Record<string, unknown>) ||
    (preview.parsedPreview as Record<string, unknown>) ||
    preview

  const reference = normalizePreviewText(
    parsedPreview?.reference ?? preview?.reference ?? item.reference,
  )
  if (!reference) return ''

  return extractGrFromText(reference) || reference
}

const readItemPoGrDocumentNo = (item: Record<string, unknown>): string => {
  const sources = [
    item.pogr,
    (item.invoice as Record<string, unknown> | undefined)?.pogr,
    (item.draft as Record<string, unknown> | undefined)?.pogr,
  ]

  for (const pogr of sources) {
    if (!Array.isArray(pogr) || !pogr.length) continue
    const first = pogr[0] as Record<string, unknown>
    const gr = normalizePreviewText(first?.grDocumentNo)
    if (gr) return gr
  }

  return ''
}

const resolveFtpListInvoiceVendorNo = (
  item: Record<string, unknown>,
  invoiceListItem: FtpInvoiceListItem | null,
): string => {
  const parsedPreview = (item.parsedPreview as Record<string, unknown>) || null

  const candidates = [
    item.invoiceVendorNo,
    item.documentNo,
    invoiceListItem?.documentNo,
    resolveParsedPreviewInvoiceVendorNo(parsedPreview),
    readItemReference(item),
    readItemPoGrDocumentNo(item),
    item.grDocumentNo,
    invoiceListItem?.grDocumentNo,
    readNestedHeaderDocumentNo(item),
  ]

  for (const candidate of candidates) {
    const value = normalizePreviewText(candidate)
    if (value) return value
  }

  return ''
}

const applyInvoiceVendorNoToRow = (row: FtpDataListRow, vendorNo: string): FtpDataListRow => {
  const normalized = normalizePreviewText(vendorNo)
  if (!normalized) return row

  return {
    ...row,
    documentNo: normalized,
    invoiceVendorNo: normalized,
  }
}

/** Gabungkan parsedPreview / documentNo dari daftar FTP upload ke baris FTP Data. */
export const enrichFtpDataListWithUploads = (
  rows: FtpDataListRow[],
  uploads: FtpUploadListItem[],
): FtpDataListRow[] => {
  if (!rows.length || !uploads.length) return rows

  const uploadByUid = new Map<string, FtpUploadListItem>()
  for (const upload of uploads) {
    const uid = String(upload.invoiceUId || '').trim()
    if (uid) uploadByUid.set(uid, upload)
  }

  return rows.map((row) => {
    if (resolveFtpDataInvoiceVendorNo(row)) return row

    const upload = uploadByUid.get(resolveFtpRowUid(row))
    if (!upload) return row

    const vendorNo = resolveFtpListInvoiceVendorNo(
      {
        invoiceVendorNo: upload.documentNo,
        documentNo: upload.documentNo,
        parsedPreview: upload.parsedPreview,
        reference: upload.parsedPreview?.reference,
      },
      null,
    )

    return applyInvoiceVendorNoToRow(row, vendorNo)
  })
}

/** Ambil detail upload untuk baris draft yang masih belum punya Invoice Vendor No. */
export const enrichFtpDataListMissingVendorNos = async (
  rows: FtpDataListRow[],
): Promise<FtpDataListRow[]> => {
  const targets = rows.filter(
    (row) => !resolveFtpDataInvoiceVendorNo(row) && resolveFtpRowUid(row),
  )
  if (!targets.length) return rows

  const resolved = new Map<string, string>()
  await Promise.all(
    targets.map(async (row) => {
      const uid = resolveFtpRowUid(row)
      try {
        const detail = await fetchFtpUploadDetail(uid)
        const vendorNo = resolveFtpListInvoiceVendorNo(
          {
            invoiceVendorNo: detail.documentNo,
            documentNo: detail.documentNo,
            parsedPreview: detail.parsedPreview,
            reference: detail.parsedPreview?.reference,
          },
          row.invoiceListItem || null,
        )
        if (vendorNo) resolved.set(uid, vendorNo)
      } catch {
        // Detail upload opsional — abaikan baris yang gagal.
      }
    }),
  )

  if (!resolved.size) return rows

  return rows.map((row) => {
    const vendorNo = resolved.get(resolveFtpRowUid(row))
    return vendorNo ? applyInvoiceVendorNoToRow(row, vendorNo) : row
  })
}

/** Submitted Document No (e.g. MF00PO2026000130) for FTP Data grid. */
export const resolveFtpDataSubmittedDocumentNo = (
  row: Pick<FtpDataListRow, 'invoiceNo' | 'submittedDocumentNo' | 'invoiceListItem'>,
): string => {
  const fromRow = row.invoiceNo?.trim() || row.invoiceListItem?.invoiceNo?.trim() || ''
  if (fromRow) return fromRow

  return row.submittedDocumentNo?.trim() || ''
}

/** Nilai Invoice Vendor No untuk tampilan grid FTP Data. */
export const resolveFtpDataInvoiceVendorNo = (row: FtpDataListRow): string =>
  row.documentNo?.trim() || row.invoiceVendorNo?.trim() || row.grDocumentNo?.trim() || ''

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
  const invoiceVendorNo = resolveFtpListInvoiceVendorNo(item, invoiceListItem)

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
    documentNo: invoiceVendorNo,
    invoiceNo: resolveFtpListSubmittedDocumentNo(item, invoiceListItem),
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
    invoiceVendorNo: invoiceVendorNo || toOptionalString(item.invoiceVendorNo),
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
  return sortFtpUploadsByNewest(
    items.filter((row) => isFtpUploadedRow(row)).map(mapFtpDataRowToUploadListItem),
  )
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

  const sorted = sortFtpDataByNewest(normalized)

  return {
    items: sorted,
    total: Number(root.total) || sorted.length,
  }
}

export const fetchFtpDataList = async (
  params: FtpDataQueryParams = {},
): Promise<FtpDataListResponse> => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  const resp = await invoiceHttp.get('/invoice/ftp-data', {
    params: {
      companyCode: params.companyCode || null,
      invoiceTypeCode:
        params.invoiceTypeCode != null && !Number.isNaN(Number(params.invoiceTypeCode))
          ? Number(params.invoiceTypeCode)
          : null,
      invoiceDate: params.invoiceDate || null,
      statuscode: params.statusCode ?? null,
      searchText: params.searchText || null,
      page,
      pageSize,
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
      taxNo: row.taxNo || listItem?.taxNo || '',
      documentNo:
        row.documentNo ||
        row.invoiceVendorNo ||
        listItem?.documentNo ||
        null,
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
    ftpData: row,
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

  const vendorIdRef = vendor.vendorId != null ? String(vendor.vendorId) : ''
  if (vendorIdRef && !form.vendorId) {
    const byId = vendorList.find(
      (item) => item.sapCode === vendorIdRef || item.vendorId === vendorIdRef,
    )
    form.vendorId = byId?.sapCode || vendorIdRef
  }
  if (vendor.npwp) form.npwp = String(vendor.npwp)
  if (vendor.vendorAddress) form.address = String(vendor.vendorAddress)
}

const applyFtpPaymentToForm = (
  form: formTypes,
  savedInvoice: Record<string, unknown>,
  draft: Record<string, unknown>,
) => {
  const payment = resolveFtpInvoiceSection<Record<string, unknown>>(savedInvoice, draft, 'payment')
  if (!payment || !Object.keys(payment).length) return

  if (payment.paymentId != null) form.paymentId = Number(payment.paymentId) || 0
  if (payment.bankKey) form.bankKeyId = String(payment.bankKey)
  if (payment.bankName) form.bankNameId = String(payment.bankName)
  if (payment.beneficiaryName) form.beneficiaryName = String(payment.beneficiaryName)
  if (payment.bankAccountNo) form.bankAccountNumber = String(payment.bankAccountNo)
  if (payment.bankCountryCode) form.bankCountryCode = String(payment.bankCountryCode)
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

const shouldApplyFtpContextStatus = (
  currentStatus: number | string | null | undefined,
  contextStatus: number,
): boolean => {
  const current = Number(currentStatus)
  if (Number.isNaN(current) || current === -1) return true
  if (!isEditableInvoiceStatus(current)) return false
  return isEditableInvoiceStatus(contextStatus)
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
  if (listItem.statusCode != null) {
    const contextStatus = Number(listItem.statusCode)
    if (shouldApplyFtpContextStatus(form.status, contextStatus)) {
      form.status = contextStatus
    }
  }
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

  const grNo = normalizePreviewText(listItem.grDocumentNo)
  if (
    grNo &&
    !skipManual.has('pogr') &&
    (!Array.isArray(form.invoicePoGr) || form.invoicePoGr.length === 0)
  ) {
    form.invoicePoGr = [
      {
        id: 0,
        poNo: '',
        poItem: 0,
        grDocumentNo: grNo,
        grDocumentItem: 0,
        grDocumentDate: '',
        taxCode: '',
        currencyLC: form.currency || 'IDR',
        currencyTC: form.currency || 'IDR',
        itemAmountLC: 0,
        itemAmountTC: 0,
        quantity: 0,
        uom: '',
        itemText: '',
        currency: form.currency || 'IDR',
        conditionType: '',
        conditionTypeDesc: '',
        qcStatus: '',
        postingDate: '',
        enteredOn: '',
        purchasingOrg: '',
        department: '',
        whtType: '',
        whtCode: '',
        whtBaseAmount: 0,
        whtAmount: 0,
        deliveryOrderNo: '',
        isEdit: false,
      },
    ]
  }
}

const hasMeaningfulPoGrRows = (rows: formTypes['invoicePoGr'] | null | undefined): boolean => {
  if (!Array.isArray(rows) || rows.length === 0) return false

  return rows.some((row) => {
    if (Number(row.id) > 0) return true
    return !!(
      row.poNo ||
      row.taxCode ||
      row.conditionType ||
      row.whtType ||
      row.whtCode ||
      row.department ||
      Number(row.itemAmountLC) > 0
    )
  })
}

const buildPoGrSeedRow = (grDocumentNo: string, currency: string): formTypes['invoicePoGr'][number] =>
  ({
    id: 0,
    poNo: '',
    poItem: 0,
    grDocumentNo,
    grDocumentItem: 0,
    grDocumentDate: '',
    taxCode: '',
    currencyLC: currency || 'IDR',
    currencyTC: currency || 'IDR',
    itemAmountLC: 0,
    itemAmountTC: 0,
    quantity: 0,
    uom: '',
    itemText: '',
    currency: currency || 'IDR',
    conditionType: '',
    conditionTypeDesc: '',
    qcStatus: '',
    postingDate: '',
    enteredOn: '',
    purchasingOrg: '',
    department: '',
    whtType: '',
    whtCode: '',
    whtBaseAmount: 0,
    whtAmount: 0,
    deliveryOrderNo: '',
    isEdit: false,
  }) as formTypes['invoicePoGr'][number]

const resolveSavedInvoiceGrDocumentNo = (savedInvoice: Record<string, unknown>): string => {
  const pogr = savedInvoice.pogr
  if (!Array.isArray(pogr) || pogr.length === 0) return ''

  const first = pogr[0] as Record<string, unknown> | undefined
  return normalizePreviewText(first?.grDocumentNo)
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
  if (header.statusCode != null) {
    const contextStatus = Number(header.statusCode)
    if (shouldApplyFtpContextStatus(form.status, contextStatus)) {
      form.status = contextStatus
    }
  }
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
  } else if (skipManual.has('documentNo') && preservedVendorNo?.trim()) {
    form.invoiceVendorNo = preservedVendorNo
  }

  if (header.invoiceNo) form.invoiceNo = String(header.invoiceNo)
  if (header.invoiceDate) form.invoiceDate = String(header.invoiceDate)
  if (header.taxNo) form.taxNoInvoice = String(header.taxNo)
  if (header.currCode) form.currency = String(header.currCode)
  if (header.notes) form.description = String(header.notes)
  const rejectNotes = resolveInvoiceRejectReason(
    header as { statusNotes?: string | null; StatusNotes?: string | null },
    Array.isArray(savedInvoice.workflow)
      ? (savedInvoice.workflow as Array<{ stateCode?: number; actionerNotes?: string }>)
      : undefined,
  )
  if (rejectNotes) form.statusNotes = rejectNotes

  applyFtpVendorToForm(form, vendor, header, context, vendorList)
  applyFtpPaymentToForm(form, savedInvoice, draft)
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

  // Keep manual edits from sync payload, but allow parsed preview to seed empty manual fields.
  if (skipManual.has('pogr') && hasMeaningfulPoGrRows(preservedPoGr)) {
    form.invoicePoGr = preservedPoGr || []
  } else if (!skipManual.has('pogr') && !form.invoicePoGr?.length) {
    form.invoicePoGr = []
  }

  applyFtpInvoiceListItemToForm(form, context.invoiceListItem, companyList, skipManual)

  const previewRecord = preview as Record<string, unknown>
  const parsedInvoiceVendorNo = resolveParsedPreviewInvoiceVendorNo(context.parsedPreview)
  const previewReference = normalizePreviewText(previewRecord.reference)
  const listItemVendorNo = normalizePreviewText(context.invoiceListItem?.documentNo)
  const ftpRowVendorNo = normalizePreviewText(
    context.ftpData?.invoiceVendorNo || context.ftpData?.documentNo || '',
  )
  const headerVendorNo = normalizePreviewText(header.documentNo)

  const seedInvoiceVendorNo =
    parsedInvoiceVendorNo ||
    previewReference ||
    ftpRowVendorNo ||
    listItemVendorNo ||
    headerVendorNo

  if (seedInvoiceVendorNo && !form.invoiceVendorNo?.trim()) {
    form.invoiceVendorNo = seedInvoiceVendorNo
  }

  const parsedGrDocumentNo = resolveParsedPreviewGrDocumentNo(context.parsedPreview)
  const ftpRowGrDocumentNo = normalizePreviewText(context.ftpData?.grDocumentNo || '')
  const listItemGrDocumentNo = normalizePreviewText(context.invoiceListItem?.grDocumentNo || '')
  const savedInvoiceGrDocumentNo = resolveSavedInvoiceGrDocumentNo(savedInvoice)
  const seedGrDocumentNo =
    parsedGrDocumentNo || ftpRowGrDocumentNo || listItemGrDocumentNo || savedInvoiceGrDocumentNo

  if (seedGrDocumentNo && !hasMeaningfulPoGrRows(form.invoicePoGr)) {
    if (!Array.isArray(form.invoicePoGr) || form.invoicePoGr.length === 0) {
      form.invoicePoGr = [buildPoGrSeedRow(seedGrDocumentNo, form.currency || 'IDR')]
    } else if (!form.invoicePoGr[0]?.grDocumentNo) {
      form.invoicePoGr[0].grDocumentNo = seedGrDocumentNo
    }
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

export const mergeFtpSyncContextWithUploadDetail = (
  base: FtpSyncContext | null,
  detail: FtpUploadListItem,
  nameFallbacks?: FtpUploadOriginalFileNames,
): FtpSyncContext => {
  const detailContext = buildSyncContextFromDetail(detail, nameFallbacks)

  return {
    ...(base || {}),
    ...detailContext,
    ftpUploadUId:
      base?.ftpUploadUId ||
      detailContext.ftpUploadUId ||
      String(detail.invoiceUId || ''),
    savedInvoiceUId:
      base?.savedInvoiceUId ||
      detailContext.savedInvoiceUId ||
      String(detail.invoiceUId || ''),
    ftpData: base?.ftpData ?? detailContext.ftpData ?? null,
    invoice: base?.invoice ?? detailContext.invoice ?? null,
    invoiceListItem: base?.invoiceListItem ?? detailContext.invoiceListItem ?? null,
    parsedPreview: detailContext.parsedPreview || base?.parsedPreview || null,
    manualFields: base?.manualFields || detailContext.manualFields || DEFAULT_MANUAL_FIELDS,
    hasDraft: base?.hasDraft ?? detailContext.hasDraft,
  }
}

/** Run backend OCR/sync on uploaded FTP files, then merge with existing session context. */
export const enrichFtpContextWithUploadSync = async (
  base: FtpSyncContext | null,
  ftpUploadId: string,
  savedInvoiceUId?: string | null,
): Promise<FtpSyncContext> => {
  let context: FtpSyncContext | null = base

  try {
    const syncResult = await syncFtpUpload(ftpUploadId)
    const syncContext = buildSyncContextFromSyncResponse(syncResult)
    context = {
      ...(context || {}),
      ...syncContext,
      ftpUploadUId: ftpUploadId,
      savedInvoiceUId: savedInvoiceUId || syncContext.savedInvoiceUId || ftpUploadId,
      ftpData: context?.ftpData ?? syncContext.ftpData ?? null,
      invoice: syncContext.invoice || context?.invoice || null,
      invoiceListItem: syncContext.invoiceListItem || context?.invoiceListItem || null,
      parsedPreview: context?.parsedPreview || null,
    }
  } catch (error) {
    console.debug('FTP upload sync/OCR failed, falling back to upload detail', error)
    try {
      const detail = await fetchFtpUploadDetail(ftpUploadId)
      context = mergeFtpSyncContextWithUploadDetail(context, detail)
    } catch (detailError) {
      console.debug('Failed to load FTP upload detail after sync failure', detailError)
    }
  }

  return {
    ...(context || {}),
    ftpUploadUId: ftpUploadId,
    savedInvoiceUId: savedInvoiceUId || context?.savedInvoiceUId || ftpUploadId,
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

const getCreatedTimestamp = (value: unknown): number => {
  if (value == null || value === '') return 0
  const timestamp = new Date(String(value)).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

export const sortFtpUploadsByNewest = (items: FtpUploadListItem[]) => {
  return [...items].sort((a, b) => {
    const dateDiff = getCreatedTimestamp(b.createdAt) - getCreatedTimestamp(a.createdAt)
    if (dateDiff !== 0) return dateDiff
    return String(b.invoiceUId || '').localeCompare(String(a.invoiceUId || ''))
  })
}

export const sortFtpDataByNewest = (items: FtpDataListRow[]) => {
  return [...items].sort((a, b) => {
    const dateDiff = getCreatedTimestamp(b.createdUtcDate) - getCreatedTimestamp(a.createdUtcDate)
    if (dateDiff !== 0) return dateDiff
    return (b.id || 0) - (a.id || 0)
  })
}
