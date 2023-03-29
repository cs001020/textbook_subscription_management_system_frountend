import request from '@/utils/request'

export default {

  list() {
    return request({
      url: '/plan/list',
      method: 'get'
    })
  },
  me() {
    return request({
      url: '/plan/me',
      method: 'get'
    })
  },
  getPlanById(id) {
    return request({
      url: `/plan/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: '/plan/import',
      method: 'post',
      data
    })
  },
  courseSearch(params) {
    return request({
      url: '/plan/course',
      method: 'get',
      params
    })
  },
  getGrade() {
    return request({
      url: '/plan/garde',
      method: 'get'
    })
  },
  getTeachingGroup() {
    return request({
      url: '/plan/teachingGroup',
      method: 'get'
    })
  },
  deleteById(id) {
    return request({
      url: `/plan/${id}`,
      method: 'delete'
    })
  },
  updateOpeningPlan(id, data) {
    return request({
      url: `/plan/${id}`,
      method: 'put',
      data
    })
  }
}

