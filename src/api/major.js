import request from '@/utils/request'

export default {
  list(secondaryCollegeId) {
    return request({
      url: `/major/list/${secondaryCollegeId}`,
      method: 'get'
    })
  },
  all() {
    return request({
      url: `/major/list`,
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `/major/delete/${id}`,
      method: 'delete'
    })
  }
}

