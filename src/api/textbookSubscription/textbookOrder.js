import request from '@/utils/request'

export default {
  list(params) {
    return request({
      url: '/textbookOrder/list',
      method: 'get',
      params
    })
  },
  grant(id) {
    return request({
      url: `/textbookOrder/grant/${id}`,
      method: 'post'
    })
  },
  getTextBook(id) {
    return request({
      url: `/textbookOrder/textbook/${id}`,
      method: 'get'
    })
  }
}

