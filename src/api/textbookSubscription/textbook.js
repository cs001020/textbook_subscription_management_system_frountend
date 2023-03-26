import request from '@/utils/request'

export default {
  list(search) {
    return request({
      url: '/textbook/search',
      method: 'get',
      params: search
    })
  },
  listByIds(ids) {
    return request({
      url: '/textbook/byIds',
      method: 'get',
      params: { ids }
    })
  },
  me() {
    return request({
      url: '/textbook/me',
      method: 'get'
    })
  },
  addStock(id, params) {
    return request({
      url: `/textbook/addStock/${id}`,
      method: 'put',
      params
    })
  }
}

