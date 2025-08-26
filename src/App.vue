<script setup lang="ts">
import AppProvider from '@/layout/AppProvider/index.vue'
</script>

<template>
  <div id="app">
    <AppProvider>
      <router-view />
    </AppProvider>
  </div>
</template>
