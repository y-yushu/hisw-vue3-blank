<script setup lang="ts">
import { useAppStore } from '@/store/app'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import NavigationBar from '@/layout/components/NavigationBar/index.vue'
import MenuToggle from '@/layout/components/MenuToggle/index.vue'
import Breadcrumb from '@/layout/components/Breadcrumb/index.vue'
import Refresh from '@/layout/components/Refresh/index.vue'

defineOptions({
  name: 'LeftMode'
})

const appStore = useAppStore()
</script>

<template>
  <n-layout class="h-screen" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider bordered collapse-mode="width" :collapsed="appStore.opened" :collapsed-width="64" :width="200">
      <Sidebar />
    </n-layout-sider>

    <!-- 主体部分 -->
    <n-layout class="flex h-screen flex-1 flex-col overflow-hidden">
      <!-- header -->

      <n-layout-header bordered class="flex h-16 items-center px-4 text-white">
        <div class="flex h-16 shrink-0 items-center bg-white px-4 text-white shadow-lg">
          <MenuToggle />
          <Refresh />
          <Breadcrumb />
        </div>
        <NavigationBar />
      </n-layout-header>

      <!-- main 内容 -->
      <n-layout-content class="flex-1 overflow-auto">
        <n-scrollbar class="h-full">
          <AppMain />
        </n-scrollbar>
      </n-layout-content>

      <!-- footer -->
      <n-layout-footer bordered class="flex h-12 items-center justify-center bg-blue-300 text-white">
        <div class="flex items-center">
          <span>Copyright © 2025 版权所有</span>
          <span>备案号：粤ICP备12345678号</span>
        </div>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
