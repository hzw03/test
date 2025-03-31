import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia() //创建pinia实例
pinia.use(persist)

export default pinia

export * from './modules/user'
