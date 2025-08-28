<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStoreOutside } from '@/store/app'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import MenuToggle from '@/components/MenuToggle/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Refresh from '@/components/Refresh/index.vue'

defineOptions({
  name: 'LeftMode'
})

const useAppStore = useAppStoreOutside()
const { opened } = storeToRefs(useAppStore)
</script>

<template>
  <div class="flex h-screen">
    <!-- 左侧 aside -->
    <aside :class="['overflow-hidden transition-all duration-300', opened ? 'w-16' : 'w-50']">
      <Sidebar />
    </aside>

    <!-- 右侧主区域 -->
    <div class="flex flex-1 flex-col">
      <!-- header -->
      <header class="flex h-16 shrink-0 items-center bg-white px-4 text-white shadow-lg">
        <MenuToggle />
        <Refresh />
        <Breadcrumb />
      </header>

      <!-- main 内容区 -->
      <main class="flex-1 overflow-auto bg-gray-100">
        <n-scrollbar class="h-full">
          <AppMain />
        </n-scrollbar>
      </main>

      <!-- footer -->
      <footer class="flex h-12 shrink-0 items-center justify-center bg-white shadow-sm">
        <div class="flex items-center">
          <span>Copyright © 2025 版权所有</span>
          <span>备案号：粤ICP备12345678号</span>
        </div>
      </footer>
    </div>
  </div>
</template>
