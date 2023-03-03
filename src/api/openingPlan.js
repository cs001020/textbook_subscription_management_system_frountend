import request from '@/utils/request'

export default {

  list() {
    return request({
      url: '/plan/list',
      method: 'get'
    })
  },
  me() {
    return request({
      url: '/plan/me',
      method: 'get'
    })
  },
  getPlanById(id) {
    return request({
      url: `/plan/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: '/plan/import',
      method: 'post',
      data
    })
  }
}

