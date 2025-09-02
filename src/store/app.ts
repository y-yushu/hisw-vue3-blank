import { defineStore } from 'pinia'
import config from '@/settings'
import { pinia } from './index'
import type { BreadcrumbItem } from '@/types/breadcrumb'
import cache from '@/utils/cache'

export type Theme = 'light' | 'dark' | 'auto'
export type ColorType = 'primary' | 'success' | 'info' | 'warning' | 'error'
// 定义状态的类型
interface AppState {
  opened: boolean
  breadcrumbs: BreadcrumbItem[]
  theme: Theme
  asideTheme: Theme // 侧边栏颜色
  currentMenuPath: string // 当前选中的菜单路径
  // 五个主题色
  primaryColor: string
  successColor: string
  infoColor: string
  warningColor: string
  errorColor: string
}

const themeData = cache.local.getJSON('theme-settings') as AppState
console.log('🚀 ~ themeData:', themeData)

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    opened: false,
    breadcrumbs: [],
    currentMenuPath: '',
    theme: (themeData?.theme || config.theme) as Theme,
    asideTheme: (themeData?.asideTheme || config.asideTheme) as Theme,
    primaryColor: themeData?.primaryColor || config.primaryColor,
    successColor: themeData?.successColor || config.successColor,
    infoColor: themeData?.infoColor || config.infoColor,
    warningColor: themeData?.warningColor || config.warningColor,
    errorColor: themeData?.errorColor || config.errorColor
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
      this.saveTheme()
    },
    // 改变主题
    changeTheme(theme: Theme) {
      this.theme = theme
      this.toggleAsideTheme(this.theme)
      this.saveTheme()
    },
    // 切换侧边栏主题
    toggleAsideTheme(theme: Theme) {
      this.asideTheme = theme
    },
    setCurrentMenuPath(path: string) {
      this.currentMenuPath = path
      this.saveTheme()
    },

    // 修改颜色
    setColor(colorType: ColorType, color: string) {
      switch (colorType) {
        case 'primary':
          this.primaryColor = color
          break
        case 'success':
          this.successColor = color
          break
        case 'info':
          this.infoColor = color
          break
        case 'warning':
          this.warningColor = color
          break
        case 'error':
          this.errorColor = color
          break
        default:
          break
      }
      this.saveTheme()
    },

    // 保存设置
    saveTheme() {
      cache.local.setJSON('theme-settings', {
        theme: this.theme,
        asideTheme: this.asideTheme,
        primaryColor: this.primaryColor,
        successColor: this.successColor,
        infoColor: this.infoColor,
        warningColor: this.warningColor,
        errorColor: this.errorColor
      })
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
