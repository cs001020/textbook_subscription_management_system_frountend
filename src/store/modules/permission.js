import { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import ParentView from '@/layout/ParentView/index.vue'
import store from '@/store'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

// 遍历后台传来的路由字符串，转换为组件对象
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
  return res
}
// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (hasPermissionOr(route.permissions)) {
        res.push(route)
      }
    }
  })
  return res
}

// 验证用户是否含有指定权限，只需包含其中一个
function hasPermissionOr(permissions) {
  return permissions.some(item => {
    return authPermission(item)
  })
}
function authPermission(permission) {
  const permissions = store.getters && store.getters.permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return v === permission
    })
  } else {
    return false
  }
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
      const permissionsRouters = filterDynamicRoutes(dynamicRoutes)
      const routers = accessedRoutes.concat(permissionsRouters)
      // 404 page must be placed at the end !!!
      routers.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', routers)
      resolve(routers)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
