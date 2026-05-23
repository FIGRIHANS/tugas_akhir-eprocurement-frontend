export interface InvoiceWorkflowStep {
  profileId: number
  stateCode: number
  stateName: string
  step?: number
}

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
