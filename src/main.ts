import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './store'
import './style/index.css'
import SvgIconPlugin from '@/components/SvgIcon'
import installIconify from '@/plugins/iconify'

const app = createApp(App)

// 注册路由
app.use(router)

// 注册iconify图标组件
app.use(installIconify)
// 注册svg图标组件
app.use(SvgIconPlugin)

setupStore(app)

Promise.all([
  router.isReady() // 登录路由准备完成
]).then(() => {
  app.mount('#app')
})
