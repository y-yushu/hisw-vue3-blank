<script setup lang="ts">
import AppProvider from '@/components/AppProvider/index.vue'
</script>

<template>
  <div id="app">
    <AppProvider>
      <router-view />
    </AppProvider>
  </div>
</template>
