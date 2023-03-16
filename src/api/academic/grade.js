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
  },
  add(data) {
    return request({
      url: `/grade/add`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `/grade/update/${id}`,
      method: 'put',
      data
    })
  }
}

