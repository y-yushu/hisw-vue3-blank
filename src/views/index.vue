<script setup lang="ts">
// import { test } from '@/api/test'
import { useRouter } from 'vue-router'

const router = useRouter()

// const handleClick = () => {
//   console.log('click')
//   test()
// }
// console.log('🚀 ~ handleClick ~ handleClick:', handleClick)

const handleClick2 = () => {
}
</script>

<template>
  <div class="aaa">
    <n-button type="primary" @click="handleClick2"> 去登录 </n-button>
    home
    <svg-icon name="system/user" color="red" size="2rem" />
    ttt
  </div>
</template>

<style scoped>
.aaa {
  background-color: yellow;
}
</style>
