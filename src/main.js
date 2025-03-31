import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import persist from 'pinia-plugin-persistedstate'
import pinia from '@/stores/index'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'

const app = createApp(App) //创建根实例

app.use(pinia) //pinia插件的安装配置
app.use(router)

app.mount('#app') //视图的挂载
