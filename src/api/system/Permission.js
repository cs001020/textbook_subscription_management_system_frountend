import request from '@/utils/request'

export default {
  list(params) {
    return request({
      url: '/permission/list',
      method: 'get',
      params
    })
  },
  addPermission(data) {
    return request({
      url: '/permission/add',
      method: 'post',
      data
    })
  },
  getPermissionById(id) {
    return request({
      url: `/permission/${id}`,
      method: 'get'
    })
  },
  updatePermission(data) {
    return request({
      url: '/permission/update',
      method: 'put',
      data
    })
  },
  delPermission(id) {
    return request({
      url: `/permission/del/${id}`,
      method: 'delete'
    })
  },
  changeState(data) {
    return request({
      url: `/permission/changeSate`,
      method: 'put',
      data
    })
  }
}
