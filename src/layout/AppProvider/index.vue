<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme, darkTheme } from 'naive-ui'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

// 为浅色主题提供的覆盖
const lightThemeOverrides: GlobalThemeOverrides = {
  // common: {
  //   primaryColor: '#d60032',
  //   primaryColorHover: '#d64999',
  //   iconColor: '#2080f0'
  // }
}

// 为深色主题提供的覆盖
const darkThemeOverrides: GlobalThemeOverrides = {
  // common: {
  //   primaryColor: '#d60032',
  //   primaryColorHover: '#d64999',
  //   iconColor: '#2080f0'
  // }
}

// 根据当前主题选择对应的覆盖配置
const currentThemeOverrides = computed(() => {
  return theme.value === 'light' ? lightThemeOverrides : darkThemeOverrides
})

defineOptions({
  name: 'AppProvider'
})
</script>

<template>
  <n-config-provider :theme="theme === 'light' ? lightTheme : darkTheme" :theme-overrides="currentThemeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot name="default"></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
