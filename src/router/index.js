import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        // 所有的子路由都渲染到伏组件的router-view中
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
        },
        {
          name: 'source',
          path: '/source',
          component: () => import('@/views/source')
        },
        {
          name: 'fans',
          path: '/fans',
          component: () => import('@/views/fans')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
router.beforeEach((to, from, next) => {
  nprogress.start()
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  if (to.path !== '/login') {
    if (!userInfo) {
      return next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // 如果登录了就不允许再次访问登录页面
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  }
  // next()
})
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
