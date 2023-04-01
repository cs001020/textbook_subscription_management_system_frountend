import request from '@/utils/request'

export default {
  list(params) {
    return request({
      url: '/approval/list',
      method: 'get',
      params
    })
  },
  me() {
    return request({
      url: '/approval/me',
      method: 'get'
    })
  },
  teachingGroupUnApproval() {
    return request({
      url: '/approval/unApproval/teachingGroup',
      method: 'get'
    })
  },
  secondaryCollegeUnApproval() {
    return request({
      url: '/approval/unApproval/secondaryCollege',
      method: 'get'
    })
  },
  academicAffairsOfficeUnApproval() {
    return request({
      url: '/approval/unApproval/academicAffairsOffice',
      method: 'get'
    })
  },
  teachingGroupAudit(id, data) {
    return request({
      url: `/approval/teachingGroup/${id}`,
      method: 'post',
      data
    })
  },
  secondaryCollegeAudit(id, data) {
    return request({
      url: `/approval/secondaryCollege/${id}`,
      method: 'post',
      data
    })
  },
  academicAffairsOfficeAudit(id, data) {
    return request({
      url: `/approval/academicAffairsOffice/${id}`,
      method: 'post',
      data
    })
  },
  submit(data) {
    return request({
      url: '/approval/submit',
      method: 'post',
      data
    })
  },
  reSubmit(id, data) {
    return request({
      url: `/approval/reSubmit/${id}`,
      method: 'post',
      data
    })
  },
  getDetails(id) {
    return request({
      url: `/approval/details/${id}`,
      method: 'get'
    })
  },
  adminDel(id) {
    return request({
      url: `/approval/admin/${id}`,
      method: 'delete'
    })
  },
  getTextbook(id) {
    return request({
      url: `/approval/textbook/${id}`,
      method: 'get'
    })
  }
}

