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
  }
}

