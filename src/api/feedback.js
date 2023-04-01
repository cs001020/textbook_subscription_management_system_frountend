import request from '@/utils/request'

export default {
  getByTextbookId(textbookId) {
    return request({
      url: `/feedback/get/${textbookId}`,
      method: 'get'
    })
  },
  submitFeedback(data) {
    return request({
      url: `/feedback/add`,
      method: 'post',
      data
    })
  }
}

