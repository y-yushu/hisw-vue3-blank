/**
 * 如果你想在 setup 外使用 useDialog、useMessage、useNotification、useLoadingBar，useModal，可以通过 createDiscreteApi 来构建对应的 API
 * https://www.naiveui.com/zh-CN/light/components/discrete
 */
import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import { computed, ref } from 'vue'

const themeRef = ref<'light' | 'dark'>('light')
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: themeRef.value === 'light' ? lightTheme : darkTheme
}))

const {
  message: Message,
  notification: Notification,
  dialog: Dialog,
  loadingBar: LoadingBar,
  modal: Modal
} = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
  configProviderProps: configProviderPropsRef
})

export { Message, Notification, Dialog, LoadingBar, Modal }
