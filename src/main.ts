import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './store'
import './style/index.css'

const app = createApp(App)

app.use(router)

setupStore(app)

Promise.all([
  router.isReady() // 登录路由准备完成
]).then(() => {
  app.mount('#app')
})
