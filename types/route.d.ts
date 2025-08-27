import type { RouteRecordRaw } from 'vue-router'

declare global {
  interface AppRouteMeta {
    title?: string
    icon?: string
    noCache?: boolean
    link?: string
  }

  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    name?: string
    hidden?: boolean
    redirect?: string
    component?: Component | string
    alwaysShow?: boolean
    meta?: AppRouteMeta
    children?: AppRouteRecordRaw[]
  }
}
