import request from '@/utils/request'

export function accountLogin(data) {
  return request({
    url: '/user/login/account',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getProfile() {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}
export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data
  })
}
export function updateProfile(data) {
  return request({
    url: '/user/profile',
    method: 'post',
    data
  })
}
export function updateUserPwd(data) {
  return request({
    url: '/user/pwd',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function teacher(params) {
  return request({
    url: '/user/teacher',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}
export function changeState(data) {
  return request({
    url: '/user/changeState',
    method: 'put',
    data
  })
}
export function userInfo(id) {
  return request({
    url: `/user/userInfo/${id}`,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `/user/update`,
    method: 'put',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete'
  })
}
export function restPwd(id, newPwd) {
  return request({
    url: `/user/resetPwd`,
    method: 'put',
    data: { id, password: newPwd }
  })
}
export function authRole(userId) {
  return request({
    url: `/user/authRole/${userId}`,
    method: 'get'
  })
}
export function updateAuthRole(params) {
  return request({
    url: `/user/authRole`,
    method: 'put',
    params
  })
}
