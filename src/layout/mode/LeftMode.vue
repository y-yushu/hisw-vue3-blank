<script setup lang="ts">
import { useAppStore } from '@/store/app'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import NavigationBar from '@/layout/components/NavigationBar/index.vue'
import MenuToggle from '@/layout/components/MenuToggle/index.vue'
import Breadcrumb from '@/layout/components/Breadcrumb/index.vue'
import Refresh from '@/layout/components/Refresh/index.vue'
import LayFooter from '@/layout/components/lay-footer/index.vue'

const appStore = useAppStore()
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
      <n-layout-header class="flex flex-row justify-between px-4">
        <div class="flex h-16 shrink-0 items-center">
          <MenuToggle />
          <Refresh />
          <Breadcrumb />
        </div>
        <NavigationBar />
      </n-layout-header>

      <!-- main 内容 -->
      <n-layout-content class="flex-1">
        <n-scrollbar class="h-full">
          <AppMain />
        </n-scrollbar>
      </n-layout-content>

      <!-- footer -->
      <LayFooter />
    </n-layout>
  </n-layout>
</template>
