<script setup lang="ts">
import { defineProps, computed, inject } from 'vue'
import SvgNa from '@/assets/svg/na.svg'

const props = defineProps<{
  name: string
  className?: string
  color?: string
  size?: string | number
}>()

// 默认值
const color = computed(() => props.color ?? 'currentColor')
const size = computed(() => (typeof props.size === 'number' ? `${props.size}px` : (props.size ?? '1em')))

// 注入全局 iconMap
const iconMap = inject<Record<string, any>>('iconMap', {})

// 找到对应的 svg 组件
const SvgComp = computed(() => iconMap?.[props.name])
</script>

<template>
  <span class="inline-block" :class="props.className" :style="{ color, width: size, height: size }">
    <component v-if="SvgComp" :is="SvgComp" :style="{ fill: color, width: size, height: size }" />
    <SvgNa v-else :style="{ width: size, height: size }" />
  </span>
</template>
