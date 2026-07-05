import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken } from '@/composables/token'
import { resolvePostLoginRoute } from '@/core/utils/safeRedirect'

/** Login page middleware — redirect authenticated users away from login. */
export default (context: MiddlewareContext) => {
  const token = useCheckToken()

  if (token) {
    context.router.replace(resolvePostLoginRoute(context.to.query.redirect))
  }
}
