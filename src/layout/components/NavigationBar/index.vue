<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { setTheme } from '@/utils/css'
import eventBus from '@/utils/eventBus'

const router = useRouter()

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
function handleThemeChange(e: MouseEvent) {
  appStore.toggleTheme()
  setTheme(e)
}

// 用户信息
const userStore = useUserStore()
const { name } = userStore

const OperationMenu = [
  {
    label: '个人中心',
    key: 'userCenter'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]

const message = useMessage()
// 操作
function handleSelect(key: string) {
  if (key === 'userCenter') {
    router.push({ path: '/user/profile' })
  }
  if (key === 'logout') {
    userStore.toLogout().then(() => {
      message.success('退出登录成功')
      router.push({ path: '/login' })
    })
  }
}

// 打开抽屉
function handleDrawerControlOpen() {
  eventBus.emit('drawer-control-open', true)
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <n-icon class="cursor-pointer" size="24">
      <Icon icon="material-symbols:search-rounded" />
    </n-icon>
    <!-- 全屏 -->
    <n-icon class="cursor-pointer" size="24" @click="fullscreen.toggle">
      <Icon v-show="isFullscreen" icon="material-symbols:fullscreen-exit" />
      <Icon v-show="!isFullscreen" icon="material-symbols:fullscreen" />
    </n-icon>
    <!-- 语言 -->
    <n-dropdown v-model:value="selectedKey" trigger="hover" :options="options">
      <n-icon class="cursor-pointer" size="24">
        <Icon icon="material-symbols:language" />
      </n-icon>
    </n-dropdown>
    <!-- 主题 -->
    <n-icon v-if="theme !== 'auto'" class="cursor-pointer" size="24" @click="handleThemeChange">
      <Icon v-show="theme === 'light'" icon="material-symbols:wb-sunny-rounded" />
      <Icon v-show="theme === 'dark'" icon="material-symbols:moon-stars-rounded" />
    </n-icon>
    <!-- 个人 -->
    <n-dropdown trigger="click" :options="OperationMenu" @select="key => handleSelect(key)">
      <div class="flex cursor-pointer items-center space-x-1.5">
        <n-avatar round size="small" src="https://tse2.mm.bing.net/th/id/OIP.37r1Al9vUump5YT7SKc_egAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
        <span class="font-bold">{{ name }}</span>
      </div>
    </n-dropdown>
    <!-- 打开样式抽屉 -->
    <n-icon class="cursor-pointer" size="20" @click="handleDrawerControlOpen">
      <Icon icon="mage:dots" />
    </n-icon>
  </div>
</template>
