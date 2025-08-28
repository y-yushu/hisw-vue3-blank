<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import Logo from './logo.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'

// 侧边栏控制
const appStore = useAppStore()
// 路由权限
const permissionStore = usePermissionStore()
// 面包屑功能
const { handleMenuClick, initBreadcrumb } = useBreadcrumb()

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

// 初始化面包屑
onMounted(() => {
  initBreadcrumb()
})

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
      class="custom-menu"
      :collapsed="appStore.opened"
      :indent="16"
      :collapsed-width="64"
      :collapsed-icon-size="24"
      :options="backendMenus"
      accordion
      @update:value="handleUpdateValue"
    />
  </n-scrollbar>
</template>

<style lang="scss" scoped>
.custom-menu {
  :deep(.n-menu-item-content) {
    padding: auto !important;
  }
}
</style>
