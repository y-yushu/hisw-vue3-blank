<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

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
console.log('🚀 ~ theme:', theme.value)

// 用户信息
const userStore = useUserStore()
const { name } = userStore
</script>

<template>
  <div class="flex items-center space-x-1 bg-blue-100">
    <div @click="appStore.toggleOpened">
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
    <div class="cursor-pointer" @click="appStore.toggleTheme">
      <Icon v-if="theme === 'light'" icon="material-symbols:wb-sunny-rounded" width="24" height="24" />
      <Icon v-else icon="material-symbols:moon-stars-rounded" width="24" height="24" />
    </div>
    <!-- 个人 -->
    <div class="flex items-center">
      <n-avatar round size="small" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
      <span>{{ name }}</span>
    </div>
  </div>
</template>
