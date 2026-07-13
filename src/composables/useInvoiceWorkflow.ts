import { formatDateYearFirst, formatDateTimeYearFirst } from '@/composables/date-format'

export interface InvoiceWorkflowStep {
  profileId: number
  stateCode: number
  stateName: string
  profileName?: string
  category?: string
  step?: number
  actioner?: number
  actionerDate?: string
  actionerName?: string
}

export const FINANCE_AP_OFFICER_PROFILE_ID = 3002
export const ACCOUNTING_TAX_PROFILE_ID = 3003
export const FINANCE_AP_SUPERVISOR_PROFILE_ID = 3004
export const FINANCE_APPROVER_PROFILE_IDS = [3003, 3004] as const

/** Max rows requested per list API call (server-side pagination). */
export const FINANCE_LIST_FETCH_SIZE = 10

const FINANCE_LIST_ENRICH_CONCURRENCY = 6

export const WORKFLOW_STATE = {
  WAITING_VERIFY: 1,
  WAITING_APPROVAL: 2,
  VERIFIED: 3,
  APPROVED: 4,
  REJECTED: 5,
  IDLE: 99,
} as const

const WORKFLOW_STATE_LABELS: Record<number, string> = {
  [WORKFLOW_STATE.WAITING_VERIFY]: 'Waiting for Verify',
  [WORKFLOW_STATE.WAITING_APPROVAL]: 'Waiting for Approval',
  [WORKFLOW_STATE.VERIFIED]: 'Verified',
  [WORKFLOW_STATE.APPROVED]: 'Approved',
  [WORKFLOW_STATE.REJECTED]: 'Rejected',
  [WORKFLOW_STATE.IDLE]: 'Idle',
  7: 'Sent to SAP',
  10: 'Paid',
}

const VERIFICATION_VERIFIED_EXCLUDED_STATUS_CODES = new Set<number>([
  WORKFLOW_STATE.APPROVED,
  7,
  9,
  10,
])

const isApprovedLikeStatusName = (statusName?: string | null): boolean => {
  const name = normalizeProfileName(statusName)
  if (!name) return false
  if (name.includes('waiting for approval') || name.includes('waiting for verify')) return false
  return name.includes('approved')
}

const isSentToSapLikeStatusName = (statusName?: string | null): boolean => {
  return normalizeProfileName(statusName).includes('sent to sap')
}

const isPaidLikeStatusName = (statusName?: string | null): boolean => {
  const name = normalizeProfileName(statusName)
  return name.includes('paid')
}

/** Invoice has progressed past the Verification "Verified" bucket. */
export function isProgressedPastVerification(
  item: InvoiceListStatusFields,
  context?: FinanceListDetailContext | null,
): boolean {
  const code = normalizeStateCode(item.statusCode)
  if (VERIFICATION_VERIFIED_EXCLUDED_STATUS_CODES.has(code)) return true

  if (
    isApprovedLikeStatusName(item.statusName) ||
    isSentToSapLikeStatusName(item.statusName) ||
    isPaidLikeStatusName(item.statusName)
  ) {
    return true
  }

  if (!context) return false

  const header = normalizeStateCode(context.headerStatusCode)
  if (VERIFICATION_VERIFIED_EXCLUDED_STATUS_CODES.has(header)) return true

  return (
    hasWorkflowApprovalState(context.workflow) ||
    hasFinanceApprovalCompleted(context.workflow) ||
    isWorkflowFullyApproved(context.workflow)
  )
}

/** @deprecated Use isProgressedPastVerification */
export function isBeyondVerificationVerifiedStatus(item: InvoiceListStatusFields): boolean {
  return isProgressedPastVerification(item)
}

export function shouldIncludeInVerificationVerifiedFilter(
  item: InvoiceListStatusFields,
  context?: FinanceListDetailContext | null,
): boolean {
  if (isProgressedPastVerification(item, context)) return false

  const code = normalizeStateCode(item.statusCode)
  return code === WORKFLOW_STATE.VERIFIED || code === WORKFLOW_STATE.WAITING_APPROVAL
}

export function filterVerificationVerifiedListItems<T extends InvoiceListStatusFields>(
  items: T[],
): T[] {
  return items.filter((item) => shouldIncludeInVerificationVerifiedFilter(item))
}

export function isVerificationVerifiedFilterActive(
  filterStatusCode?: number | string | null,
): boolean {
  return Number(filterStatusCode) === WORKFLOW_STATE.VERIFIED
}

