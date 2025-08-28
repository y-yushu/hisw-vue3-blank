import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installPinia from './store'
import installSvgIcon from '@/components/SvgIcon'
import installIconify from '@/plugins/iconify'
import './style/index.css'

const app = createApp(App)

// 注册路由
app.use(router)

// 注册iconify图标组件
app.use(installIconify)
// 注册svg图标组件
app.use(installSvgIcon)

// 注册状态管理
app.use(installPinia)

Promise.all([
  router.isReady() // 登录路由准备完成
]).then(() => {
  app.mount('#app')
})
