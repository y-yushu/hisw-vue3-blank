<template>
  <div>
    <keep-alive :include="[]">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 获取 store
// const store = useStore()
// 获取当前路由
const route = useRoute()

// 计算属性
// const cachedViews = computed(() => store.state.tagsView.cachedViews)
const key = computed(() => route.path)
</script>
