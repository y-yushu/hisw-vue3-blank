<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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
const expandedKeys = ref([])
const selectedKey = ref<number | null>(null)

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
console.log('🚀 ~ permissionStore.sidebarRouters:', permissionStore.sidebarRouters)
console.log('🚀 ~ backendMenus:', backendMenus)

// 根据当前路由地址获取菜单状态
function updateMenuStateByRoute(currentPath?: string) {
  const targetPath = currentPath || route.path
  let foundSelectedKey: number | null = null
  const foundExpandedKeys: number[] = []

  // 递归查找菜单项
  function findMenuByPath(menuItems: MenuOption[], parentKeys: number[] = []): boolean {
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i]
      const currentKey = Number(menuItem.key)
      const routeItem = keys[currentKey]

      if (routeItem && routeItem.path === targetPath) {
        foundSelectedKey = currentKey
        // 将所有父级菜单键加入expandedKeys
        foundExpandedKeys.push(...parentKeys)
        // 如果当前项有子菜单，也将其加入展开键
        if (menuItem.children && menuItem.children.length > 0) {
          foundExpandedKeys.push(currentKey)
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

  // 更新响应式状态
  selectedKey.value = foundSelectedKey
  expandedKeys.value = [...new Set(foundExpandedKeys)] // 去重
}

// 监听路由变化，更新菜单状态
watch(
  () => route.path,
  (newPath) => {
    updateMenuStateByRoute(newPath)
    appStore.setCurrentMenuPath(newPath)
  },
  { immediate: true }
)

// 监听store中的菜单路径变化（用于页签点击同步）
watch(
  () => appStore.currentMenuPath,
  (newPath) => {
    if (newPath && newPath !== route.path) {
      updateMenuStateByRoute(newPath)
    }
  }
)

// 初始化
onMounted(() => {
  initBreadcrumb()
  updateMenuStateByRoute()
})

function handleUpdateValue(value: string) {
  const item = keys[Number(value)]
  if (item) {
    handleMenuClick(item)
  }
}

function handleUpdateExpandedKeys(keys: Array<string | number>) {
  expandedKeys.value = keys.map(key => Number(key))
}
</script>

<template>
  <n-scrollbar class="h-full">
    <Logo />
    <n-menu
      class="custom-menu"
      :collapsed="appStore.opened"
      :indent="16"
      :collapsed-width="64"
      :collapsed-icon-size="24"
      :options="backendMenus"
      :value="selectedKey"
      :expanded-keys="expandedKeys"
      @update:value="handleUpdateValue"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </n-scrollbar>
</template>
