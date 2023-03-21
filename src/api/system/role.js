import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}
export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}

export function list(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

export function changeState(id, state) {
  return request({
    url: '/role/changeState',
    method: 'put',
    data: { id, state }
  })
}
export function getRoleInfo(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}
export function updateRole(data) {
  return request({
    url: `/role/update`,
    method: 'put',
    data
  })
}
export function addRole(data) {
  return request({
    url: `/role/add`,
    method: 'post',
    data
  })
}
export function delRole(id) {
  return request({
    url: `/role/del/${id}`,
    method: 'DELETE'
  })
}
export function allocatedUserList(roleId, params) {
  return request({
    url: `/role/authUser/allocatedList/${roleId}`,
    method: 'get',
    params
  })
}
export function unallocatedUserList(roleId, params) {
  return request({
    url: `/role/authUser/unallocatedList/${roleId}`,
    method: 'get',
    params
  })
}
export function authUserSelectAll(params) {
  return request({
    url: `/role/authUser/selectAll`,
    method: 'put',
    params
  })
}
export function authUserCancelAll(params) {
  return request({
    url: `/role/authUser/cancelAll`,
    method: 'DELETE',
    params
  })
}
