<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 当前组件 name
const componentName = computed(() => route.matched[route.matched.length - 1]?.components?.default?.name)
console.log('🚀 ~ componentName:', componentName)

// 是否需要缓存
const shouldCache = computed(() => route.meta?.noCache === false)
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <keep-alive :include="shouldCache ? componentName : ''">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */
</style>
