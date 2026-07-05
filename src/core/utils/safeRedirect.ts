/**
 * Validates post-login redirect targets to prevent open-redirect vulnerabilities.
 * Only same-origin relative paths are allowed.
 */
export function resolveSafeRedirectPath(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  const value = raw.trim()
  if (!value.startsWith('/') || value.startsWith('//')) return null

  const lower = value.toLowerCase()
  if (lower.includes('://') || lower.startsWith('javascript:') || lower.startsWith('data:')) {
    return null
  }

  return value
}

export function resolvePostLoginRoute(redirectQuery: unknown): string {
  return resolveSafeRedirectPath(redirectQuery) ?? '/dashboard'
}
