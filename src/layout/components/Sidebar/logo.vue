<script setup lang="ts">
import config from '@/settings'
import { useAppStore } from '@/store/app'
import logo from '@/assets/images/logo.png'

const appStore = useAppStore()
</script>

<template>
  <div class="relative h-12 overflow-hidden">
    <transition-group name="slide-vertical">
      <div v-show="!appStore.opened" key="full" class="absolute flex w-full items-center justify-center space-x-2 px-4 py-2">
        <img class="h-8 w-8" :src="logo" alt="" />
        <h1 class="cu-custon-sider-title overflow-hidden text-lg font-bold text-ellipsis whitespace-nowrap">{{ config.app_title }}</h1>
      </div>
      <div v-show="appStore.opened" key="logo-only" class="absolute flex w-full items-center justify-center space-x-2 px-4 py-2">
        <img class="h-8 w-8" :src="logo" alt="" />
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.slide-vertical-enter-active,
.slide-vertical-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

/* 当元素进入时从下方滚动上来 */
.slide-vertical-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

/* 当元素离开时向上滚动出去 */
.slide-vertical-leave-to {
  // transform: translateY(-100%);
  transform: translateY(-100%);
  opacity: 0;
}

/* 确保元素在视图中时位置正确 */
.slide-vertical-enter-to,
.slide-vertical-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