/** Profile step can stay Verified/Approved while header status has progressed further. */
const HEADER_SYNC_SOURCE_STATUS_CODES = new Set<number>([
  WORKFLOW_STATE.VERIFIED,
  WORKFLOW_STATE.APPROVED,
])

export interface InvoiceListStatusFields {
  statusCode?: number | null
  statusName?: string | null
}

export interface FinanceListDetailContext {
  headerStatusCode: number | null
  workflow: InvoiceWorkflowStep[]
}

const normalizeStateCode = (stateCode?: number | string | null): number => {
  const parsed = Number(stateCode)
  return Number.isFinite(parsed) ? parsed : -1
}

const normalizeProfileName = (value?: string | null): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

const isRejectedStatusLabel = (statusName?: string | null): boolean => {
  return normalizeProfileName(statusName).includes('reject')
}

export function isWorkflowGloballyRejected(
  workflow?: InvoiceWorkflowStep[] | null,
): boolean {
  return (workflow ?? []).some(
    (step) => normalizeStateCode(step.stateCode) === WORKFLOW_STATE.REJECTED,
  )
}

export function applyGlobalRejectedListStatus<T extends InvoiceListStatusFields>(
  item: T,
): T {
  return {
    ...item,
    statusCode: WORKFLOW_STATE.REJECTED,
    statusName: 'Rejected',
  }
}

export function applyHeaderListStatus<T extends InvoiceListStatusFields>(
  item: T,
  headerStatusCode: number,
): T {
  const label = WORKFLOW_STATE_LABELS[headerStatusCode]
  if (!label) return item

  return {
    ...item,
    statusCode: headerStatusCode,
    statusName: label,
  }
}

const isFinanceApproverProfile = (step: InvoiceWorkflowStep): boolean => {
  if ((FINANCE_APPROVER_PROFILE_IDS as readonly number[]).includes(Number(step.profileId))) {
    return true
  }

  const profileName = normalizeProfileName(step.profileName)
  if (
    profileName.includes('accounting & tax') ||
    profileName.includes('accounting and tax') ||
    profileName.includes('finance ap supervisor')
  ) {
    return true
  }

  const category = String(step.category ?? '')
    .trim()
    .toUpperCase()
  return category === 'A' || category === 'APPROVAL'
}

const getFinanceApprovalSteps = (
  workflow?: InvoiceWorkflowStep[] | null,
): InvoiceWorkflowStep[] => {
  return (workflow ?? []).filter(isFinanceApproverProfile)
}

/** Any workflow step already marked Approved (state 4). */
export function hasWorkflowApprovalState(
  workflow?: InvoiceWorkflowStep[] | null,
): boolean {
  return (workflow ?? []).some(
    (step) => normalizeStateCode(step.stateCode) === WORKFLOW_STATE.APPROVED,
  )
}

export function hasFinanceApprovalCompleted(
  workflow?: InvoiceWorkflowStep[] | null,
): boolean {
  return (
    hasWorkflowApprovalState(workflow) ||
    getFinanceApprovalSteps(workflow).some(
      (step) => normalizeStateCode(step.stateCode) === WORKFLOW_STATE.APPROVED,
    )
  )
}

export function isWorkflowFullyApproved(
  workflow?: InvoiceWorkflowStep[] | null,
): boolean {
  const steps = getFinanceApprovalSteps(workflow)
  if (steps.length === 0) return false

  return steps.every(
    (step) => normalizeStateCode(step.stateCode) === WORKFLOW_STATE.APPROVED,
  )
}

export function shouldEnrichFinanceListItem(
  item: InvoiceListStatusFields,
  filterStatusCode?: number | null,
): boolean {
  const filterCode = filterStatusCode != null ? Number(filterStatusCode) : null
  const itemCode = normalizeStateCode(item.statusCode)

  if (filterCode === WORKFLOW_STATE.VERIFIED) {
    return itemCode !== WORKFLOW_STATE.REJECTED && !isRejectedStatusLabel(item.statusName)
  }

  if (filterCode === WORKFLOW_STATE.APPROVED || filterCode === WORKFLOW_STATE.REJECTED) {
    return true
  }

  if (itemCode === WORKFLOW_STATE.WAITING_VERIFY) return false

  return (
    HEADER_SYNC_SOURCE_STATUS_CODES.has(itemCode) ||
    itemCode === WORKFLOW_STATE.WAITING_APPROVAL
  )
}

