import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken } from '@/composables/token'

/**
 * Guest middleware
 * @param { app, router, from, to, redirect, abort, guard }: MiddlewareContext
 */
export default (context: MiddlewareContext) => {
  const token = useCheckToken()

  if (!token) {
    context.router.push({
      name: 'login'
    })
  }
}
