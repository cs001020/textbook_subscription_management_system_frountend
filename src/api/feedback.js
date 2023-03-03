import request from '@/utils/request'

export default {
  get(textbookId) {
    return request({
      url: `/feedback/get/${textbookId}`,
      method: 'get'
    })
  }
}

