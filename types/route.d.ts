import type { RouteRecordRaw } from 'vue-router'

declare global {
  interface AppRouteMeta {
    title?: string
    icon?: string
    affix?: boolean
    noCache?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    roles?: string[]
    permissions?: string[]
  }

  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    meta?: AppRouteMeta
    children?: AppRouteRecordRaw[]
    hidden?: boolean
    alwaysShow?: boolean
    permissions?: string[]
  }
}
