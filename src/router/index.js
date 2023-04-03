import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/commons/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/commons/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/commons/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/commons/error-page/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/commons/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/commons/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/commons/profile/index.vue'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    hidden: true,
    component: Layout,
    permissions: ['system:user:auth'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: '分配角色',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:auth'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/academic/add-plan',
    component: Layout,
    hidden: true,
    permissions: ['academic:openingPlan:add'],
    children: [
      {
        path: 'add',
        component: () => import('@/views/academic/openingPlan/importOpeningPlan.vue'),
        name: 'AddPlan',
        meta: { title: '添加开课计划', activeMenu: '/academic/openingPlan' }
      }
    ]
  },
  {
    path: '/textbookSubscription/opening-plan',
    component: Layout,
    hidden: true,
    permissions: ['textbookSubscription:openingPlan:submit'],
    children: [
      {
        path: 'textbook-select/:openingPlanId(\\d+)',
        component: () => import('@/views/textbookSubscription/openingPlan/select.vue'),
        name: 'TextbookSelect1',
        meta: { title: '选择教材', activeMenu: '/textbookSubscription/openingPlan' }
      }
    ]
  },
  {
    path: '/textbookSubscription/approval-re',
    component: Layout,
    hidden: true,
    permissions: ['textbookSubscription:audit:resubmit'],
    children: [
      {
        path: 'textbook-select/:approvalId(\\d+)',
        component: () => import('@/views/textbookSubscription/approval/reSelect.vue'),
        name: 'TextbookSelect2',
        meta: { title: '重新申请', activeMenu: '/textbookSubscription/approval' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
