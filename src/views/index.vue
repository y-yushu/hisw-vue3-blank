<script setup lang="ts"></script>

<template>
  <div class="h-full bg-amber-100">
    <span>首页</span>
    <div v-for="i in 50" :key="i">
      <span>循环{{ i }}</span>
    </div>
  </div>
</template>
