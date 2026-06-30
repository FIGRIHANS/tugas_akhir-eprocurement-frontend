import { formatDateYearFirst, formatDateTimeYearFirst } from '@/composables/date-format'

export interface InvoiceWorkflowStep {
  profileId: number
  stateCode: number
  stateName: string
  profileName?: string
  step?: number
  actioner?: number
  actionerDate?: string
  actionerName?: string
}

export const FINANCE_AP_OFFICER_PROFILE_ID = 3002
export const ACCOUNTING_TAX_PROFILE_ID = 3003
export const FINANCE_AP_SUPERVISOR_PROFILE_ID = 3004
export const FINANCE_APPROVER_PROFILE_IDS = [3003, 3004] as const

export const WORKFLOW_STATE = {
  WAITING_VERIFY: 1,
  WAITING_APPROVAL: 2,
  VERIFIED: 3,
  APPROVED: 4,
  REJECTED: 5,
  IDLE: 99,
} as const

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

const normalizeStateCode = (stateCode?: number | string | null): number => {
  const parsed = Number(stateCode)
  return Number.isFinite(parsed) ? parsed : -1
}

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

const normalizeProfileName = (value?: string | null): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
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
