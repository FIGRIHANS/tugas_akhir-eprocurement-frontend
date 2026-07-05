import { useLoginStore } from '@/stores/views/login'

export const EMAIL_EXPECTED_PROFILE_KEY = 'email_expected_profile_id'

export function clearSessionCookie() {
  document.cookie =
    'session_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict'
}

export function persistEmailLoginIntent(query: Record<string, unknown>) {
  const expectedProfileId = query.expectedProfileId
  if (expectedProfileId !== undefined && expectedProfileId !== null && String(expectedProfileId) !== '') {
    sessionStorage.setItem(EMAIL_EXPECTED_PROFILE_KEY, String(expectedProfileId))
  }
}

export function getExpectedProfileIdFromRedirect(redirect?: unknown): number | null {
  if (redirect === undefined || redirect === null) return null

  const redirectPath = String(redirect)
  const queryIndex = redirectPath.indexOf('?')
  if (queryIndex === -1) return null

  const params = new URLSearchParams(redirectPath.slice(queryIndex + 1))
  const expected = params.get('expectedProfileId')
  if (!expected) return null

  const parsed = Number(expected)
  return Number.isNaN(parsed) ? null : parsed
}

export function getExpectedProfileId(query?: Record<string, unknown>): number | null {
  const fromQuery = query?.expectedProfileId
  if (fromQuery !== undefined && fromQuery !== null && String(fromQuery) !== '') {
    return Number(fromQuery)
  }

  const stored = sessionStorage.getItem(EMAIL_EXPECTED_PROFILE_KEY)
  if (!stored) return null

  const parsed = Number(stored)
  return Number.isNaN(parsed) ? null : parsed
}

export function clearEmailLoginIntent() {
  sessionStorage.removeItem(EMAIL_EXPECTED_PROFILE_KEY)
}

export function profileMatchesEmailIntent(actualProfileId?: number | null): boolean {
  const expected = getExpectedProfileId()
  if (expected === null) return true
  if (actualProfileId == null || Number.isNaN(Number(actualProfileId))) return false
  return Number(actualProfileId) === expected
}

export function resetAuthSession() {
  clearSessionCookie()
  clearEmailLoginIntent()
  const loginApi = useLoginStore()
  loginApi.clearUserData()
}
