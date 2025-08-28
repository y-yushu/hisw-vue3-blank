<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme, darkTheme } from 'naive-ui'
import { useAppStore } from '@/store/app'
console.log('🚀 ~ lightTheme:', lightTheme)

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const themeOverrides: GlobalThemeOverrides = {
  // common: {
  //   primaryColor: '#a8ff52',
  //   primaryColorHover: '#8fff29'
  // },
  // Button: {
  //   textColor: '#a8ff52'
  // }
}
defineOptions({
  name: 'AppProvider'
})
</script>

<template>
  <n-config-provider :theme="theme === 'light' ? lightTheme : darkTheme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot name="default"></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
