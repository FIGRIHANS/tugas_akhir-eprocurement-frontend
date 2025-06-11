import type { MiddlewareContext } from 'vue-middleware'
import { useCheckToken, useGetUsername } from '@/composables/token'
import { useLoginStore } from '@/stores/views/login'
import { isEmpty } from 'lodash'

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
  } else {
    const loginApi = useLoginStore()
    if (isEmpty(loginApi.userData)) {
      const getUsername = useGetUsername() || ''
      loginApi.callUser(getUsername)
    }
  }
}
