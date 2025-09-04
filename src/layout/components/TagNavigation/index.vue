<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, h } from 'vue'
import { NTag, NScrollbar, NDropdown, useMessage } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore } from '@/store/tabs'
import { useAppStore } from '@/store/app'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

defineOptions({
  name: 'TagNavigation'
})

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const appStore = useAppStore()
const message = useMessage()
const { updateBreadcrumbByPath } = useBreadcrumb()

// 滚动容器引用
const scrollbarRef = ref()

// 右键菜单选项
const dropdownOptions = [
  {
    label: '刷新页面',
    key: 'refresh',
    icon: () => h(SvgIcon, { name: 'refresh', size: '14px' })
  },
  {
    label: '关闭当前',
    key: 'closeCurrent',
    icon: () => h(SvgIcon, { name: 'close', size: '14px' })
  },
  {
    label: '关闭其他',
    key: 'closeOthers',
    icon: () => h(SvgIcon, { name: 'close-others', size: '14px' })
  },
  {
    label: '关闭左侧',
    key: 'closeLeft',
    icon: () => h(SvgIcon, { name: 'close-left', size: '14px' })
  },
  {
    label: '关闭右侧',
    key: 'closeRight',
    icon: () => h(SvgIcon, { name: 'close-right', size: '14px' })
  },
  {
    label: '关闭所有',
    key: 'closeAll',
    icon: () => h(SvgIcon, { name: 'close-all', size: '14px' })
  }
]

// 右键菜单状态
const dropdownShow = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)
const contextMenuTab = ref('')

// 计算属性
const tabsList = computed(() => tabsStore.tabsList)
const activeTab = computed(() => tabsStore.activeTab)

// 页签点击处理
const handleTabClick = (tab: any) => {
  tabsStore.setActiveTab(tab.name)
  // 更新面包屑
  updateBreadcrumbByPath(tab.path)
  // 同步菜单选中状态
  appStore.setCurrentMenuPath(tab.path)
  router.push(tab.path)
}

// 页签关闭处理
const handleTabClose = (e: Event, tab: any) => {
  e.stopPropagation()

  if (tab.affix) {
    message.warning('固定页签不能关闭')
    return
  }

  tabsStore.removeTab(tab.name)

  // 如果关闭的是当前页签，需要跳转到新的当前页签
  if (tab.name === activeTab.value && tabsStore.getCurrentTab) {
    updateBreadcrumbByPath(tabsStore.getCurrentTab.path)
    appStore.setCurrentMenuPath(tabsStore.getCurrentTab.path)
    router.push(tabsStore.getCurrentTab.path)
  }
}

// 右键菜单处理
const handleContextMenu = (e: MouseEvent, tab: any) => {
  e.preventDefault()
  contextMenuTab.value = tab.name
  dropdownX.value = e.clientX
  dropdownY.value = e.clientY
  dropdownShow.value = true
}

// 右键菜单选择处理
const handleDropdownSelect = (key: string) => {
  const currentTab = tabsList.value.find(tab => tab.name === contextMenuTab.value)
  if (!currentTab) return

  switch (key) {
    case 'refresh':
      // 刷新当前页面
      if (contextMenuTab.value === activeTab.value) {
        window.location.reload()
      } else {
        message.info('请先切换到该页签再刷新')
      }
      break
    case 'closeCurrent':
      if (currentTab.affix) {
        message.warning('固定页签不能关闭')
      } else {
        tabsStore.removeTab(contextMenuTab.value)
        if (contextMenuTab.value === activeTab.value && tabsStore.getCurrentTab) {
          updateBreadcrumbByPath(tabsStore.getCurrentTab.path)
          appStore.setCurrentMenuPath(tabsStore.getCurrentTab.path)
          router.push(tabsStore.getCurrentTab.path)
        }
      }
      break
    case 'closeOthers':
      tabsStore.closeOtherTabs(contextMenuTab.value)
      if (contextMenuTab.value !== activeTab.value) {
        tabsStore.setActiveTab(contextMenuTab.value)
        updateBreadcrumbByPath(currentTab.path)
        appStore.setCurrentMenuPath(currentTab.path)
        router.push(currentTab.path)
      }
      break
    case 'closeLeft':
      tabsStore.closeLeftTabs(contextMenuTab.value)
      break
    case 'closeRight':
      tabsStore.closeRightTabs(contextMenuTab.value)
      break
    case 'closeAll':
      tabsStore.closeAllTabs()
      if (tabsStore.getCurrentTab) {
        updateBreadcrumbByPath(tabsStore.getCurrentTab.path)
        appStore.setCurrentMenuPath(tabsStore.getCurrentTab.path)
        router.push(tabsStore.getCurrentTab.path)
      }
      break
  }

  dropdownShow.value = false
}

// 点击外部关闭右键菜单
const handleClickOutside = () => {
  dropdownShow.value = false
}

// 滚动到激活的页签
const scrollToActiveTab = async () => {
  await nextTick()
  if (scrollbarRef.value) {
    const activeTabElement = document.querySelector('.tag-item.active')
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }
}

// 监听路由变化，同步页签状态
watch(
  () => route.path,
  newPath => {
    // 查找对应的页签
    const tab = tabsList.value.find(tab => tab.path === newPath)
    if (tab) {
      tabsStore.setActiveTab(tab.name)
    }
  },
  { immediate: true }
)

// 监听激活页签变化，自动滚动到激活页签
watch(
  () => activeTab.value,
  () => {
    scrollToActiveTab()
  }
)

onMounted(() => {
  // 初始化时滚动到激活页签
  scrollToActiveTab()
})
</script>

<template>
  <div class="tag-navigation" @click="handleClickOutside">
    <NScrollbar ref="scrollbarRef" class="w-full" :x-scrollable="true" style="max-width: 100%">
      <div class="flex min-w-max gap-1 px-2 pb-3" style="width: max-content">
        <NTag
          v-for="tab in tabsList"
          :key="tab.name"
          :type="activeTab === tab.name ? 'primary' : 'default'"
          :closable="tab.closable !== false && !tab.affix"
          class="cursor-pointer select-none"
          @click="handleTabClick(tab)"
          @close="handleTabClose($event, tab)"
          @contextmenu="handleContextMenu($event, tab)"
          size="small"
        >
          <div class="flex items-center gap-1">
            <SvgIcon v-if="tab.icon" :name="tab.icon" size="12px" />
            <span>{{ tab.title }}</span>
          </div>
        </NTag>
      </div>
    </NScrollbar>

    <!-- 右键菜单 -->
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownX"
      :y="dropdownY"
      :options="dropdownOptions"
      :show="dropdownShow"
      :on-clickoutside="handleClickOutside"
      @select="handleDropdownSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.tag-navigation {
  overflow: hidden; /* 确保父容器不会溢出 */
}

/* 确保NScrollbar能正确处理横向滚动 */
:deep(.n-scrollbar-container) {
  overflow-x: auto !important;
}

:deep(.n-scrollbar-content) {
  display: flex;
  width: max-content;
}
</style>
