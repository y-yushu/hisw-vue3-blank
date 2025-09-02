<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { lightTheme, darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { addClassToBody, removeClassFromBody } from '@/utils/css'

const appStore = useAppStore()
const { themeName, asideTheme } = storeToRefs(appStore)

const color1 = '#000000'
const lightThemeAside: GlobalThemeOverrides = {
  Menu: {
    itemIconColor: color1,
    itemTextColor: color1
  }
}

const color2 = '#BBBBBB'
const darkThemeAside: GlobalThemeOverrides = {
  Menu: {
    itemIconColor: color2,
    itemTextColor: color2
  }
}

// 为浅色主题提供的覆盖
const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#43B597'
  }
}

// 为深色主题提供的覆盖
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2D8CF0'
  }
}

// 根据当前主题选择对应的覆盖配置
const currentThemeOverrides = computed(() => {
  // 选择基础主题
  const baseTheme: GlobalThemeOverrides = themeName.value === 'light' ? lightThemeOverrides : darkThemeOverrides

  // 根据侧边栏主题选择要合并的侧边栏配置
  const asideOverrides: GlobalThemeOverrides = asideTheme.value === 'light' ? lightThemeAside : darkThemeAside

  // 合并主题配置 - 针对naive-ui的GlobalThemeOverrides结构的简化合并
  let mergedTheme: GlobalThemeOverrides = {}

  // 复制基础主题的所有配置
  for (const key in baseTheme) {
    if (Object.prototype.hasOwnProperty.call(baseTheme, key)) {
      mergedTheme = {
        ...baseTheme
      }
    }
  }

  // 合并侧边栏主题的配置
  for (const key in asideOverrides) {
    if (Object.prototype.hasOwnProperty.call(asideOverrides, key)) {
      mergedTheme = {
        ...mergedTheme,
        ...asideOverrides
      }
    }
  }

  if (asideTheme.value === 'light') {
    removeClassFromBody('dark-aisde')
  } else {
    addClassToBody('dark-aisde')
  }

  return mergedTheme
})
</script>

<template>
  <n-config-provider :theme="themeName === 'light' ? lightTheme : darkTheme" :theme-overrides="currentThemeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot name="default"></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
