<script setup lang="ts">
import { useAppStore } from '@/store/app'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import NavigationBar from '@/layout/components/NavigationBar/index.vue'

defineOptions({
  name: 'LeftMode'
})

const appStore = useAppStore()
</script>

<template>
  <div class="flex h-screen">
    <!-- 左侧 aside -->
    <aside :class="['overflow-hidden transition-all duration-300', appStore.opened ? 'w-16' : 'w-50']">
      <Sidebar />
    </aside>

    <!-- 右侧主区域 -->
    <div class="flex flex-1 flex-col">
      <!-- header -->
      <header class="flex h-16 shrink-0 items-center bg-blue-300 px-4 text-white">
        <NavigationBar />
      </header>

      <!-- main 内容区 -->
      <main class="flex-1 overflow-auto bg-gray-100">
        <n-scrollbar class="h-full">
          <AppMain />
          <p>这里是内容区</p>
          <p v-for="i in 50" :key="i">滚动测试内容 {{ i }}</p>
        </n-scrollbar>
      </main>

      <!-- footer -->
      <footer class="flex h-12 shrink-0 items-center justify-center bg-blue-300 text-white">底部 Footer</footer>
    </div>
  </div>
</template>
