import request from '@/utils/request'

export default {
  list() {
    return request({
      url: '/teachingGroup/list',
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: '/teachingGroup/add',
      method: 'post',
      data
    })
  },
  delete(id) {
    return request({
      url: `/teachingGroup/delete/${id}`,
      method: 'delete'
    })
  },
  update(id, data) {
    return request({
      url: `/teachingGroup/update/${id}`,
      method: 'put',
      data
    })
  }

}

