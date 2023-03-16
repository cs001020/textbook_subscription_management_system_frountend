import request from '@/utils/request'

export default {
  list() {
    return request({
      url: '/secondaryCollege/list',
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: '/secondaryCollege/add',
      method: 'post',
      data
    })
  },
  delete(id) {
    return request({
      url: `/secondaryCollege/delete/${id}`,
      method: 'delete'
    })
  },
  update(id, data) {
    return request({
      url: `/secondaryCollege/update/${id}`,
      method: 'put',
      data
    })
  }
}
