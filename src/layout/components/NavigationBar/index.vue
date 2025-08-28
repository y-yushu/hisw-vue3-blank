<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { useTheme } from '@/hooks/useTheme'

defineOptions({
  name: 'NavigationBar'
})

// 全屏
const fullscreen = useFullscreen()
const { isFullscreen } = fullscreen

// 多语言
const selectedKey = ref('zh-CN')
const options = [
  {
    label: '简体中文',
    key: 'zh-CN'
  },
  {
    label: 'English',
    key: 'en'
  }
]

// 主题
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { setTheme } = useTheme()
function handleThemeChange(e: MouseEvent) {
  appStore.toggleTheme()
  setTheme(e)
}

// 用户信息
const userStore = useUserStore()
const { name } = userStore
</script>

<template>
  <div class="flex items-center space-x-2">
    <div class="cursor-pointer">
      <Icon icon="material-symbols:search-rounded" width="24" height="24" />
    </div>
    <!-- 全屏 -->
    <div class="cursor-pointer" @click="fullscreen.toggle">
      <Icon v-if="isFullscreen" icon="material-symbols:fullscreen-exit" width="24" height="24" />
      <Icon v-else icon="material-symbols:fullscreen" width="24" height="24" />
    </div>
    <!-- 语言 -->
    <n-dropdown v-model:value="selectedKey" trigger="hover" :options="options">
      <Icon icon="material-symbols:language" width="24" height="24" />
    </n-dropdown>
    <!-- 主题 -->
    <div class="cursor-pointer" @click="handleThemeChange">
      <Icon v-if="theme === 'light'" icon="material-symbols:wb-sunny-rounded" width="24" height="24" />
      <Icon v-else icon="material-symbols:moon-stars-rounded" width="24" height="24" />
    </div>
    <!-- 个人 -->
    <div class="flex items-center">
      <n-avatar round size="small" src="https://tse2.mm.bing.net/th/id/OIP.37r1Al9vUump5YT7SKc_egAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
      <span>{{ name }}</span>
    </div>
  </div>
</template>
