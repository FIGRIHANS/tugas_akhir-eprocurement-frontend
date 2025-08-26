import type { App } from 'vue'
import vueMiddleware from 'vue-middleware'

import auth from './auth'
import guest from './guest'
import loginAuth from './loginAuth'

export default {
  install: (app: App<Element>) => {
    // Cast vueMiddleware to any to avoid type incompatibility with the Plugin type
    app.use(vueMiddleware as any, {
      middleware: { auth, guest, loginAuth },
    })
  },
}
