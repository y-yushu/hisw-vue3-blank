import { defineStore } from 'pinia'
import { pinia } from './index'
import { auth } from '@/utils/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index.vue'
import BlankLayout from '@/layout/blank.vue'
import InnerLink from '@/layout/iframe.vue'

// 定义状态的类型
interface PermissionState {}

export const usePermissionStore = defineStore('permission', {
  // 使用泛型为 state 提供类型
  state: (): PermissionState => ({}),
  getters: {},
  actions: {}
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export const usePermissionStoreOutside = () => {
  return usePermissionStore(pinia)
}
