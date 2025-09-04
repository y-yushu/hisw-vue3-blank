<script setup lang="ts">
// import type { BreadcrumbItem } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { onMounted, watch } from 'vue'

defineOptions({
  name: 'Breadcrumb'
})

const route = useRoute()
const appStore = useAppStore()
const { updateBreadcrumbByPath } = useBreadcrumb()

const breadcrumbItems = computed(() => {
  // 优先使用 store 中的面包屑数据
  if (appStore.breadcrumbs.length > 0) {
    return appStore.breadcrumbs.map(item => ({
      label: item.title,
      key: item.path,
      to: item.path
    }))
  }

  // 如果没有，则使用路由匹配的数据
  return route.matched
    .filter(item => item.meta.title)
    .map(item => ({
      label: item.meta.title,
      key: item.path,
      to: item.path
    }))
})

// 监听路由变化，自动更新面包屑
watch(
  () => route.path,
  newPath => {
    updateBreadcrumbByPath(newPath)
  },
  { immediate: true }
)

// 组件挂载时初始化面包屑
onMounted(() => {
  updateBreadcrumbByPath(route.path)
})
</script>

<template>
  <div class="ml-2 flex cursor-pointer items-center">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="item in breadcrumbItems" :key="item.key" :to="item.to">
        {{ item.label }}
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<style lang="scss" scoped></style>
