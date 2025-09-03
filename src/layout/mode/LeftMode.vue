<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useTabsStore } from '@/store/tabs'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import NavigationBar from '@/layout/components/NavigationBar/index.vue'
import MenuToggle from '@/layout/components/MenuToggle/index.vue'
import Breadcrumb from '@/layout/components/Breadcrumb/index.vue'
import Refresh from '@/layout/components/Refresh/index.vue'
import LayFooter from '@/layout/components/lay-footer/index.vue'
import TagNavigation from '@/layout/components/TagNavigation/index.vue'

defineOptions({
  name: 'LeftMode'
})

const appStore = useAppStore()
const tabsStore = useTabsStore()
const route = useRoute()

onMounted(() => {
  // 初始化默认首页页签
  tabsStore.initDefaultTab()

  // 如果当前路由不是首页，也添加到页签中
  if (route.path !== '/index' && route.path !== '/' && route.meta?.title) {
    tabsStore.addTabFromRoute(route)
  }
})
</script>

<template>
  <n-layout class="h-screen" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider class="cu-custon-sider" bordered collapse-mode="width" :collapsed="appStore.opened" :collapsed-width="64" :width="200">
      <Sidebar />
    </n-layout-sider>

    <!-- 主体部分 -->
    <n-layout class="h-screen" content-class="flex flex-col">
      <!-- header -->
      <n-layout-header bordered class="px-4 shadow-sm">
        <div class="flex flex-row justify-between">
          <div class="flex h-12 shrink-0 items-center">
            <MenuToggle />
            <Refresh />
            <Breadcrumb />
          </div>
          <NavigationBar />
        </div>
        <div class="flex h-8 items-center py-2">
          <TagNavigation />
        </div>
      </n-layout-header>
      <!-- main 内容 -->
      <n-layout-content class="flex-1">
        <AppMain />
      </n-layout-content>

      <!-- footer -->
      <LayFooter />
    </n-layout>
  </n-layout>
</template>
