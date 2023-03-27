import request from '@/utils/request'

export default {
  getByTextbookId(textbookId) {
    return request({
      url: `/feedback/get/${textbookId}`,
      method: 'get'
    })
  }
}

