<script setup lang="ts"></script>

<template>
  <div>
    角色管理
    <div v-for="i in 50" :key="i">
      <div class="border border-amber-600">角色{{ i }}</div>
    </div>
  </div>
</template>