export function shouldSyncListItemWithHeaderStatus(
  item: InvoiceListStatusFields,
): boolean {
  return shouldEnrichFinanceListItem(item)
}

/** @deprecated Use shouldSyncListItemWithHeaderStatus */
export const shouldResolveGlobalRejectionForListItem = shouldSyncListItemWithHeaderStatus

/**
 * List API returns the viewer's completed workflow step (e.g. Verified for 3002) while
 * header status may stay Waiting for Approval until every approver finishes.
 */
export function resolveFinanceListItemFromDetailContext<T extends InvoiceListStatusFields>(
  item: T,
  context: FinanceListDetailContext,
): T {
  const rowStatus = normalizeStateCode(item.statusCode)
  const headerStatus = normalizeStateCode(context.headerStatusCode)
  const workflow = context.workflow

  if (
    rowStatus === WORKFLOW_STATE.REJECTED ||
    isRejectedStatusLabel(item.statusName) ||
    headerStatus === WORKFLOW_STATE.REJECTED ||
    isWorkflowGloballyRejected(workflow)
  ) {
    return applyGlobalRejectedListStatus(item)
  }

  if (headerStatus === WORKFLOW_STATE.APPROVED || headerStatus === 7 || headerStatus === 10) {
    return applyHeaderListStatus(item, headerStatus)
  }

  if (rowStatus === WORKFLOW_STATE.VERIFIED && headerStatus > WORKFLOW_STATE.VERIFIED) {
    return applyHeaderListStatus(item, headerStatus)
  }

  if (
    rowStatus === WORKFLOW_STATE.VERIFIED &&
    (hasWorkflowApprovalState(workflow) ||
      hasFinanceApprovalCompleted(workflow) ||
      isWorkflowFullyApproved(workflow))
  ) {
    return applyHeaderListStatus(item, WORKFLOW_STATE.APPROVED)
  }

  if (rowStatus === WORKFLOW_STATE.WAITING_APPROVAL && hasWorkflowApprovalState(workflow)) {
    return applyHeaderListStatus(item, WORKFLOW_STATE.APPROVED)
  }

  if (
    rowStatus === WORKFLOW_STATE.APPROVED &&
    !normalizeProfileName(item.statusName).includes('approved')
  ) {
    return applyHeaderListStatus(item, WORKFLOW_STATE.APPROVED)
  }

  return item
}

/**
 * List rows may carry the viewer's completed step (Verified/Approved) even when the
 * invoice header has progressed to Approved, Rejected, or Sent to SAP.
 */
export function resolveFinanceListDisplayStatus<T extends InvoiceListStatusFields>(
  item: T,
  filterStatusCode?: number | null,
): T {
  const filterCode = filterStatusCode != null ? Number(filterStatusCode) : null
  const itemCode = normalizeStateCode(item.statusCode)

  if (itemCode === WORKFLOW_STATE.REJECTED || isRejectedStatusLabel(item.statusName)) {
    return applyGlobalRejectedListStatus(item)
  }

  if (filterCode === WORKFLOW_STATE.REJECTED) {
    return applyGlobalRejectedListStatus(item)
  }

  if (filterCode === WORKFLOW_STATE.APPROVED) {
    return applyHeaderListStatus(item, WORKFLOW_STATE.APPROVED)
  }

  return item
}

export function resolveFinanceListItemDisplay<T extends InvoiceListStatusFields>(
  item: T,
  filterStatusCode?: number | null,
): { statusCode: number; statusName: string } {
  const filterCode = filterStatusCode != null ? Number(filterStatusCode) : null
  const resolved = resolveFinanceListDisplayStatus(item, filterStatusCode)
  const code = normalizeStateCode(resolved.statusCode)

  if (filterCode === WORKFLOW_STATE.VERIFIED && shouldIncludeInVerificationVerifiedFilter(resolved)) {
    return {
      statusCode: WORKFLOW_STATE.VERIFIED,
      statusName: WORKFLOW_STATE_LABELS[WORKFLOW_STATE.VERIFIED],
    }
  }

  const label = WORKFLOW_STATE_LABELS[code]

  return {
    statusCode: code,
    statusName: label ?? (String(resolved.statusName ?? '').trim() || 'Unknown'),
  }
}

export async function enrichFinanceListItemsWithHeaderStatus<
  T extends InvoiceListStatusFields & { invoiceUId: string },
