import type { App } from 'vue'
import { Icon } from '@iconify/vue'

export default {
  install(app: App) {
    // 全局注册 svg-icon 组件
    app.component('Icon', Icon)
  }
}
