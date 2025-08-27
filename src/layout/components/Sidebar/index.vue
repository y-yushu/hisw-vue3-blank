<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import Logo from './logo.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'

// 侧边栏控制
const appStore = useAppStore()
// 路由权限
const permissionStore = usePermissionStore()

// 工具函数：把 iconName 转换成 <svg-icon>
function renderSvgIcon(name: string) {
  return () => h(SvgIcon, { name, color: 'currentColor', size: '1em' })
}

// 用于处理点击事件
const keys: AppRouteRecordRaw[] = []
let key = 0

function routesToMenuOptions(routes: AppRouteRecordRaw[]): MenuOption[] {
  const menuOptions: MenuOption[] = []
  routes.forEach(item => {
    if (item.meta?.title) {
      keys[key] = item
      menuOptions.push({
        label: item.meta.title,
        key: key++,
        icon: renderSvgIcon(item.meta.icon || ''),
        children: item.children ? routesToMenuOptions(item.children) : undefined
      })
    }
  })
  return menuOptions
}

const backendMenus = routesToMenuOptions(permissionStore.sidebarRouters)

function handleUpdateValue(value: string) {
  const item = keys[Number(value)]
  console.log('🚀 ~ handleUpdateValue ~ item:', item)
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
    <n-button @click="appStore.toggleOpened">{{ appStore.opened ? '展开' : '收起' }}</n-button>
  </n-scrollbar>
</template>

<style lang="scss" scoped>
.custom-menu {
  :deep(.n-menu-item-content) {
    padding: auto !important;
  }
}
</style>