>(
  items: T[],
  filterStatusCode: number | null | undefined,
  resolveDetailContext: (
    invoiceUId: string,
  ) => Promise<FinanceListDetailContext | null | undefined>,
  options?: {
    priorityStart?: number
    priorityCount?: number
    onProgress?: (items: T[]) => void
  },
): Promise<T[]> {
  const withFilter = items.map((item) =>
    resolveFinanceListDisplayStatus(item, filterStatusCode),
  )

  if (withFilter.length === 0) return withFilter

  const working = withFilter.map((item) => ({ ...item }))
  const detailContexts = new Map<number, FinanceListDetailContext>()
  const isVerifiedFilter = isVerificationVerifiedFilterActive(filterStatusCode)
  const priorityStart = Math.max(0, options?.priorityStart ?? 0)
  const priorityCount = Math.max(1, options?.priorityCount ?? 10)
  const priorityEnd = priorityStart + priorityCount

  const applyVerifiedListFilter = (rows: T[]) => {
    if (!isVerifiedFilter) return rows
    return rows.filter((item) => shouldIncludeInVerificationVerifiedFilter(item))
  }

  const enrichIndex = async (index: number) => {
    const item = working[index]
    if (normalizeStateCode(item.statusCode) === WORKFLOW_STATE.REJECTED) return
    if (!shouldEnrichFinanceListItem(item, filterStatusCode)) return

    const invoiceUId = String(item.invoiceUId ?? '').trim()
    if (!invoiceUId) return

    try {
      const context = await resolveDetailContext(invoiceUId)
      if (!context) return
      detailContexts.set(index, context)
      working[index] = resolveFinanceListItemFromDetailContext(item, context)
    } catch {
      // Keep row status when detail lookup fails.
    }
  }

  const runPool = async (indices: number[]) => {
    if (!indices.length) return

    const queue = [...indices]
    const workers = Array.from(
      { length: Math.min(FINANCE_LIST_ENRICH_CONCURRENCY, queue.length) },
      async () => {
        while (queue.length) {
          const index = queue.shift()
          if (index == null) return
          await enrichIndex(index)
        }
      },
    )

    await Promise.all(workers)
  }

  const priorityIndices = working
    .map((_, index) => index)
    .filter((index) => index >= priorityStart && index < priorityEnd)
  const restIndices = working
    .map((_, index) => index)
    .filter((index) => index < priorityStart || index >= priorityEnd)

  options?.onProgress?.(applyVerifiedListFilter([...working]))
  await runPool(priorityIndices)
  options?.onProgress?.(applyVerifiedListFilter([...working]))
  await runPool(restIndices)
  options?.onProgress?.(applyVerifiedListFilter([...working]))

  if (isVerifiedFilter) {
    return working.filter((item, index) =>
      shouldIncludeInVerificationVerifiedFilter(item, detailContexts.get(index)),
    )
  }

  return working
}

/** @deprecated Use enrichFinanceListItemsWithHeaderStatus */
export const enrichFinanceListItemsWithGlobalRejection = enrichFinanceListItemsWithHeaderStatus

/** Prefer workflow stateCode when API stateName is stale. */
export function resolveWorkflowStepDisplayStatus(step: InvoiceWorkflowStep): {
  stateCode: number
  stateName: string
} {
  const stateCode = normalizeStateCode(step.stateCode)
  const label = WORKFLOW_STATE_LABELS[stateCode]

  if (label) {
    return { stateCode, stateName: label }
  }

  return {
    stateCode,
    stateName: step.stateName?.trim() || 'Unknown',
  }
}

export function getUserWorkflowStep(
  workflow: InvoiceWorkflowStep[] | undefined,
  profileId: number | undefined,
): InvoiceWorkflowStep | undefined {
  if (!workflow?.length || profileId == null) return undefined
  return workflow.find((item) => Number(item.profileId) === Number(profileId))
}

export function isVerifyStep(step?: InvoiceWorkflowStep): boolean {
  return step?.stateCode === WORKFLOW_STATE.WAITING_VERIFY
}

export function isApproveStep(step?: InvoiceWorkflowStep): boolean {
  return step?.stateCode === WORKFLOW_STATE.WAITING_APPROVAL
}

export function isUserActionPending(step?: InvoiceWorkflowStep): boolean {
  return isVerifyStep(step) || isApproveStep(step)
}

const PENDING_STATE_CODES = new Set<number>([
  0,
  WORKFLOW_STATE.WAITING_VERIFY,
  WORKFLOW_STATE.WAITING_APPROVAL,
  WORKFLOW_STATE.IDLE,
])

