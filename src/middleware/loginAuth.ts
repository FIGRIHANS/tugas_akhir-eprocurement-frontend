import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken } from '@/composables/token'
import { resolvePostLoginRoute } from '@/core/utils/safeRedirect'
import { handleEmailLoginEntry } from '@/core/utils/emailLinkAuth'

/** Login page middleware — redirect authenticated users away from login. */
export default (context: MiddlewareContext) => {
  if (context.to.query.from === 'email') {
    handleEmailLoginEntry(context)
    return
  }

  const token = useCheckToken()

  if (token) {
    context.router.replace(resolvePostLoginRoute(context.to.query.redirect))
  }
}
