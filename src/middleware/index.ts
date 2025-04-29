import type { App } from 'vue'
import vueMiddleware from 'vue-middleware'

import auth from './auth'
import guest from './guest'
import loginAuth from './loginAuth'

export default {
  install: (app: App<Element>) => {
    app.use(vueMiddleware, {
      middleware: { auth, guest, loginAuth },
    })
  },
}
