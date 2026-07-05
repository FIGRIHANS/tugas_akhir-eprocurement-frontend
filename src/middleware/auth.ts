import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken, useGetUsername } from '@/composables/token'
import { useLoginStore } from '@/stores/views/login'
import { isEmpty } from 'lodash'
import { resolveSafeRedirectPath } from '@/core/utils/safeRedirect'
import { enforceEmailProfileAccess } from '@/core/utils/emailLinkAuth'

/**
 * Auth middleware — requires valid session. Preserves intended destination for post-login redirect.
 */
export default async (context: MiddlewareContext) => {
  const token = useCheckToken()
  if (!token) {
    const intendedPath = context.to.fullPath
    const safeRedirect = resolveSafeRedirectPath(intendedPath)
    context.router.push({
      name: 'login',
      query: safeRedirect && safeRedirect !== '/login' ? { redirect: safeRedirect } : undefined,
    })
    return
  }

  const loginApi = useLoginStore()
  if (isEmpty(loginApi.userData)) {
    const getUsername = useGetUsername() || ''
    await loginApi.callUser(getUsername)
  }

  await enforceEmailProfileAccess(context)
}
