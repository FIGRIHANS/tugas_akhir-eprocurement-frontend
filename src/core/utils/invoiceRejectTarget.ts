/** Structured invoice reject target (page → component → field). Partial metadata is allowed. */

export type InvoiceRejectPageKey =
  | 'data'
  | 'ocrAiVerification'
  | 'information'
  | 'preview'

export interface InvoiceRejectTargetMeta {
  page?: InvoiceRejectPageKey | string | null
  component?: string | null
  field?: string | null
}

export interface InvoiceRejectParsedNotes {
  meta: InvoiceRejectTargetMeta | null
  notes: string
  raw: string
}

export interface InvoiceRejectCatalogOption {
  value: string
  text: string
}

export interface InvoiceRejectFieldOption extends InvoiceRejectCatalogOption {
  component: string
  page: InvoiceRejectPageKey
}

const META_PREFIX = '__IREJ__'
const META_SUFFIX = '__'

/** Pages available for reject targeting (submission tabs). */
export const INVOICE_REJECT_PAGES: InvoiceRejectCatalogOption[] = [
  { value: 'data', text: 'Invoice Data' },
  { value: 'ocrAiVerification', text: 'Invoice OCR & AI Verification' },
  { value: 'information', text: 'Invoice Information' },
  { value: 'preview', text: 'Invoice Preview' },
]

/** Components grouped by page. */
export const INVOICE_REJECT_COMPONENTS: Record<string, InvoiceRejectCatalogOption[]> = {
  data: [
    { value: 'generalData', text: 'General Data' },
    { value: 'paymentInformation', text: 'Payment Information' },
    { value: 'alternativePayment', text: 'Alternative Payment' },
  ],
  ocrAiVerification: [{ value: 'ocrAiVerification', text: 'OCR & AI Verification' }],
  information: [
    { value: 'invoiceHeader', text: 'Invoice Header' },
    { value: 'invoiceDocument', text: 'Invoice Document' },
    { value: 'taxDocument', text: 'Tax Document' },
    { value: 'invoiceCalculation', text: 'Invoice Calculation' },
    { value: 'invoicePoGr', text: 'Invoice PO & GR Item' },
    { value: 'invoiceItem', text: 'Invoice Item' },
    { value: 'additionalCost', text: 'Additional Cost' },
  ],
  preview: [{ value: 'invoicePreview', text: 'Invoice Preview' }],
}

