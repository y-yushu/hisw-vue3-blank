import { createDiscreteApi, type ConfigProviderProps, lightTheme } from 'naive-ui'

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: lightTheme
}))
const { message } = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
  configProviderProps: configProviderPropsRef
})
console.log('🚀 ~ test ~ message:', message)

export const test = () => {
  console.log('🚀 ~ test ~ test:')

  message.info('Message')
}
