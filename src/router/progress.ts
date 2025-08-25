import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function createProgressGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    NProgress?.start?.()
    next()
  })
  router.afterEach(_to => {
    NProgress?.done?.()
  })
}
