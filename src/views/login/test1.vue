<script setup lang="ts">
import { useCounterStore } from '@/store/useCountStore'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
console.log('🚀 ~ counterStore:', counterStore)
const { count } = storeToRefs(counterStore)
const { setCount } = counterStore
const add = () => {
  setCount(count.value + 1)
}
</script>

<template>
  <div>
    test1:
    {{ count }}
    <button @click="add">加一</button>
  </div>
</template>

<style scoped></style>
