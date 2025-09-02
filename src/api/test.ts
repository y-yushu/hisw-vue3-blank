import { createDiscreteApi, type ConfigProviderProps, lightTheme } from 'naive-ui'

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: lightTheme
}))
const { message } = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
  configProviderProps: configProviderPropsRef
})

export const test = () => {
  message.info('Message')
}
