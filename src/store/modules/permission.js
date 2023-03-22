import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import ParentView from '@/layout/ParentView/index.vue'
import store from '@/store'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// eslint-disable-next-line no-unused-vars
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.component) {
      if (tmp.component === 'Layout') {
        tmp.component = Layout
      } else if (tmp.component === 'ParentView') {
        tmp.component = ParentView
      } else {
        try {
          tmp.component = _import(tmp.component)// 导入组件
        } catch (error) {
          console.log(error)
          tmp.component = () => import('@/views/commons/error-page/404')// 导入组件
        }
      }
    }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles)
    }
    res.push(tmp)
  })
  // 404 page must be placed at the end !!!
  res.push({ path: '*', redirect: '/404', hidden: true })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(store.getters.routers, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
