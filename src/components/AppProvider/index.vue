<script lang="ts" setup>
defineOptions({
  name: 'AppProvider'
})
</script>

<template>
  <n-dialog-provider>
    <n-notification-provider>
      <n-message-provider>
        <slot name="default"></slot>
      </n-message-provider>
    </n-notification-provider>
  </n-dialog-provider>
</template>
