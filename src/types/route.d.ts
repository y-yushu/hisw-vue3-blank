declare module '@/types/route' {
  import type { RouteRecordRaw } from 'vue-router'

  export interface AppRouteMeta {
    title?: string
    icon?: string
    affix?: boolean
    noCache?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    roles?: string[]
    permissions?: string[]
  }

  export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    meta?: AppRouteMeta
    children?: AppRouteRecordRaw[]
    hidden?: boolean
    alwaysShow?: boolean
    permissions?: string[]
  }
}
