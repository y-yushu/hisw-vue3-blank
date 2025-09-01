import type { Router } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStoreOutside } from '@/store/user'
import { usePermissionStoreOutside } from '@/store/permission'

// 白名单
const whiteList = ['/login']

export const createDynamicRouteGuard = (router: Router) => {
  router.beforeEach(async (to, _from) => {
    if (getToken()) {
      // 已登录
      const title = to.meta.title || ''
      if (title) {
        // 修改页面标题
      }
      if (to.path === '/login') {
        return { path: '/' }
      } else {
        // 判断是否获取用户信息
        const userStore = useUserStoreOutside()
        const permissionStore = usePermissionStoreOutside()

        if (userStore.obtained && permissionStore.routes.length > 0) {
          return true
        } else {
          try {
            await userStore.getUserInfo()
            await permissionStore.generateRoutes()

            // 动态路由注册完成后，需要重新导航到目标路由
            return { ...to, replace: true }
          } catch (err) {
            console.error('动态路由守卫错误:', err)
            await userStore.toLogout()
            return { path: `/login?redirect=${to.fullPath}` }
          }
        }
      }
    } else {
      // 未登录
      if (whiteList.indexOf(to.path) !== -1) {
        return true // 免登录直接进入
      } else {
        // 否则全部重定向到登录页
        return { path: `/login?redirect=${to.fullPath}` }
      }
    }
  })
}
