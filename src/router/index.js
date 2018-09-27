import Vue from 'vue'
import Router from 'vue-router'
import storage, { TOKEN_KEY }from '../public/js/storage.js'

// 异步加载
const Register = () => import('@/components/Register')
const List = () => import('@/components/List')
const Data = () => import('@/components/Data')
const Edit = () => import('@/components/Edit')
const Fill = () => import('@/components/Fill')
const Login = () => import('@/components/Login')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/list',
    component: List,
    meta: { requiresAuth: true }
  },
  {
    path: '/fill',
    alias: '/view',
    component: Fill
  },
  {
    path: '/data',
    name: 'data',
    component: Data,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit',
    alias: ['/add', '/re-edit'],
    name: 'edit',
    component: Edit,
    meta: { requiresAuth: true }
  }
]

const router = new Router({ routes })
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!storage.get(TOKEN_KEY)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router