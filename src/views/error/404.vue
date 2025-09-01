<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.push('/')
}
</script>

<template>
  <div class="bg-blue-500">
    <n-button type="primary" @click="handleClick">返回首页</n-button>
  </div>
</template>
