export type InvoiceRouteType = 'po' | 'po-view' | 'nonpo' | 'non-po-view' | 'cas' | string

export function isInvoiceViewRouteType(type?: InvoiceRouteType | null): boolean {
  return type === 'po-view' || type === 'non-po-view'
}

export function isInvoiceSubmissionRouteType(type?: InvoiceRouteType | null): boolean {
  return type === 'po' || type === 'nonpo' || type === 'cas'
}

/** Draft / editable submission from list (status 0, rejected 5, or status name contains "draft"). */
export function isDraftInvoiceStatus(
  statusCode: number | string | null | undefined,
  statusName?: string | null,
): boolean {
  const code = Number(statusCode)
  if (!Number.isNaN(code) && (code === 0 || code === 5)) return true

  const name = (statusName || '').toLowerCase()
  return name.includes('draft')
}

export function resolveInvoiceAddRouteType(
  statusCode: number | string | null | undefined,
  statusName: string | null | undefined,
  invoiceKind: 'po' | 'nonpo',
): 'po' | 'po-view' | 'nonpo' | 'non-po-view' {
  const editable = isDraftInvoiceStatus(statusCode, statusName)
  if (invoiceKind === 'po') return editable ? 'po' : 'po-view'
  return editable ? 'nonpo' : 'non-po-view'
}

export function isSavedDraftStatus(status: number | string | null | undefined): boolean {
  const code = Number(status)
  return !Number.isNaN(code) && (code === 0 || code === 5)
}

export function isDraftFormStatus(status: number | string | null | undefined): boolean {
  const code = Number(status)
  return !Number.isNaN(code) && (code === 0 || code === -1 || code === 5)
}

/** Submission flow (create / edit draft) vs read-only detail view. */
export function isInvoiceSubmissionFlow(
  routeType: InvoiceRouteType | null | undefined,
  loadedStatus?: number | string | null,
): boolean {
  if (isSavedDraftStatus(loadedStatus)) return true
  return !isInvoiceViewRouteType(routeType)
}
