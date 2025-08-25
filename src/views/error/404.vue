<script setup lang="ts">
import { useRouter } from 'vue-router'

const num = ref(0)

const router = useRouter()

const handleClick = () => {
  router.push('/')
}
</script>

<template>
  <div class="bg-blue-500">
    <n-button type="primary" @click="handleClick">返回首页</n-button>
    <span>{{ num }}</span>
    <n-button type="primary" @click="num++">加一</n-button>
  </div>
</template>
