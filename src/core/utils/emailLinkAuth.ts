import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken, useGetUsername } from '@/composables/token'
import { useLoginStore } from '@/stores/views/login'
import { isEmpty } from 'lodash'
import {
  clearEmailLoginIntent,
  getExpectedProfileId,
  getExpectedProfileIdFromRedirect,
  persistEmailLoginIntent,
  profileMatchesEmailIntent,
  resetAuthSession,
} from '@/core/utils/sessionAuth'
import { resolveSafeRedirectPath } from '@/core/utils/safeRedirect'

export async function enforceEmailProfileAccess(context: MiddlewareContext): Promise<boolean> {
  const query = context.to.query as Record<string, unknown>
  const expectedProfileId =
    getExpectedProfileId(query) ?? getExpectedProfileIdFromRedirect(context.to.fullPath)

  if (expectedProfileId === null) return true

  persistEmailLoginIntent({ expectedProfileId })

  const loginApi = useLoginStore()
  if (isEmpty(loginApi.userData)) {
    const username = useGetUsername()
    if (username) {
      await loginApi.callUser(username)
    }
  }

  const actualProfileId = loginApi.userData?.profile?.profileId
  if (!profileMatchesEmailIntent(actualProfileId)) {
    const safeRedirect = resolveSafeRedirectPath(context.to.fullPath)
    resetAuthSession()
    context.router.push({
      name: 'login',
      query: {
        from: 'email',
        expectedProfileId: String(expectedProfileId),
        redirect: safeRedirect && safeRedirect !== '/login' ? safeRedirect : undefined,
      },
    })
    return false
  }

  clearEmailLoginIntent()
  return true
}

export function handleEmailLoginEntry(context: MiddlewareContext) {
  resetAuthSession()
  persistEmailLoginIntent(context.to.query as Record<string, unknown>)
}

export function hasActiveSession(): boolean {
  return !!useCheckToken()
}
