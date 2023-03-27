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
  addTextbook(data) {
    return request({
      url: `/textbook/addTextBook`,
      method: 'post',
      data
    })
  },
  addStock(id, params) {
    return request({
      url: `/textbook/addStock/${id}`,
      method: 'put',
      params
    })
  },
  getById(id) {
    return request({
      url: `/textbook/${id}`,
      method: 'get'
    })
  },
  updateTextbook(data) {
    return request({
      url: `/textbook/update`,
      method: 'put',
      data
    })
  },
  discardTextbook(id) {
    return request({
      url: `/textbook/discard/${id}`,
      method: 'put'
    })
  }
}

