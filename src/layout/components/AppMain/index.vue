<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'LayContent'
})

const route = useRoute()

// 当前组件 name
const componentName = computed(() => route.matched[route.matched.length - 1]?.components?.default?.name || '')

// 是否需要缓存（修改逻辑：默认缓存，除非明确设置 noCache 为 true）
const shouldCache = computed(() => route.meta?.noCache !== true)
const cacheList = computed(() => {
  const name = componentName.value
  return shouldCache.value && name ? [name] : []
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cacheList">
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>
