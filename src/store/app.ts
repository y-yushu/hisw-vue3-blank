import { defineStore } from 'pinia'
import config from '@/settings'
import { pinia } from './index'
import type { BreadcrumbItem } from '@/types/breadcrumb'

type Theme = 'light' | 'dark' | 'auto'
// 定义状态的类型
interface AppState {
  opened: boolean
  breadcrumbs: BreadcrumbItem[]
  theme: Theme
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    opened: false,
    breadcrumbs: [],
    theme: config.theme as Theme
  }),

  getters: {},
  actions: {
    toggleOpened() {
      this.opened = !this.opened
    },
    setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
      this.breadcrumbs = breadcrumbs
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      console.log('🚀 ~ toggleTheme ~ this.theme:', this.theme)
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
