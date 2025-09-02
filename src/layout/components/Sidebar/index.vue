<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import Logo from './logo.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { useRoute } from 'vue-router'

// 侧边栏控制
const appStore = useAppStore()
// 路由权限
const permissionStore = usePermissionStore()
// 面包屑功能
const { handleMenuClick, initBreadcrumb } = useBreadcrumb()
// 路由相关
const route = useRoute()
const defaultExpandedKeys = ref<number[]>([])
const defaultValue = ref()

// 工具函数：把 iconName 转换成 <svg-icon>
function renderSvgIcon(name: string) {
  return () => h(SvgIcon, { name, color: 'currentColor', size: '1em' })
}

// 用于处理点击事件
const keys: AppRouteRecordRaw[] = []
let key = 0

function routesToMenuOptions(routes: AppRouteRecordRaw[], parentPath = ''): MenuOption[] {
  const menuOptions: MenuOption[] = []
  routes.forEach(item => {
    if (item.meta?.title) {
      // 构建完整路径
      const fullPath = parentPath + (item.path.startsWith('/') ? item.path : '/' + item.path)

      // 创建包含完整路径的路由对象
      const routeWithFullPath = {
        ...item,
        path: fullPath
      }

      keys[key] = routeWithFullPath
      menuOptions.push({
        label: item.meta.title,
        key: key++,
        icon: renderSvgIcon(item.meta.icon || ''),
        children: item.children ? routesToMenuOptions(item.children, fullPath) : undefined
      })
    }
  })
  return menuOptions
}

const backendMenus = routesToMenuOptions(permissionStore.sidebarRouters)

// 根据当前路由地址获取默认展开的菜单键和选中的菜单项
function getMenuStateByRoute() {
  const currentPath = route.path
  let selectedKey = ''
  const expandedKeys: string[] = []

  // 递归查找菜单项
  function findMenuByPath(menuItems: MenuOption[], parentKeys: string[] = []): boolean {
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i]
      const currentKey = String(menuItem.key)
      const routeItem = keys[Number(currentKey)]

      if (routeItem && routeItem.path === currentPath) {
        selectedKey = currentKey
        // 将所有父级菜单键和当前选中的键都加入expandedKeys
        expandedKeys.push(...parentKeys)
        // 如果当前项有子菜单，也将其加入展开键
        if (menuItem.children && menuItem.children.length > 0) {
          expandedKeys.push(currentKey)
        }
        return true
      }

      if (menuItem.children && menuItem.children.length > 0) {
        const newParentKeys = [...parentKeys, currentKey]
        if (findMenuByPath(menuItem.children, newParentKeys)) {
          return true
        }
      }
    }
    return false
  }

  findMenuByPath(backendMenus)

  return {
    selectedKey,
    expandedKeys: [...new Set(expandedKeys)] // 去重
  }
}

// 初始化面包屑
onMounted(() => {
  initBreadcrumb()
  initMenuState()
})

function initMenuState() {
  const menuState = getMenuStateByRoute()
  defaultValue.value = Number(menuState.selectedKey)
  let expandedKeys = menuState.expandedKeys.map(Number)
  defaultExpandedKeys.value = [...expandedKeys, Number(menuState.selectedKey)]
}

function handleUpdateValue(value: string) {
  const item = keys[Number(value)]
  if (item) {
    handleMenuClick(item)
  }
}
</script>

<template>
  <n-scrollbar class="h-full">
    <Logo />
    <n-menu
      class="cu-custon-menu"
      :collapsed="appStore.opened"
      :indent="16"
      :collapsed-width="64"
      :collapsed-icon-size="24"
      :options="backendMenus"
      :default-value="defaultValue"
      :default-expanded-keys="defaultExpandedKeys"
      :watch-props="['defaultValue', 'defaultExpandedKeys']"
      @update:value="handleUpdateValue"
    />
  </n-scrollbar>
</template>
