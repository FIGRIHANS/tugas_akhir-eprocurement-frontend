import type { MiddlewareContext } from 'vue-middleware'

/**
 * Guest middleware
 * @param { app, router, from, to, redirect, abort, guard }: MiddlewareContext
 */
export default (context: MiddlewareContext) => {
  console.log('__GUEST_MIDDLEWARE__', context)
}
