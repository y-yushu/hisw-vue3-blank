import { defineStore } from 'pinia'
import { pinia } from './index'

// 页签项接口
export interface TabItem {
  name: string // 路由名称，用作唯一标识
  title: string // 页签显示标题
  path: string // 路由路径
  icon?: string // 图标
  affix?: boolean // 是否固定（不可关闭）
  closable?: boolean // 是否可关闭
}

interface TabsState {
  tabsList: TabItem[]
  activeTab: string // 当前激活的页签name
}

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    tabsList: [],
    activeTab: ''
  }),

  getters: {
    // 获取当前激活的页签
    getCurrentTab: state => {
      return state.tabsList.find(tab => tab.name === state.activeTab)
    },

    // 获取可关闭的页签
    getClosableTabs: state => {
      return state.tabsList.filter(tab => tab.closable !== false && !tab.affix)
    }
  },

  actions: {
    // 添加页签
    addTab(tab: TabItem) {
      // 检查页签是否已存在
      const existingTab = this.tabsList.find(item => item.name === tab.name)

      if (!existingTab) {
        // 设置默认值
        const newTab: TabItem = {
          ...tab,
          closable: tab.closable !== false, // 默认可关闭
          affix: tab.affix || false // 默认不固定
        }
        this.tabsList.push(newTab)
      }

      // 设置为当前激活页签
      this.activeTab = tab.name
    },

    // 移除页签
    removeTab(name: string) {
      const tabIndex = this.tabsList.findIndex(tab => tab.name === name)
      if (tabIndex === -1) return

      const tab = this.tabsList[tabIndex]

      // 固定页签不能关闭
      if (tab.affix) return

      // 如果关闭的是当前激活页签，需要切换到其他页签
      if (this.activeTab === name) {
        if (this.tabsList.length > 1) {
          // 优先切换到左侧页签（前一个），如果没有则切换到右侧
          const nextTab = this.tabsList[tabIndex - 1] || this.tabsList[tabIndex + 1]
          this.activeTab = nextTab.name
        } else {
          this.activeTab = ''
        }
      }

      // 移除页签
      this.tabsList.splice(tabIndex, 1)
    },

    // 关闭其他页签
    closeOtherTabs(name: string) {
      this.tabsList = this.tabsList.filter(tab => tab.name === name || tab.affix)
      this.activeTab = name
    },

    // 关闭所有页签
    closeAllTabs() {
      // 只保留固定页签
      this.tabsList = this.tabsList.filter(tab => tab.affix)

      // 如果还有固定页签，激活第一个
      if (this.tabsList.length > 0) {
        this.activeTab = this.tabsList[0].name
      } else {
        this.activeTab = ''
      }
    },

    // 关闭左侧页签
    closeLeftTabs(name: string) {
      const targetIndex = this.tabsList.findIndex(tab => tab.name === name)
      if (targetIndex === -1) return

      // 保留目标页签及其右侧页签，以及所有固定页签
      this.tabsList = this.tabsList.filter((tab, index) => index >= targetIndex || tab.affix)
    },

    // 关闭右侧页签
    closeRightTabs(name: string) {
      const targetIndex = this.tabsList.findIndex(tab => tab.name === name)
      if (targetIndex === -1) return

      // 保留目标页签及其左侧页签，以及所有固定页签
      this.tabsList = this.tabsList.filter((tab, index) => index <= targetIndex || tab.affix)
    },

    // 设置激活页签
    setActiveTab(name: string) {
      if (this.tabsList.find(tab => tab.name === name)) {
        this.activeTab = name
      }
    },

    // 初始化默认页签（首页）
    initDefaultTab() {
      const homeTab: TabItem = {
        name: 'Home',
        title: '首页',
        path: '/index',
        icon: 'dashboard',
        affix: true, // 首页固定，不可关闭
        closable: false
      }

      this.addTab(homeTab)
    },

    // 根据路由信息添加页签
    addTabFromRoute(route: any) {
      // 生成唯一的页签名称
      let name = route.name || route.path.replace(/\//g, '_').replace(/^_/, '')
      if (!name) {
        name = 'tab_' + Date.now()
      }

      const tab: TabItem = {
        name,
        title: route.meta?.title || '未命名页面',
        path: route.path,
        icon: route.meta?.icon,
        affix: route.meta?.affix || false,
        closable: !route.meta?.affix
      }

      this.addTab(tab)
    }
  }
})

/**
 * @description 在 setup 外使用 store
 */
export const useTabsStoreOutside = () => {
  return useTabsStore(pinia)
}
