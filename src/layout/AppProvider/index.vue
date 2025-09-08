<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { zhCN, dateZhCN } from 'naive-ui'
import { getPalette } from 'tailwindcss-palette-generator/getPalette'
import { lightTheme, darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { addClassToBody, removeClassFromBody } from '@/utils/css'

const appStore = useAppStore()
const { themeName, asideTheme, primaryColor, successColor, infoColor, warningColor, errorColor } = storeToRefs(appStore)

// aside样式
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
const colorTheme = computed<GlobalThemeOverrides>(() => {
  const common: any = {}
  if (primaryColor.value) {
    const _primary = getPalette(primaryColor.value)
    common['primaryColor'] = _primary.primary['500']
    common['primaryColorHover'] = _primary.primary['400']
    common['primaryColorSuppl'] = _primary.primary['300']
    common['primaryColorPressed'] = _primary.primary['600']
  }
  if (successColor.value) {
    const _success = getPalette(successColor.value)
    common['successColor'] = _success.primary['500']
    common['successColorHover'] = _success.primary['400']
    common['successColorSuppl'] = _success.primary['300']
    common['successColorPressed'] = _success.primary['600']
  }
  if (infoColor.value) {
    const _info = getPalette(infoColor.value)
    common['infoColor'] = _info.primary['500']
    common['infoColorHover'] = _info.primary['400']
    common['infoColorSuppl'] = _info.primary['300']
    common['infoColorPressed'] = _info.primary['600']
  }
  if (warningColor.value) {
    const _warning = getPalette(warningColor.value)
    common['warningColor'] = _warning.primary['500']
    common['warningColorHover'] = _warning.primary['400']
    common['warningColorSuppl'] = _warning.primary['300']
    common['warningColorPressed'] = _warning.primary['600']
  }
  if (errorColor.value) {
    const _error = getPalette(errorColor.value)
    common['errorColor'] = _error.primary['500']
    common['errorColorHover'] = _error.primary['400']
    common['errorColorSuppl'] = _error.primary['300']
    common['errorColorPressed'] = _error.primary['600']
  }
  return { common }
})

// 根据当前主题选择对应的覆盖配置
const currentThemeOverrides = computed(() => {
  // 选择基础主题
  // const baseTheme: GlobalThemeOverrides = themeName.value === 'light' ? lightThemeOverrides.value : darkThemeOverrides.value
  const baseTheme: GlobalThemeOverrides = colorTheme.value

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
  <n-config-provider
    :theme="themeName === 'light' ? lightTheme : darkTheme"
    :theme-overrides="currentThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot name="default"></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
