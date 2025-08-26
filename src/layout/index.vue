<script setup lang="ts">
import PhoneMode from './mode/PhoneMode.vue'
import LeftMode from './mode/LeftMode.vue'
// import RightMode from './mode/RightMode.vue'
import { useDevice } from '@/hooks/useDevice'

// 当前设备型号
const device = useDevice()
</script>

<template>
  <PhoneMode v-if="device !== 'pc'" />
  <LeftMode v-else />
</template>