/** Fields grouped by component. */
export const INVOICE_REJECT_FIELDS: Record<string, InvoiceRejectCatalogOption[]> = {
  generalData: [
    { value: 'vendorId', text: 'Vendor Name' },
    { value: 'npwp', text: 'NPWP' },
    { value: 'address', text: 'Address' },
  ],
  paymentInformation: [
    { value: 'bankKeyId', text: 'Bank Key' },
    { value: 'bankNameId', text: 'Bank Name' },
    { value: 'beneficiaryName', text: 'Beneficiary Name' },
    { value: 'bankAccountNumber', text: 'Bank Account Number' },
    { value: 'bankCountryCode', text: 'Bank Country' },
  ],
  alternativePayment: [
    { value: 'nameAlternative', text: 'Name' },
    { value: 'streetAltiernative', text: 'Street' },
    { value: 'bankAccountNumberAlternative', text: 'Bank Account Number' },
    { value: 'bankKeyAlternative', text: 'Bank Key' },
    { value: 'emailAlternative', text: 'Email' },
  ],
  invoiceHeader: [
    { value: 'invoiceType', text: 'Invoice Type' },
    { value: 'companyCode', text: 'Company Code' },
    { value: 'invoiceVendorNo', text: 'Invoice Vendor No.' },
    { value: 'invoiceDate', text: 'Invoice Date' },
    { value: 'taxNoInvoice', text: 'Tax Document No.' },
    { value: 'taxDate', text: 'Tax Document Date' },
    { value: 'currency', text: 'Currency' },
    { value: 'department', text: 'Department / Cost Center' },
    { value: 'description', text: 'Description / Notes' },
    { value: 'cashJournalCode', text: 'Cash Journal' },
    { value: 'casNoCode', text: 'CAS No.' },
  ],
  invoiceDocument: [
    { value: 'invoiceDocument', text: 'Invoice Document' },
    { value: 'referenceDocument', text: 'Reference Document' },
    { value: 'otherDocument', text: 'Other Document' },
  ],
  taxDocument: [{ value: 'tax', text: 'Tax Document' }],
  invoiceCalculation: [
    { value: 'subtotal', text: 'Subtotal' },
    { value: 'vatAmount', text: 'VAT Amount' },
    { value: 'whtAmount', text: 'WHT Amount' },
    { value: 'totalGrossAmount', text: 'Total Gross Amount' },
    { value: 'totalNetAmount', text: 'Total Net Amount' },
  ],
  invoicePoGr: [
    { value: 'grSearch', text: 'GR Document No (Search)' },
    { value: 'poNo', text: 'PO Number' },
    { value: 'poItem', text: 'PO Item' },
    { value: 'grDocumentNo', text: 'GR Document No' },
    { value: 'grDocumentItem', text: 'GR Document Item' },
    { value: 'grDocumentDate', text: 'GR Document Date' },
    { value: 'deliveryOrderNo', text: 'Delivery Order No' },
    { value: 'itemAmount', text: 'Item Amount' },
    { value: 'quantity', text: 'Quantity' },
    { value: 'uom', text: 'UoM' },
    { value: 'itemText', text: 'Item Text' },
    { value: 'conditionType', text: 'Condition Type' },
    { value: 'qcStatus', text: 'QC Status' },
    { value: 'taxCode', text: 'Tax Code' },
    { value: 'vatAmount', text: 'VAT Amount' },
    { value: 'whtType', text: 'WHT Type' },
    { value: 'whtCode', text: 'WHT Code' },
    { value: 'costCenter', text: 'Department / Cost Center' },
    { value: 'invoicePoGr', text: 'Entire PO / GR Table' },
  ],
  invoiceItem: [{ value: 'invoiceItem', text: 'Invoice Items' }],
  additionalCost: [{ value: 'additionalCost', text: 'Additional Cost Lines' }],
  ocrAiVerification: [{ value: 'ocrAiVerification', text: 'OCR Verification Result' }],
  invoicePreview: [{ value: 'invoicePreview', text: 'Preview Content' }],
}

/** HeaderDocument inner tab mapping for information page. */
export const REJECT_COMPONENT_TO_HEADER_TAB: Record<string, string> = {
  invoiceHeader: 'header',
  invoiceDocument: 'document',
  taxDocument: 'tax',
}

/** BankKey inner tab mapping for data page. */
export const REJECT_COMPONENT_TO_BANK_TAB: Record<string, string> = {
  paymentInformation: 'payment',
  alternativePayment: 'alternative',
}

export function getRejectComponentsForPage(page?: string | null): InvoiceRejectCatalogOption[] {
  if (!page) return []
  return INVOICE_REJECT_COMPONENTS[page] || []
}

export function getRejectFieldsForComponent(
  component?: string | null,
): InvoiceRejectCatalogOption[] {
  if (!component) return []
  return INVOICE_REJECT_FIELDS[component] || []
}

export function getRejectPageLabel(page?: string | null): string {
  if (!page) return ''
  return INVOICE_REJECT_PAGES.find((item) => item.value === page)?.text || page
}

export function getRejectComponentLabel(page?: string | null, component?: string | null): string {
  if (!component) return ''
  const list = getRejectComponentsForPage(page)
  return list.find((item) => item.value === component)?.text || component
}

export function getRejectFieldLabel(component?: string | null, field?: string | null): string {
  if (!field) return ''
  const list = getRejectFieldsForComponent(component)
  return list.find((item) => item.value === field)?.text || field
}

export function buildRejectTargetSelector(
  meta: InvoiceRejectTargetMeta | null | undefined,
): string | null {
  if (!meta?.page) return null
  const parts = [meta.page]
  if (meta.component) parts.push(meta.component)
  if (meta.field) parts.push(meta.field)
  return parts.join(':')
}

