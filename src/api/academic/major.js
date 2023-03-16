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
  add(data) {
    return request({
      url: '/major/add',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `/major/update/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/major/delete/${id}`,
      method: 'delete'
    })
  }
}

