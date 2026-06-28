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

/** Invoice rejected by verifier/approver and editable for resubmission. */
export function isRejectedInvoiceStatus(status: number | string | null | undefined): boolean {
  const code = Number(status)
  return !Number.isNaN(code) && code === 5
}

type RejectReasonHeader = {
  statusNotes?: string | null
  StatusNotes?: string | null
}

type RejectReasonWorkflowStep = {
  stateCode?: number | null
  actionerNotes?: string | null
}

/** Resolve verifier/approver rejection notes from header or workflow. */
export function resolveInvoiceRejectReason(
  header?: RejectReasonHeader | null,
  workflow?: RejectReasonWorkflowStep[] | null,
): string {
  const fromHeader = header?.statusNotes?.trim() || header?.StatusNotes?.trim()
  if (fromHeader) return fromHeader

  const rejectedStep = (workflow ?? []).find((step) => Number(step.stateCode) === 5)
  return rejectedStep?.actionerNotes?.trim() || ''
}

export function isDraftFormStatus(status: number | string | null | undefined): boolean {
  const code = Number(status)
  return !Number.isNaN(code) && (code === 0 || code === -1 || code === 5)
}

/** Statuses where submitter may edit, save draft, or resubmit. */
export function isEditableInvoiceStatus(status: number | string | null | undefined): boolean {
  const code = Number(status)
  return !Number.isNaN(code) && (code === -1 || code === 0 || code === 5)
}

/** Profile ID for internal invoice submitter (employee submission flow). */
export const INTERNAL_SUBMITTER_PROFILE_ID = 3001

/** Profile ID for invoice submitter (FTP / vendor submission flow). */
export const SUBMITTOR_PROFILE_ID = 3200

export function isSubmittorProfile(
  profileId: number | string | null | undefined,
  isVendor = false,
): boolean {
  if (isVendor) return true
  const id = Number(profileId)
  return !Number.isNaN(id) && id === SUBMITTOR_PROFILE_ID
}

/** Submission flow (create / edit draft) vs read-only detail view. */
export function isInvoiceSubmissionFlow(
  routeType: InvoiceRouteType | null | undefined,
  loadedStatus?: number | string | null,
): boolean {
  const statusCode =
    loadedStatus == null || loadedStatus === '' ? null : Number(loadedStatus)

  if (statusCode != null && !Number.isNaN(statusCode) && statusCode !== -1) {
    if (!isEditableInvoiceStatus(statusCode)) return false
  }

  if (isSavedDraftStatus(loadedStatus)) return true
  return !isInvoiceViewRouteType(routeType)
}
