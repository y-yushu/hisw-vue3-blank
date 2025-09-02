// src/eventBus.ts
import mitt from 'mitt'

// 定义事件类型，提高类型安全性
type Events = {
  // 打开样式控制抽屉
  'drawer-control-open': boolean
  'user-login': { id: number; name: string }
  'theme-change': string
  // 可根据需求定义更多事件类型
}

const eventBus = mitt<Events>()

export default eventBus
