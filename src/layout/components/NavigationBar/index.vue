<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useTabsStore } from '@/store/tabs'
import { setTheme } from '@/utils/css'
import eventBus from '@/utils/eventBus'

const router = useRouter()
const tabsStore = useTabsStore()

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
    // 添加页签
    tabsStore.addTab({ path: '/user/profile', title: '个人中心', icon: 'job' })
    router.push({ path: '/user/profile' })
  }
  if (key === 'logout') {
    userStore.toLogout().then(() => {
      message.success('退出登录成功')
      router.push({ path: '/login' })
    })
  }
}

// 权限store
const permissionStore = usePermissionStore()

// 搜索框状态
const showSearchBox = ref(false)
const searchValue = ref('')
const searchResults = ref<AppRouteRecordRaw[]>([])
const showSearchResults = ref(false)

// 切换搜索框显示
function toggleSearchBox() {
  showSearchBox.value = !showSearchBox.value
  if (showSearchBox.value) {
    // 显示搜索框时，延迟聚焦到输入框
    nextTick(() => {
      const searchInput = document.querySelector('.search-input input') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    })
  } else {
    // 隐藏搜索框时清空搜索值和结果
    searchValue.value = ''
    searchResults.value = []
    showSearchResults.value = false
  }
}

// 搜索路由
function searchRoutes(keyword: string): AppRouteRecordRaw[] {
  if (!keyword.trim()) return []

  const results: AppRouteRecordRaw[] = []
  const searchKeyword = keyword.toLowerCase()

  // 递归搜索路由
  function searchInRoutes(routes: AppRouteRecordRaw[], parentPath = '') {
    routes.forEach(route => {
      // 跳过隐藏的路由
      if (route.hidden) return

      const routePath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)
      const title = route.meta?.title || route.name || ''

      // 搜索标题和路径
      if (title.toString().toLowerCase().includes(searchKeyword) || routePath.toLowerCase().includes(searchKeyword)) {
        results.push({
          ...route,
          path: routePath,
          meta: {
            ...route.meta,
            fullPath: routePath
          }
        })
      }

      // 递归搜索子路由
      if (route.children && route.children.length > 0) {
        searchInRoutes(route.children, routePath)
      }
    })
  }

  searchInRoutes(permissionStore.sidebarRouters)
  return results.slice(0, 8) // 限制结果数量
}

// 监听搜索值变化
watch(searchValue, newValue => {
  if (newValue.trim()) {
    searchResults.value = searchRoutes(newValue)
    showSearchResults.value = searchResults.value.length > 0
  } else {
    searchResults.value = []
    showSearchResults.value = false
  }
})

// 处理搜索结果点击
function handleResultClick(route: AppRouteRecordRaw) {
  if (route.meta?.fullPath) {
    router.push(route.meta.fullPath)
    toggleSearchBox() // 关闭搜索框
    message.success(`已跳转到 ${route.meta.title}`)
  }
}

// 处理搜索
function handleSearch() {
  if (searchValue.value.trim() && searchResults.value.length > 0) {
    // 跳转到第一个搜索结果
    handleResultClick(searchResults.value[0])
  }
}

// 按ESC键关闭搜索框
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    showSearchBox.value = false
    searchValue.value = ''
  }
}

// 打开抽屉
function handleDrawerControlOpen() {
  eventBus.emit('drawer-control-open', true)
}
</script>

<template>
  <div class="relative flex items-center space-x-2">
    <!-- 搜索容器 -->
    <div class="relative flex items-center">
      <!-- 搜索框 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 transform scale-95 translate-x-64"
        enter-to-class="opacity-100 transform scale-100 translate-x-0"
        leave-from-class="opacity-100 transform scale-100 translate-x-0"
        leave-to-class="opacity-0 transform scale-95 translate-x-64"
      >
        <div v-show="showSearchBox" class="absolute top-1/2 right-0 z-50 w-64 -translate-y-1/2" @keydown="handleKeydown">
          <n-input v-model:value="searchValue" class="search-input w-64" placeholder="搜索菜单、页面..." clearable @keydown.enter="handleSearch">
            <template #suffix>
              <n-button size="tiny" quaternary circle @click="toggleSearchBox">
                <template #icon>
                  <n-icon size="14">
                    <Icon icon="material-symbols:close-rounded" />
                  </n-icon>
                </template>
              </n-button>
            </template>
          </n-input>

          <!-- 搜索结果下拉列表 -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-2"
          >
            <div
              v-show="showSearchResults"
              class="absolute top-full left-0 mt-2 max-h-80 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div v-if="searchResults.length === 0 && searchValue.trim()" class="p-4 text-center text-gray-500 dark:text-gray-400">
                <n-icon size="24" class="mb-2">
                  <Icon icon="material-symbols:search-off" />
                </n-icon>
                <div>未找到相关页面</div>
              </div>
              <div v-else class="py-2">
                <div
                  v-for="(result, index) in searchResults"
                  :key="index"
                  class="flex cursor-pointer items-center space-x-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="handleResultClick(result)"
                >
                  <n-icon size="16" class="text-gray-500 dark:text-gray-400">
                    <Icon :icon="result.meta?.icon || 'material-symbols:article-outline'" />
                  </n-icon>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ result.meta?.title || result.name }}
                    </div>
                    <div class="truncate text-xs text-gray-500 dark:text-gray-400">
                      {{ result.meta?.fullPath }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- 搜索图标 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="transform translate-x-0"
        enter-to-class="transform -translate-x-68"
        leave-from-class="transform -translate-x-68"
        leave-to-class="transform translate-x-0"
      >
        <n-icon
          class="cursor-pointer transition-all duration-300 ease-out"
          :class="{ '-translate-x-68': showSearchBox }"
          size="24"
          @click="toggleSearchBox"
        >
          <Icon icon="material-symbols:search-rounded" />
        </n-icon>
      </Transition>
    </div>
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