export function normalizeRejectTargetMeta(
  meta: InvoiceRejectTargetMeta | null | undefined,
): InvoiceRejectTargetMeta | null {
  if (!meta) return null
  const page = meta.page?.toString().trim() || null
  const component = meta.component?.toString().trim() || null
  const field = meta.field?.toString().trim() || null
  if (!page && !component && !field) return null
  return { page, component, field }
}

/**
 * Encode structured reject metadata into notes so existing APIs
 * that only accept `notes: string` can still carry location info.
 */
export function encodeInvoiceRejectNotes(
  notes: string,
  meta?: InvoiceRejectTargetMeta | null,
): string {
  const trimmedNotes = (notes || '').trim()
  const normalized = normalizeRejectTargetMeta(meta)
  if (!normalized?.page && !normalized?.component && !normalized?.field) {
    return trimmedNotes
  }

  const payload = JSON.stringify({
    p: normalized.page || undefined,
    c: normalized.component || undefined,
    f: normalized.field || undefined,
  })

  return `${META_PREFIX}${payload}${META_SUFFIX}\n${trimmedNotes}`.trim()
}

/** Parse notes that may contain embedded reject metadata. */
export function parseInvoiceRejectNotes(raw?: string | null): InvoiceRejectParsedNotes {
  const text = (raw || '').trim()
  if (!text) {
    return { meta: null, notes: '', raw: '' }
  }

  if (text.startsWith(META_PREFIX)) {
    const end = text.indexOf(META_SUFFIX, META_PREFIX.length)
    if (end > META_PREFIX.length) {
      const jsonPart = text.slice(META_PREFIX.length, end)
      const notes = text.slice(end + META_SUFFIX.length).replace(/^\n/, '').trim()
      try {
        const parsed = JSON.parse(jsonPart) as { p?: string; c?: string; f?: string }
        const meta = normalizeRejectTargetMeta({
          page: parsed.p,
          component: parsed.c,
          field: parsed.f,
        })
        return { meta, notes, raw: text }
      } catch {
        return { meta: null, notes: text, raw: text }
      }
    }
  }

  return { meta: null, notes: text, raw: text }
}

export function formatRejectTargetLocation(meta?: InvoiceRejectTargetMeta | null): string {
  const normalized = normalizeRejectTargetMeta(meta)
  if (!normalized) return ''

  const parts: string[] = []
  if (normalized.page) parts.push(getRejectPageLabel(normalized.page))
  if (normalized.component) {
    parts.push(getRejectComponentLabel(normalized.page, normalized.component))
  }
  if (normalized.field) {
    parts.push(getRejectFieldLabel(normalized.component, normalized.field))
  }
  return parts.join(' › ')
}

export function buildRejectTargetDomId(meta?: InvoiceRejectTargetMeta | null): string | null {
  const selector = buildRejectTargetSelector(meta)
  if (!selector) return null
  return `reject-target-${selector.replace(/:/g, '-')}`
}

const HIGHLIGHT_CLASS = 'invoice-reject-target-highlight'
const HIGHLIGHT_MS = 4500

export function scrollAndHighlightRejectTarget(
  meta?: InvoiceRejectTargetMeta | null,
): boolean {
  const normalized = normalizeRejectTargetMeta(meta)
  if (!normalized?.page) return false

  const candidates: string[] = []
  const full = buildRejectTargetDomId(normalized)
  if (full) candidates.push(full)

  // Partial fallback: field missing → component; component missing → page
  if (normalized.field && normalized.component) {
    candidates.push(
      buildRejectTargetDomId({
        page: normalized.page,
        component: normalized.component,
      }) || '',
    )
  }
  if (normalized.component) {
    candidates.push(buildRejectTargetDomId({ page: normalized.page }) || '')
  }

  const unique = [...new Set(candidates.filter(Boolean))]
  for (const id of unique) {
    const el = document.getElementById(id)
    if (!el) continue

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add(HIGHLIGHT_CLASS)
    window.setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_MS)
    return true
  }

  return false
}
