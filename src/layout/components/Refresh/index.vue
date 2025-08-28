<script setup lang="ts">
defineOptions({
  name: 'Refresh'
})

const handleRefresh = () => {
  console.log('刷新')
  // 刷新页面
  window.location.reload()
}
</script>

<template>
  <div class="ml-2 cursor-pointer">
    <Icon icon="material-symbols:refresh" width="24" height="24" class="text-black" @click="handleRefresh" />
  </div>
</template>

<style lang="scss" scoped>

</style>
