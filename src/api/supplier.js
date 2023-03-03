import request from '@/utils/request'

export default {
  list() {
    return request({
      url: '/supplier/list',
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/supplier/add',
      method: 'post',
      data
    })
  },
  delete(id) {
    return request({
      url: `/supplier/delete/${id}`,
      method: 'delete'
    })
  },
  update(id, data) {
    return request({
      url: `/supplier/update/${id}`,
      method: 'put',
      data
    })
  }
}

