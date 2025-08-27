<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = computed<string>(() => (route.meta.link as string) || 'https://www.baidu.com')
const height = ref('')

onMounted(() => {
  height.value = document.documentElement.clientHeight - 94.5 + 'px'
})

const style = computed(() => ({
  height: height.value
}))
</script>

<template>
  <div :style="style">
    <iframe :src="url" frameborder="no" style="width: 100%; height: 100%" scrolling="auto"></iframe>
  </div>
</template>
