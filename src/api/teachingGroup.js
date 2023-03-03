import request from '@/utils/request'

export default {
  list() {
    return request({
      url: '/teachingGroup/list',
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `/teachingGroup/delete/${id}`,
      method: 'delete'
    })
  }
}

