// import { renderIf } from 'element-plus/es/utils'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores'

//createRouter 创建路由实例
// history模式：createWebHistory  #
// hash模式: createWebHashHistory
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/index/index',
      children: [
        {
          path: '/index/index',
          component: () => import('@/views/index/index.vue')
        },
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/imagetext/imagetext',
          component: () => import('@/views/imagetext/imagetext.vue')
        },
        {
          path: '/videotext/videotext',
          component: () => import('@/views/videotext/videotext.vue')
        }
      ]
    },
    { path: '/Home/index', component: () => import('@/views/Home/index.vue') },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    { path: '/Home/index2', component: () => import('@/views/Home/index2.vue') }
  ]
})

//登录访问拦截
router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})
export default router
