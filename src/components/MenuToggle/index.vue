<script setup lang="ts">
import { useAppStore } from '@/store/app'
const appStore = useAppStore()

defineOptions({
  name: 'MenuToggle'
})

const toggleMenu = () => {
  appStore.toggleOpened()
}
</script>

<template>
  <div class="ml-2 cursor-pointer" @click="toggleMenu">
    <Icon v-if="appStore.opened" icon="line-md:menu-unfold-left" width="24" height="24" class="text-black" />
    <Icon v-else icon="line-md:menu-fold-left" width="24" height="24" class="text-black" />
  </div>
</template>

<style lang="scss" scoped>
</style>
