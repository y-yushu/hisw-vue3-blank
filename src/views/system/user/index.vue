<script setup lang="ts"></script>

<template>
  <div class="h-full">
    <n-scrollbar class="h-full">
      用户管理
      <div v-for="i in 50" :key="i" class="border border-red-500">
        <div>{{ i }}</div>
      </div>
    </n-scrollbar>
  </div>
</template>
