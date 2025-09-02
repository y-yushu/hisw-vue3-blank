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
    sidebarRouters: [] // 侧边栏路由
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
      const route1: AppRouteRecordRaw[] = [{ path: '/index', component: Layout, meta: { title: '首页', icon: 'dashboard', affix: true } }]
      const route2 = routes.filter(e => e.hidden === false)
      this.sidebarRouters = route1.concat(route2)
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
      rewriteRoutes.forEach(r => {
        router.addRoute(r as RouteRecordRaw)
      })
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
function filterAsyncRouter(asyncRouterMap: AppRouteRecordRaw[], type = false, isChild = false) {
  return asyncRouterMap.map(route => {
    // 创建路由对象的副本，避免修改原对象
    const newRoute = { ...route }

    // 外链特殊处理（http/https 开头）
    if (/^https?:\/\//.test(newRoute.path)) {
      newRoute.meta = newRoute.meta || {}
      newRoute.meta.link = newRoute.path // 存真实外链
      newRoute.component = InnerLink
      newRoute.path = `/inner/${encodeURIComponent(newRoute.path)}`
    } else if (newRoute.component) {
      // Layout BlankLayout InnerLink 组件特殊处理
      if (newRoute.component === 'Layout') {
        newRoute.component = Layout
      } else if (newRoute.component === 'ParentView') {
        newRoute.component = BlankLayout
      } else if (newRoute.component === 'InnerLink') {
        newRoute.component = InnerLink
      } else {
        // 对于路由注册，需要将组件字符串转换为动态导入函数
        newRoute.component = loadView(newRoute.component as string)
      }

      // 只有根路由需要确保 path 以 "/" 开头，子路由保持相对路径
      if (!isChild && newRoute.path && !newRoute.path.startsWith('/')) {
        newRoute.path = '/' + newRoute.path
      }
    }

    // 递归处理子路由
    if (newRoute.children && newRoute.children.length) {
      newRoute.children = filterAsyncRouter(newRoute.children, type, true)
    } else {
      // 如果没有子路由，删除 children 和 redirect 字段
      delete newRoute.children
      delete newRoute.redirect
    }

    return newRoute
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
  // 使用 Vite 的 glob import 功能来处理动态导入
  const modules = import.meta.glob('/src/views/**/*.vue')
  const componentPath = `/src/views/${view}.vue`

  if (modules[componentPath]) {
    return modules[componentPath]
  } else {
    // 返回一个默认的 404 组件或者空组件
    return () => import('@/views/error/404.vue')
  }
}