const resolveProfileId = (profileId?: number | string | null): number => {
  const parsed = Number(profileId)
  return Number.isFinite(parsed) ? parsed : 0
}

const hasActionerIdentity = (step: InvoiceWorkflowStep): boolean => {
  const name = String(step.actionerName ?? '').trim()
  if (name && name !== '-') return true
  return Number(step.actioner) > 0
}

const hasValidActionerDate = (date?: string | null): boolean => {
  return Boolean(date && date !== '1900-01-01T00:00:00')
}

const isPendingStateName = (stateName?: string | null): boolean => {
  const name = normalizeProfileName(stateName)
  return name.includes('pending') || name.includes('waiting')
}

const isFinanceApOfficerStep = (step: InvoiceWorkflowStep): boolean => {
  if (resolveProfileId(step.profileId) === FINANCE_AP_OFFICER_PROFILE_ID) return true
  return normalizeProfileName(step.profileName).includes('finance ap officer')
}

const isAccountingTaxStep = (step: InvoiceWorkflowStep): boolean => {
  if (resolveProfileId(step.profileId) === ACCOUNTING_TAX_PROFILE_ID) return true
  const profileName = normalizeProfileName(step.profileName)
  return profileName.includes('accounting & tax') || profileName.includes('accounting and tax')
}

const isFinanceApSupervisorStep = (step: InvoiceWorkflowStep): boolean => {
  if (resolveProfileId(step.profileId) === FINANCE_AP_SUPERVISOR_PROFILE_ID) return true
  return normalizeProfileName(step.profileName).includes('finance ap supervisor')
}

const isFinanceApproverStep = (step: InvoiceWorkflowStep): boolean => {
  return isAccountingTaxStep(step) || isFinanceApSupervisorStep(step)
}

const hasApproverCompletedAction = (stateCode: number): boolean => {
  return stateCode === WORKFLOW_STATE.APPROVED || stateCode === WORKFLOW_STATE.REJECTED
}

export function hasWorkflowBeenExecuted(step?: InvoiceWorkflowStep): boolean {
  if (!step) return false

  const stateCode = normalizeStateCode(step.stateCode)

  if (stateCode === WORKFLOW_STATE.REJECTED) {
    if (!hasActionerIdentity(step)) return false
    if (!hasValidActionerDate(step.actionerDate)) return false
    return true
  }

  if (PENDING_STATE_CODES.has(stateCode)) return false

  const isFinanceStep = isFinanceApOfficerStep(step) || isFinanceApproverStep(step)
  if (isFinanceStep && isPendingStateName(step.stateName)) return false

  if (!hasActionerIdentity(step)) return false
  if (!hasValidActionerDate(step.actionerDate)) return false

  if (isFinanceApOfficerStep(step)) {
    return stateCode >= WORKFLOW_STATE.VERIFIED
  }

  if (isAccountingTaxStep(step) || isFinanceApSupervisorStep(step)) {
    return hasApproverCompletedAction(stateCode)
  }

  return stateCode >= WORKFLOW_STATE.VERIFIED
}

/** Verification date is shown only after the workflow step has been actioned. */
export function formatWorkflowVerificationDate(step?: InvoiceWorkflowStep): string {
  if (!hasWorkflowBeenExecuted(step)) return '-'
  return formatDateYearFirst(step?.actionerDate ?? '')
}

/** Same rules as formatWorkflowVerificationDate, with time included (WIB). */
export function formatWorkflowVerificationDateTime(step?: InvoiceWorkflowStep): string {
  if (!hasWorkflowBeenExecuted(step)) return '-'
  return formatDateTimeYearFirst(step?.actionerDate ?? '')
}

/** Approval detail modal — identical workflow execution rules as verification date. */
export const formatWorkflowApprovalDateTime = formatWorkflowVerificationDateTime

export function getActionButtonLabel(step?: InvoiceWorkflowStep): string {
  if (isVerifyStep(step)) return 'Verify'
  if (isApproveStep(step)) return 'Approve'
  return step?.stateName || 'Submit'
}

export function shouldUsePutApproval(step?: InvoiceWorkflowStep): boolean {
  return isVerifyStep(step)
}

export function shouldUsePostApproval(step?: InvoiceWorkflowStep): boolean {
  return isApproveStep(step)
}

export function isApiSuccess(response?: {
  statusCode?: number
  result?: { isError?: boolean }
}): boolean {
  return !!response && response.statusCode === 200 && response.result?.isError !== true
}
