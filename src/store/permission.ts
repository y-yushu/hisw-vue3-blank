import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { pinia } from './index'
import { auth } from '@/utils/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index.vue'
import BlankLayout from '@/layout/blank.vue'
import InnerLink from '@/layout/iframe.vue'

// -------------------------
// 类型定义
// -------------------------
interface PermissionState {
  routes: AppRouteRecordRaw[]
  addRoutes: AppRouteRecordRaw[]
  defaultRoutes: AppRouteRecordRaw[]
  topbarRouters: AppRouteRecordRaw[]
  sidebarRouters: AppRouteRecordRaw[]
}

// -------------------------
// pinia store
// -------------------------
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [], // 所有路由
    addRoutes: [], // 动态路由
    defaultRoutes: [], // 默认路由
    topbarRouters: [], // 顶部检索路由
    sidebarRouters: [] // 右侧侧边栏路由
  }),

  actions: {
    // 设置路由
    setRoutes(routes: AppRouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes: AppRouteRecordRaw[]) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes: AppRouteRecordRaw[]) {
      this.topbarRouters = routes.filter(e => e.hidden === false)
    },
    setSidebarRouters(routes: AppRouteRecordRaw[]) {
      this.sidebarRouters = routes.filter(e => e.hidden === false)
      console.log('🚀 ~ setSidebarRouters ~ this.sidebarRouters:', this.sidebarRouters)
    },

    // -------------------------
    // 生成路由（从后端获取）
    // -------------------------
    async generateRoutes() {
      const res = await getRouters()
      const sdata = JSON.parse(JSON.stringify(res.data))
      const rdata = JSON.parse(JSON.stringify(res.data))

      const sidebarRoutes = filterAsyncRouter(sdata)
      const rewriteRoutes = filterAsyncRouter(rdata, true)

      const asyncRoutes = filterDynamicRoutes(dynamicRoutes)

      // 404 页面必须放最后
      rewriteRoutes.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })

      // vue3 用 addRoute
      asyncRoutes.forEach(r => router.addRoute(r))
      rewriteRoutes.forEach(r => router.addRoute(r as RouteRecordRaw))

      this.setRoutes(rewriteRoutes)
      this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
      this.setDefaultRoutes(sidebarRoutes)
      this.setTopbarRoutes(sidebarRoutes)

      return rewriteRoutes
    }
  }
})

/**
 * @description setup 外使用 store（如在 router.beforeEach 里）
 */
export const usePermissionStoreOutside = () => {
  return usePermissionStore(pinia)
}

// -------------------------
// 工具方法（和 vue2 基本一致，增加外链处理）
// -------------------------

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: AppRouteRecordRaw[], type = false) {
  return asyncRouterMap.filter(route => {
    // 外链特殊处理（http/https 开头）
    if (/^https?:\/\//.test(route.path)) {
      route.meta = route.meta || {}
      route.meta.link = route.path // 存真实外链
      route.component = InnerLink
      route.path = `/inner/${encodeURIComponent(route.path)}`
    } else if (route.component) {
      // Layout BlankLayout InnerLink 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = BlankLayout
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component as string)
      }

      // 确保 path 以 "/" 开头
      if (route.path && !route.path.startsWith('/')) {
        route.path = '/' + route.path
      }
    }

    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, type)
    } else {
      delete route.children
      delete route.redirect
    }
    return true
  })
}

// 动态路由权限验证
export function filterDynamicRoutes(routes: any[]) {
  const res: any[] = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

// 动态加载 views 下的组件
export const loadView = (view: string) => {
  return () => import(`@/views/${view}.vue`)
}
