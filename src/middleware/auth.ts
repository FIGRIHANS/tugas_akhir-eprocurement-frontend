import type { MiddlewareContext } from 'vue-middleware'

/**
 * Guest middleware
 * @param { app, router, from, to, redirect, abort, guard }: MiddlewareContext
 */
export default (context: MiddlewareContext) => {
  let token = ''

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === 'token_dts') token = decodeURIComponent(value)
  }

  if (!token) {
    context.router.push({
      name: 'login'
    })
  }
}
