import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { useTabsStore } from '@/store/tabs'
import { useRouter, useRoute } from 'vue-router'
import type { BreadcrumbItem } from '@/types/breadcrumb'

export function useBreadcrumb() {
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()
  const tabsStore = useTabsStore()
  const router = useRouter()

  // 生成面包屑路径
  const generateBreadcrumbs = (route: AppRouteRecordRaw): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []

    // 递归查找路由的完整路径，支持嵌套路由
    const findRoutePath = (
      routes: AppRouteRecordRaw[],
      targetPath: string,
      currentPath: AppRouteRecordRaw[] = [],
      parentPath = ''
    ): AppRouteRecordRaw[] | null => {
      for (const r of routes) {
        // 构建当前路由的完整路径
        const fullPath = parentPath + (r.path.startsWith('/') ? r.path : '/' + r.path)
        const newPath = [...currentPath, { ...r, path: fullPath }]

        // 检查是否匹配目标路径
        if (fullPath === targetPath) {
          return newPath
        }

        // 递归查找子路由
        if (r.children) {
          const found = findRoutePath(r.children, targetPath, newPath, fullPath)
          if (found) return found
        }
      }
      return null
    }

    // 查找当前路由的完整路径
    const routePath = findRoutePath(permissionStore.sidebarRouters, route.path)

    if (routePath) {
      // 将路径转换为面包屑
      breadcrumbs.push(
        ...routePath
          .map(r => ({
            title: r.meta?.title || '',
            path: r.path
          }))
          .filter(item => item.title)
      ) // 过滤掉没有标题的项
    } else {
      // 如果没找到路径，至少添加当前路由
      if (route.meta?.title) {
        breadcrumbs.push({
          title: route.meta.title,
          path: route.path
        })
      }
    }

    return breadcrumbs
  }

  // 处理菜单点击，更新面包屑、添加页签并跳转路由
  const handleMenuClick = (route: AppRouteRecordRaw) => {
    if (route && route.path) {
      // 生成面包屑
      const breadcrumbs = generateBreadcrumbs(route)
      appStore.setBreadcrumbs(breadcrumbs)

      // 只有非首页才添加页签（首页已经在初始化时添加了）
      if (route.path !== '/index' && route.path !== '/') {
        tabsStore.addTabFromRoute(route)
      }

      // 跳转到对应路由
      console.log(route.path)
      router.push(route.path)
    }
  }

  // 初始化面包屑
  const initBreadcrumb = () => {
    // 获取当前路由
    const currentRoute = useRoute()
    // 生成面包屑
    const breadcrumbs = generateBreadcrumbs(currentRoute as AppRouteRecordRaw)
    // 设置面包屑
    appStore.setBreadcrumbs(breadcrumbs)
  }

  // 根据路径更新面包屑
  const updateBreadcrumbByPath = (path: string) => {
    // 根据路径查找对应的路由配置
    const findRouteByPath = (routes: AppRouteRecordRaw[], targetPath: string, parentPath = ''): AppRouteRecordRaw | null => {
      for (const route of routes) {
        const fullPath = parentPath + (route.path.startsWith('/') ? route.path : '/' + route.path)

        if (fullPath === targetPath) {
          return { ...route, path: fullPath }
        }

        if (route.children) {
          const found = findRouteByPath(route.children, targetPath, fullPath)
          if (found) return found
        }
      }
      return null
    }

    const routeConfig = findRouteByPath(permissionStore.sidebarRouters, path)
    if (routeConfig) {
      const breadcrumbs = generateBreadcrumbs(routeConfig)
      appStore.setBreadcrumbs(breadcrumbs)
    }
  }

  return {
    generateBreadcrumbs,
    handleMenuClick,
    initBreadcrumb,
    updateBreadcrumbByPath
  }
}
