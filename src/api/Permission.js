import request from '@/utils/request'

export default {
  findNodes() {
    return request({
      url: '/permission/list',
      method: 'get'
    })
  },
  save(data) {
    return request({
      url: '/permission/add',
      method: 'post',
      data
    })
  }
}
