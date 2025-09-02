import { defineStore } from 'pinia'
import config from '@/settings'
import { pinia } from './index'
import type { BreadcrumbItem } from '@/types/breadcrumb'

export type Theme = 'light' | 'dark' | 'auto'
// 定义状态的类型
interface AppState {
  opened: boolean
  breadcrumbs: BreadcrumbItem[]
  theme: Theme
  asideTheme: Theme // 侧边栏颜色
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    opened: false,
    breadcrumbs: [],
    theme: config.theme as Theme,
    asideTheme: config.asideTheme as Theme
  }),
  getters: {
    // 显示的具体的模式，auto则根据系统主题自动切换
    themeName(state): Theme {
      // prefersDarkScheme为true时，返回dark，否则返回light
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (state.theme === 'auto') {
        return prefersDarkScheme ? 'dark' : 'light'
      }
      return state.theme
    }
  },
  actions: {
    toggleOpened() {
      this.opened = !this.opened
    },
    setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
      this.breadcrumbs = breadcrumbs
    },
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.toggleAsideTheme(this.theme)
    },
    // 改变主题
    changeTheme(theme: Theme) {
      this.theme = theme
      this.toggleAsideTheme(this.theme)
    },
    // 切换侧边栏主题
    toggleAsideTheme(theme: Theme) {
      this.asideTheme = theme
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
