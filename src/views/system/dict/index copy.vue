<script setup lang="ts">
// 获取主题变量
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
console.log('🚀 ~ themeVars:', themeVars)
</script>

<template>
  <!-- -->
  <div class="themed-background h-full p-4" :style="{ backgroundColor: themeVars.bodyColor }">
    <div class="h-full">
      <n-button type="primary">测试</n-button>
    </div>
  </div>
</template>

<style scoped></style>
