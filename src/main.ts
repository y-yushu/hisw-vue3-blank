import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './style/index.css'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
app.use(pinia)

Promise.all([
  router.isReady() // 登录路由准备完成
]).then(() => {
  app.mount('#app')
})
