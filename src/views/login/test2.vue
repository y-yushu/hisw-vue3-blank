<script setup lang="ts">
import { useCounterStore } from '@/store/useCountStore'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
const { setCount } = counterStore
const sub = () => {
  setCount(count.value - 1)
}
</script>

<template>
  <div>
    test2:
    {{ count }}
    <button @click="sub">减一</button>
    <br />
    {{ doubleCount }}
  </div>
</template>

<style scoped></style>
