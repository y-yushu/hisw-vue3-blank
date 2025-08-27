import { type App } from 'vue'
import SvgIcon from './SvgIcon.vue'

// 会扫描src/assets/svg/下的所有svg文件，通过name的方式引用
// 如果嵌套有文件夹，则name前加对应文件夹名，如 menu/chat.svg -> name="menu/chat"
const modules = import.meta.glob('/src/assets/svg/**/*.svg', { eager: true })

// 生成 name -> component 映射表
const iconMap: Record<string, any> = {}
for (const [key, mod] of Object.entries(modules)) {
  // key 形如 "/src/assets/svg/menu/chat.svg"
  const relativePath = key.replace(/^\/src\/assets\/svg\//, '') // => "menu/chat.svg"
  const name = relativePath.replace(/\.svg$/, '') // => "menu/chat"
  iconMap[name] = (mod as any).default
}

export default {
  install(app: App) {
    // 全局注册 svg-icon 组件
    app.component('svg-icon', SvgIcon)

    // 提供全局图标映射表
    app.provide('iconMap', iconMap)
  }
}
