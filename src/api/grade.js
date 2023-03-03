import request from '@/utils/request'

export default {
  list(majorId) {
    return request({
      url: `/grade/list/${majorId}`,
      method: 'get'
    })
  },
  all() {
    return request({
      url: `/grade/list`,
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `/grade/delete/${id}`,
      method: 'delete'
    })
  }
}

