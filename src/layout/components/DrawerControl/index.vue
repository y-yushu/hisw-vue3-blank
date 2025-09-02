<script setup lang="ts">
import { storeToRefs } from 'pinia'
import eventBus from '@/utils/eventBus'
import { useAppStore, type Theme } from '@/store/app'
import { setTheme } from '@/utils/css'

const active = ref(false)

// 监听抽屉开关
eventBus.on('drawer-control-open', show => (active.value = show))
onBeforeUnmount(() => eventBus.off('drawer-control-open'))

// 全部配置
const appStore = useAppStore()
const { theme, asideTheme } = storeToRefs(appStore)
watch(theme, val => (model.theme = val))
watch(asideTheme, val => (model.asideTheme = val))
const model = reactive({
  theme: theme.value,
  asideTheme: asideTheme.value
})

// 切换侧边栏主题
const changeAsideTheme = (value: Theme) => {
  appStore.toggleAsideTheme(value)
}

// 切换主题
const clickEvent = ref<MouseEvent>()
// 记录点击位置
const handleGroupClick = (e: MouseEvent) => (clickEvent.value = e)
// 触发主题切换
function changeTheme(value: Theme) {
  // 切换主题
  if (value !== theme.value) {
    // 如果当前主题需要切换，则触发切换
    appStore.changeTheme(value)
    // 切换完成后，更新当前主题
    if (clickEvent.value) setTheme(clickEvent.value)
  }
}
</script>

<template>
  <n-drawer v-model:show="active" :width="340">
    <n-drawer-content title="主题风格设置">
      <n-form ref="formRef" :label-width="80" :model="model">
        <n-form-item label="模式" path="user.name">
          <div @click="handleGroupClick">
            <n-radio-group v-model:value="model.theme" @update:value="changeTheme">
              <n-radio-button value="light">浅色模式</n-radio-button>
              <n-radio-button value="dark">深色模式</n-radio-button>
              <n-radio-button value="auto">自动模式</n-radio-button>
            </n-radio-group>
          </div>
        </n-form-item>
        <n-form-item label="模式" path="user.name">
          <div @click="handleGroupClick">
            <n-radio-group v-model:value="model.asideTheme" :disabled="model.theme !== 'light'" @update:value="changeAsideTheme">
              <n-radio-button value="light">浅色模式</n-radio-button>
              <n-radio-button value="dark">深色模式</n-radio-button>
            </n-radio-group>
          </div>
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
