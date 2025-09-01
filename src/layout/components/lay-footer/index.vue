<script setup lang="ts">
import settings from '@/settings'

// 是否显示页脚
const showFooter = settings.showFooter
</script>

<template>
  <n-layout-footer v-if="showFooter" bordered class="flex h-12 items-center justify-center">
    <div class="flex items-center">
      <span>Copyright © 2025 版权所有</span>
      <span>备案号：粤ICP备12345678号</span>
    </div>
  </n-layout-footer>
</template>
