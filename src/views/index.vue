<script setup lang="ts">
import { test } from '@/api/test'

const handleClick = () => {
  console.log('click')
  test()
}
</script>

<template>
  <div>
    home
    <n-button type="primary" @click="handleClick"> Primary </n-button>
    home
  </div>
</template>
