import { defineStore } from 'pinia'
import { pinia } from './index'

// 定义状态的类型
interface ThemeState {
  layout: string
  mode: string
  asideColor: string
  opened: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    layout: 'left',
    mode: 'dark',
    asideColor: '#ffffff',
    opened: false
  }),
  getters: {},
  actions: {}
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export const useThemeStoreOutside = () => {
  return useThemeStore(pinia)
}
