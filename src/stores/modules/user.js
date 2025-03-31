import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user.js'

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref(localStorage.getItem('token') || '') // 初始化时读取本地存储
    const userId = ref(localStorage.getItem('userId') || '')
    const user = ref({})

    const apiResponse = ref({})

    const apiResponsesy = (apiResponsess) => {
      apiResponse.value = apiResponsess
    }
    // 设置 token 并保存到 localStorage
    const setToken = (newToken) => {
      token.value = newToken
      localStorage.setItem('token', newToken)
    }

    const setUserId = (newId) => {
      userId.value = newId
      localStorage.setItem('userId', newId)
      console.log(userId.value)
    }

    // 清除 token
    const removeToken = () => {
      token.value = ''
      localStorage.removeItem('token')
      user.value = {}
    }

    // 获取用户信息
    // 在store中的getUser方法
    const getUser = async () => {
      try {
        // console.log('请求用户信息的 userId:', userId.value)
        const res = await userGetInfoService()
        console.log('用户信息响应数据:', res.data)
        user.value = res.data.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUserId,
      userId
    }
  },
  {
    persist: true
  }
)
