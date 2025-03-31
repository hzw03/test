import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://172.18.65.209:8102/'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
  headers: { platform: 'H5' }
})

instance.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `${userStore.token}`
    console.log('请求头携带Token:', config.headers.Authorization)
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('认证失效，跳转登录')
      const userStore = useUserStore()
      userStore.removeToken()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
