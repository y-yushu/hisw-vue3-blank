import { defineStore } from 'pinia'
import { pinia } from './index'
import type { BreadcrumbItem } from '@/types/breadcrumb'

// 定义状态的类型
interface AppState {
  opened: boolean
  breadcrumbs: BreadcrumbItem[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({ 
    opened: false,
    breadcrumbs: []
  }),
  getters: {},
  actions: {
    toggleOpened() {
      this.opened = !this.opened
    },
    setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
      this.breadcrumbs = breadcrumbs
    }
  }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export const useAppStoreOutside = () => {
  return useAppStore(pinia)
}
