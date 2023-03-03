import request from '@/utils/request'

export default {
  list() {
    return request({
      url: '/secondaryCollege/list',
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `/secondaryCollege/delete/${id}`,
      method: 'delete'
    })
  }
}
